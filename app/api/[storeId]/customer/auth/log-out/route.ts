import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_STORE_URL || "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
}

export async function GET(request: NextRequest, { params } : { params: { storeId: string }}) {
    try {
        if(!params.storeId){
            return new NextResponse("storeId is required", { status: 400 });
        }
        const response = NextResponse.json({
            message: "Logout Successful",
            success: true
        }, { status: 200, headers: corsHeaders })
        response.cookies.set("token","",{httpOnly : true, expires: new Date(0)});

        return response;
    } catch (error: any) {
        console.log('[CUSTOMER_LOGOUT]', error);
        return NextResponse.json({error:error.message},{status:500})
    }
}