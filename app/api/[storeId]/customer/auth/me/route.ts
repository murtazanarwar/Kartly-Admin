import { getDataFromToken } from "@/lib/get-data-from-token";
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(request: NextRequest, { params } : { params: { storeId: string }}) {
  try {
    if(!params.storeId){
        return new NextResponse("storeId is required", { status: 400 });
    }
    // 1) Extract userId from the JWT in the request (cookies or headers)
    const userId = await getDataFromToken(request);

    // 2) Fetch the user (omit password)
    const user = await prismadb.customer.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 3) Return user data
    return NextResponse.json(
      {
        message: "User data fetched successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log('[CUSTOMER_DATA_FETCH]', error);
    return NextResponse.json(
      { error: error.message || "Authentication error" },
      { status: 401 }
    );
  }
}
