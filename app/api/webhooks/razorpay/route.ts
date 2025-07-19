import { NextResponse } from "next/server";
import crypto from "crypto";
import prismadb from "@/lib/prismadb";

export const config = {
  api: { bodyParser: false },
};

// utility to buffer the ReadableStream
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
      // lookup your order by razorpayOrderId
      const order = await prismadb.order.findFirst({
        where: { razorpayOrderId },
      });
      if (order && !order.isPaid) {
        await prismadb.order.update({
          where: { id: order.id },
          data: {
            isPaid: true,
            razorpayPaymentId: paymentId,
            paidAt: new Date(),
          },
        });
      }
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[WEBHOOK_HANDLER]", err);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  // 3) Acknowledge all other events
  return NextResponse.json({ ok: true });
}
