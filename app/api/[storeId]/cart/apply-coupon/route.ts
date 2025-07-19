import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(request: NextRequest) {
  try {
    const { couponCode, customerId, cartTotal } = await request.json();

    const coupon = await prismadb.coupon.findUnique({
      where: { code: couponCode.trim() },
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

    let discount: number;
    if (coupon.discountType === "PERCENTAGE") {
      discount = Math.floor((cartTotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    await prismadb.$transaction([
      prismadb.couponUsage.create({
        data: { couponId: coupon.id, customerId },
      }),
      prismadb.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ discount, couponId: coupon.id });
  } catch (err: any) {
        console.error("[APPLY_COUPON_POST]", err);    return NextResponse.json(
      { error: "Server error applying coupon." },
      { status: 500 }
    );
  }
}
