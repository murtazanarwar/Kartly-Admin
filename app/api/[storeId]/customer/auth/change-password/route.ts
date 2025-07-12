import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import prismadb from "@/lib/prismadb";

export async function POST(request: NextRequest, { params } : { params: { storeId: string }}) {
  try {
    const { token, confirmpassword } = await request.json();

    if (!token) {
        return new NextResponse("Token Not Found", { status: 400 });
    }

    if (!confirmpassword) {
        return new NextResponse("Password is required", { status: 400 });
    }

    if(!params.storeId){
        return new NextResponse("storeId is required", { status: 400 });
    }

    // 1) Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(confirmpassword, salt);

    // 2) Look up the user by token & expiry
    const userRecord = await prismadb.customer.findFirst({
      where: {
        storeId: params.storeId,
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // 3) Update the password (and optionally clear the token fields)
    await prismadb.customer.update({
      where: { id: userRecord.id },
      data: {
        password: hashedPassword,
        forgotPasswordToken: null,
        forgotPasswordTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log('[CUSTOMER_CHANGE_PASSWORD]', error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
