import { NextResponse } from "next/server";
import crypto from "crypto";
import prismadb from "@/lib/prismadb";
import { emitStockUpdate } from "@/lib/emit-stock";

export const routeSegmentConfig = {
  api: { bodyParser: false },
};

// Utility to buffer the ReadableStream
async function buffer(stream: ReadableStream) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;
  while (!done) {
    const { value, done: d } = await reader.read();
    if (value) chunks.push(value);
    done = d;
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  // 1) Get raw body & verify signature
  const bodyBuf = await buffer(req.body as any);
  const bodyText = bodyBuf.toString("utf-8");
  const expected = crypto
    .createHmac("sha256", secret)
    .update(bodyText)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2) Parse payload
  const { event, payload } = JSON.parse(bodyText);
  const payment = payload?.payment?.entity;

  if (event === "payment.captured" && payment) {
    const { order_id: razorpayOrderId, id: paymentId } = payment;

    try {
      // 3) Load the order with its items
      const order = await prismadb.order.findFirst({
        where: { razorpayOrderId },
        include: {
          orderItems: {
            select: { productId: true, quantity: true },
          },
        },
      });

      if (order && !order.isPaid) {
        // 4) Prepare updates:
        const txOperations: any[] = [];

        // a) Mark order as paid
        txOperations.push(
          prismadb.order.update({
            where: { id: order.id },
            data: {
              isPaid: true,
              razorpayPaymentId: paymentId,
              paidAt: new Date(),
            },
          })
        );

        // b) Decrement stock for each product
        for (const item of order.orderItems) {
          txOperations.push(
            prismadb.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
          );
        }

        // c) If there’s a coupon, record usage + increment count
        if (order.couponId) {
          txOperations.push(
            prismadb.couponUsage.create({
              data: {
                couponId: order.couponId,
                customerId: order.customerId,
              },
            }),
            prismadb.coupon.update({
              where: { id: order.couponId },
              data: { usedCount: { increment: 1 } },
            })
          );
        }

        // 5) Execute all in one transaction
        const results = await prismadb.$transaction(txOperations);
        
        // 6) notify socket‑service
        for (const r of results) {
          if (r && typeof (r as any).stock === 'number') {
            const { id, stock } = r as { id: string; stock: number };
            await emitStockUpdate(id, stock);
          }
        }
      }

      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[WEBHOOK_HANDLER]", err);
      return NextResponse.json(
        { error: "Processing failed" },
        { status: 500 }
      );
    }
  }

  // For other events, just ACK
  return NextResponse.json({ ok: true });
}
