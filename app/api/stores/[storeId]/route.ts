import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    { params } : { params : { storeId : string }}
){
    try {
        const url = new URL(req.url);
        console.log(url?.searchParams);
        const { userId } = auth();
        const body = await req.json();

        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        const { name } = body;

        if(!name){
            return new NextResponse("Name is Required", { status: 400 })
        }

        if(!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 })
        }

        const store = await prismadb.store.updateMany({
            where : {
                id: params.storeId,
                userId
            }, 
            data: {
                name
            }
        });
        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params : { storeId : string }}
){
    try {
        const url = new URL(req.url);
        console.log(url);
        const { userId } = auth();

        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 })
        }

        const store = await prismadb.store.deleteMany({
            where : {
                id: params.storeId,
                userId
            }, 
        });
        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORES_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}