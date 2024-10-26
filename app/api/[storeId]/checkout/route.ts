import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
};


export async function POST(
    req: Request,
    { params } : { params: { storeId: string }}
) {
    try {
        const { productIds, phoneNumber } = await req.json();

        if(!productIds || productIds.length === 0){
            return new NextResponse("Product Ids are Required", { status: 400 });
        }

        if(!phoneNumber){
            return new NextResponse("Phone Number are Required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        });

        const order = await prismadb.order.create({
            data: {
                storeId: params.storeId,
                isPaid: false,
                orderItems: {
                    create: productIds.map((productId: string) => ({
                        product: {
                            connect: {
                                id:productId
                            }
                        }
                    }))
                },
                phone: phoneNumber,
            }
        });

        return NextResponse.json({ url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`}, {
            headers: corsHeaders
        });
    } catch (error) {
        console.log('[CHECKOUT_POST]', error);
        return NextResponse.json({ url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`}, {
            headers: corsHeaders
        });
    }
}