import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_STORE_URL || "https://house-holder-hub-store.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(request: NextRequest, { params }: { params: { storeId: string; couponId: string } }) {
    const storeId = params.storeId;
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: "Store ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const {customerId} = await request.json();

    if (!customerId) return new NextResponse("Unauthorized", { status: 401 });

    const orders = await prismadb.order.findMany({
        where: { customerId },
        include: {
        orderItems: {
            include: { product: true },
        },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
}
