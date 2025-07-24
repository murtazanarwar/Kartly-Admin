import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { z } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_STORE_URL || "https://house-holder-hub-store.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().nonempty("Product ID is required"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    )
    .nonempty("Cart items are required"),
  customerId: z.string().nonempty("Customer ID is required"),
  couponCode: z.string().nonempty("Coupon code is required"),
});

/** Flatten all Zod validation messages to one string */
function formatZodError(err: z.ZodError) {
  return err.errors.map((e) => e.message).join(", ");
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
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
      const message = formatZodError(parsed.error);
      return NextResponse.json(
        { success: false, error: message },
        { status: 400, headers: corsHeaders }
      );
    }

    const { items, customerId, couponCode } = parsed.data;

    // 1. Fetch products
    const productIds = items.map((i) => i.productId);
    const products = await prismadb.product.findMany({
      where: { id: { in: productIds }, storeId },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, error: "One or more products not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // 2. Compute cart total in paise (₹ × 100)
    const cartTotalPaise = items.reduce((sum, { productId, quantity }) => {
      const prod = products.find((p) => p.id === productId)!;
      return sum + prod.price.toNumber() * quantity * 100;
    }, 0);

    // 3. Load coupon
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
        { success: false, error: "Invalid or inactive coupon." },
        { status: 400, headers: corsHeaders }
      );
    }

    const now = new Date();
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json(
        { success: false, error: "This coupon has expired." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (coupon.minCartValue && cartTotalPaise < coupon.minCartValue * 100) {
      return NextResponse.json(
        {
          success: false,
          error: `Cart must be at least ₹${coupon.minCartValue}.`,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const alreadyUsed = await prismadb.couponUsage.findFirst({
      where: { couponId: coupon.id, customerId },
    });
    if (alreadyUsed) {
      return NextResponse.json(
        { success: false, error: "You have already used this coupon." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: "This coupon has reached its usage limit." },
        { status: 400, headers: corsHeaders }
      );
    }

    // 4. Calculate discount in paise
    const discountPaise =
      coupon.discountType === "PERCENTAGE"
        ? Math.floor((cartTotalPaise * coupon.discountValue) / 100)
        : coupon.discountValue * 100;

    // 5. Return discount in rupees
    const discount = discountPaise / 100;
    return NextResponse.json(
      { success: true, discount, couponId: coupon.id },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("[APPLY_COUPON_POST]", err);
    return NextResponse.json(
      { error: "Server error applying coupon." },
      { status: 500 }
    );
  }
}