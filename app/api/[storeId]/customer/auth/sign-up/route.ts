import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import prismadb from "@/lib/prismadb";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: NextRequest, { params } : { params: { storeId: string }}) {
  try {
    const { username, email, password } = await request.json();

    if (!username) {
        return new NextResponse("Username is required", { status: 400 });
    }

    if (!email) {
        return new NextResponse("Email is required", { status: 400 });
    }

    if (!password) {
        return new NextResponse("Password is Required", { status: 400 });
    }

    if(!params.storeId){
        return new NextResponse("storeId is required", { status: 400 });
    }

    // 1) Check if user already exists
    const existing = await prismadb.customer.findUnique({
      where: {
        email_storeId: {
          email,
          storeId: params.storeId
        }
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 2) Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashed = await bcryptjs.hash(password, salt);

    // 3) Create user
    const newUser = await prismadb.customer.create({
      data: {
        username,
        email,
        password: hashed,
        storeId: params.storeId
      },
      select: {
        id: true,
        email: true,
      },
    });

    // 4) Send verification email
    await sendEmail({
      email: newUser.email,
      emailType: "VERIFY",
      userId: newUser.id,
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.log('[CUSTOMER_SIGNUP]', error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
