import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { z } from "zod";

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_STORE_URL || 'http://localhost:3000',
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const bodySchema = z.object({
  productIds: z.array(z.string()).nonempty("Product IDs are required"),
  customerId: z.string().nonempty("Customer ID is required"),
  couponCode: z.string(),
});

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest, { params }: { params: { storeId: string } } ) {
  try {
    const storeId = params.storeId;
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: "Store ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.format() },
        { status: 400, headers: corsHeaders }
      );
    }

    const { couponCode, customerId, productIds } = parsed.data;

    const products = await prismadb.product.findMany({
      where: { id: { in: productIds }, storeId },
    });
    if (products.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid products found" },
        { status: 404, headers: corsHeaders }
      );
    }
  
    let cartTotal = products.reduce(
      (sum, p) => sum + p.price.toNumber() * 100,
      0
    );

    const coupon = await prismadb.coupon.findUnique({
      where: {
        code_storeId: {
          code: couponCode.trim(),
          storeId,
        },
      },
    });

    if (!coupon || !coupon.active) {
      return NextResponse.json(
        { error: "Invalid or inactive coupon." },
        { status: 400 }
      );
    }

    const now = new Date();
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json(
        { error: "This coupon has expired." },
        { status: 400 }
      );
    }

    if (coupon.minCartValue && cartTotal < coupon.minCartValue) {
      return NextResponse.json(
        { error: `Cart must be at least ₹${coupon.minCartValue}.` },
        { status: 400 }
      );
    }

    const alreadyUsed = await prismadb.couponUsage.findFirst({
      where: { couponId: coupon.id, customerId },
    });
    if (alreadyUsed) {
      return NextResponse.json(
        { error: "You have already used this coupon." },
        { status: 400 }
      );
    }

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return NextResponse.json(
        { error: "This coupon has reached its usage limit." },
        { status: 400 }
      );
    }

    // Calculate discount
const cartTotalPaise = products.reduce(
  (sum, p) => sum + p.price.toNumber() * 100,
  0
);

    // 2. Compute discount in paise
    let discountPaise: number;
    if (coupon.discountType === "PERCENTAGE") {
      discountPaise = Math.floor((cartTotalPaise * coupon.discountValue) / 100);
    } else {
      discountPaise = coupon.discountValue * 100; // assume flat value in rupees
    }

    // 3. Convert to rupees for the client
    const discount = discountPaise / 100;

    return NextResponse.json({ discount, couponId: coupon.id });
  } catch (err: any) {
    console.error("[APPLY_COUPON_POST]", err);
    return NextResponse.json(
      { error: "Server error applying coupon." },
      { status: 500 }
    );
  }
}
