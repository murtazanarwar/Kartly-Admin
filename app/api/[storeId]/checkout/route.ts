import { NextResponse } from "next/server";
import { z } from "zod";
import prismadb from "@/lib/prismadb";
import razorpay from "@/lib/razorpay";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_STORE_URL || "https://house-holder-hub-store.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().nonempty(),
        quantity: z.number().int().min(1),
      })
    )
    .nonempty("Cart items are required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\+?\d+$/, "Phone must contain only digits and may start with +"),
  address: z.string().min(5, "Please enter a valid shipping address"),
  customerId: z.string().nonempty("Customer ID is required"),
  discount: z.number().default(0),
  couponId: z.string().optional(),
});

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId?: string } }
) {
  const storeId = params.storeId;
  if (!storeId) {
    return NextResponse.json(
      { success: false, error: "Store ID is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.format() },
      { status: 400, headers: corsHeaders }
    );
  }

  const { items, phoneNumber, address, customerId, discount, couponId } =
    parsed.data;

  // Fetch product details (optional: validate existence)
  const productIds = items.map((i) => i.productId);
  const products = await prismadb.product.findMany({
    where: { id: { in: productIds }, storeId },
  });

  if (products.length !== items.length) {
    return NextResponse.json(
      { success: false, error: "One or more products not found" },
      { status: 404, headers: corsHeaders }
    );
  }

  // Calculate total (in paise)
  let totalAmount = items.reduce((sum, { productId, quantity }) => {
    const prod = products.find((p) => p.id === productId)!;
    return sum + prod.price.toNumber() * quantity * 100;
  }, 0);
  totalAmount -= discount;

  let order;
  try {
    // Create order and items (no stock changes here)
    order = await prismadb.order.create({
      data: {
        storeId,
        phone: phoneNumber,
        address,
        isPaid: false,
        customerId,
        ...(couponId && { couponId }),
        orderItems: {
          create: items.map(({ productId, quantity }) => ({
            product: { connect: { id: productId } },
            quantity,
          })),
        },
      },
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).slice(2, 10)}`,
      notes: { orderId: order.id },
    });

    // Persist Razorpay order ID
    await prismadb.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        razorpayKey: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("[CHECKOUT_POST]", err);
    // Cleanup on error
    if (order?.id) {
      try {
        await prismadb.order.delete({ where: { id: order.id } });
      } catch {}
    }
    return NextResponse.json(
      { success: false, redirectUrl: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1` },
      { headers: corsHeaders }
    );
  }
}
