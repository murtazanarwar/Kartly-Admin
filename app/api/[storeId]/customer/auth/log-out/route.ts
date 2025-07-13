import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params } : { params: { storeId: string }}) {
    try {
        if(!params.storeId){
            return new NextResponse("storeId is required", { status: 400 });
        }
        const response = NextResponse.json({
            message: "Logout Successful",
            success: true
        })
        response.cookies.set("token","",{httpOnly : true, expires: new Date(0)});

        return response;
    } catch (error: any) {
        console.log('[CUSTOMER_LOGOUT]', error);
        return NextResponse.json({error:error.message},{status:500})
    }
}