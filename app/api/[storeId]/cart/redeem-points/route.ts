import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(request: NextRequest) {
  try {
    const { customerId, cartTotal, pointsToRedeem } = await request.json();
    if (!customerId || typeof cartTotal !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 });
    }

    const lp = await prismadb.loyaltyPoint.findUnique({ where: { customerId } });
    const currentPoints = lp ? lp.points : 0;
    if (currentPoints <= 0) {
      return NextResponse.json({ error: 'No loyalty points available.' }, { status: 400 });
    }

    const maxDiscount = Math.floor(cartTotal * 0.1);
    const maxPointsAllowed = Math.floor(maxDiscount / 0.1);

    let usePoints = typeof pointsToRedeem === 'number'
      ? Math.min(pointsToRedeem, currentPoints, maxPointsAllowed)
      : Math.min(currentPoints, maxPointsAllowed);

    if (usePoints <= 0) {
      return NextResponse.json({ error: 'Unable to redeem any points under current rules.' }, { status: 400 });
    }

    const discount = parseFloat((usePoints * 0.1).toFixed(2));

    await prismadb.loyaltyPoint.update({
      where: { customerId },
      data: { points: { decrement: usePoints } }
    });

    return NextResponse.json({ discount, pointsUsed: usePoints });
  } catch (err: any) {
    console.error("[REDEEM_POINTS_POST]", err);
    return NextResponse.json({ error: 'Server error redeeming points.' }, { status: 500 });
  }
}