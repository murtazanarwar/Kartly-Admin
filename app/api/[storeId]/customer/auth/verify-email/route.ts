import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(request: NextRequest, { params } : { params: { storeId: string }}) {
  try {
    const { token } = await request.json();

    if (!token) {
        return new NextResponse("Token Not Found", { status: 400 });
    }

    if(!params.storeId){
        return new NextResponse("storeId is required", { status: 400 });
    }
    // 1) Find the user with a matching token that hasn't expired
    const user = await prismadb.customer.findFirst({
      where: {
        storeId: params.storeId,
        verifyToken: token,
        verifyTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // 2) Mark as verified and clear token fields
    await prismadb.customer.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });

    return NextResponse.json(
      {
        message: "Email verified successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log('[CUSTOMER_EMAIL_VERIFICATION]', error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
