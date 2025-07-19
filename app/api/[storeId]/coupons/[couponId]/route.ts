import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  request: NextRequest,
  { params }: { params: { storeId: string; couponId: string } }
) {
  const { storeId, couponId } = params;

  const coupon = await prismadb.coupon.findFirst({
    where: { id: couponId, storeId },
  });

  if (!coupon) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(coupon);
}

export async function PATCH(request: NextRequest, { params }: { params: { couponId: string } }) {
  const { couponId } = params;
  const { code, discountType, discountValue, minCartValue, expiresAt, usageLimit, active } = await request.json();
  const coupon = await prismadb.coupon.update({
    where: { id: couponId },
    data: { code, discountType, discountValue, minCartValue, expiresAt: expiresAt ? new Date(expiresAt) : null, usageLimit, active }
  });
  return NextResponse.json(coupon);
}

export async function DELETE(request: NextRequest, { params }: { params: { couponId: string } }) {
  const { couponId } = params;
  await prismadb.coupon.delete({ where: { id: couponId } });
  return NextResponse.json({ id: couponId });
}