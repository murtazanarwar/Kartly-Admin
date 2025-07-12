import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import prismadb from "@/lib/prismadb";


export async function POST(request: NextRequest, { params } : { params: { storeId: string }}) {
  try {
    const { email, password } = await request.json();

    if (!email) {
        return new NextResponse("email is required", { status: 400 });
    }

    if (!password) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    if(!params.storeId){
        return new NextResponse("storeId is required", { status: 400 });
    }


    // 1) Look up the user by email and storeId
    const customer = await prismadb.customer.findUnique({
      where: {
        email_storeId: {
          email,
          storeId: params.storeId
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "user does not exist" },
        { status: 400 }
      );
    }

    // 2) Verify password
    const isValid = await bcryptjs.compare(password, customer.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    // 3) Create JWT
    const tokenPayload = {
      id: customer.id,
      email: customer.email,
      username: customer.username,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.TOKEN_SECRET as string,
      { expiresIn: "1h" }
    );

    // 4) Return response & set cookie
    const response = NextResponse.json(
      { user: {
        id: customer.id,      
        name: customer.username,
        email: customer.email,
      }, token },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error: any) {
    console.log('[CUSTOMER_LOGIN]', error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

