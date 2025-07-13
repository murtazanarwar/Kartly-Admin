import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  const { storeId, productId } = params;

  const product = await prismadb.product.findFirst({
    where: { id: productId, storeId },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const reviews = await prismadb.review.findMany({
    where: { productId },
    include: {
      customer: { select: { id: true, username: true } },
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  const { storeId, productId } = params;
  const body = await req.json();
  const { rating, comment, customerId, imageUrls } = body;

  const product = await prismadb.product.findFirst({
    where: { id: productId, storeId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const review = await prismadb.review.create({
    data: {
      rating,
      comment,
      product: { connect: { id: productId } }, //do same thing as flat assignment
      customer: { connect: { id: customerId } },
      images: {
        create: (imageUrls || []).map((url: string) => ({ url })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json(review, { status: 201 });
}
