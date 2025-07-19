import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(request: NextRequest, { params }: { params: { storeId: string } }) {
  const { storeId } = params;
    if(!storeId){
        return new NextResponse("storeId is required", { status: 400 });
    }
  
    const coupons = await prismadb.coupon.findMany({
    where: { storeId },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(coupons);
}

export async function POST(request: NextRequest, { params }: { params: { storeId: string } }) {
  const { storeId } = params;
  const { code, discountType, discountValue, minCartValue, expiresAt, usageLimit } = await request.json();
  const coupon = await prismadb.coupon.create({
    data: {
      code,
      storeId,
      discountType,
      discountValue,
      minCartValue,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      usageLimit,
    }
  });
  return NextResponse.json(coupon, { status: 201 });
}