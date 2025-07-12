import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: NextRequest, { params } : { params: { storeId: string }}) {
  try {
    const { email } = await request.json();

    if (!email) {
        return new NextResponse("Email is required", { status: 400 });
    }

    if(!params.storeId){
        return new NextResponse("storeId is required", { status: 400 });
    }
    // 1) Look up the user by email
    const user = await prismadb.customer.findUnique({
      where: {
        email_storeId: {
          email,
          storeId: params.storeId
        }
      },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist!" },
        { status: 400 }
      );
    }

    // 2) Send reset email
    await sendEmail({
      email,
      emailType: "RESET",
      userId: user.id,
    });

    // 3) Respond
    return NextResponse.json(
      { message: "Email sent", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.log('[CUSTOMER_FORGOT_PASSWORD]', error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
