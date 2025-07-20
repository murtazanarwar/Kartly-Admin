import { NextResponse } from "next/server";
import { z } from "zod";
import prismadb from "@/lib/prismadb";
import razorpay from "@/lib/razorpay";

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_STORE_URL || 'http://localhost:3000',
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const bodySchema = z.object({
  productIds: z.array(z.string()).nonempty("Product IDs are required"),
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
  if (!storeId)
    return NextResponse.json(
      { success: false, error: "Store ID is required" },
      { status: 400, headers: corsHeaders }
    );

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json(
      { success: false, error: parsed.error.format() },
      { status: 400, headers: corsHeaders }
    );

  const { productIds, phoneNumber, address, customerId, discount, couponId } =
    parsed.data;

  const products = await prismadb.product.findMany({
    where: { id: { in: productIds }, storeId },
  });
  if (products.length === 0)
    return NextResponse.json(
      { success: false, error: "No valid products found" },
      { status: 404, headers: corsHeaders }
    );

  let totalAmount = products.reduce(
    (sum, p) => sum + p.price.toNumber() * 100,
    0
  );
  totalAmount -= discount;

  let order;
  try {
    order = await prismadb.order.create({
      data: {
        storeId,
        phone: phoneNumber,
        address,
        isPaid: false,
        customerId,
        ...(couponId && { couponId }),
        orderItems: {
          create: productIds.map((id) => ({
            product: { connect: { id } },
          })),
        },
      },
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).slice(2, 10)}`,
      notes: { orderId: order.id },
    });

    order = await prismadb.order.update({
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
    if (order?.id) {
      try {
        await prismadb.order.delete({ where: { id: order.id } });
      } catch (cleanupErr) {
        console.error("Failed to cleanup order:", cleanupErr);
      }
    }
    return NextResponse.json(
      {
        success: false,
        redirectUrl: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      },
      { headers: corsHeaders }
    );
  }
}
