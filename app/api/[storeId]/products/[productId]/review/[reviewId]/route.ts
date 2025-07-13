import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; productId: string; reviewId: string } }
) {
  const { storeId, productId, reviewId } = params;

  const product = await prismadb.product.findFirst({
    where: { id: productId, storeId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const review = await prismadb.review.findFirst({
    where: { id: reviewId, productId },
    include: { images: true, customer: { select: { id: true, username: true } } },
  });

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  
  return NextResponse.json(review);
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string; reviewId: string } }
) {
  const { reviewId } = params;
  const body = await req.json();
  const { rating, comment } = body;

  const updated = await prismadb.review.update({
    where: { id: reviewId },
    data: { rating, comment, updatedAt: new Date() },
    include: { images: true, customer: { select: { id: true, username: true } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; productId: string; reviewId: string } }
) {
  const { reviewId } = params;
  await prismadb.review.delete({ where: { id: reviewId } });
  return NextResponse.json({ message: "Deleted" });
}
