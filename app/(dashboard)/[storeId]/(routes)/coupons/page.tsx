import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { CouponClient } from "./components/client";
import { CouponColumn } from "./components/columns";

const couponsPage = async ({ params }: { params: { storeId: string } }) => {
  const coupons = await prismadb.coupon.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' }
  });

  const formattedCoupons: CouponColumn[] = coupons.map((coupon) => ({
    id: coupon.id,
    code: coupon.code,
    discountType: coupon.discountType as 'PERCENTAGE' | 'FIXED',
    discountValue: coupon.discountValue,
    createdAt: format(coupon.createdAt, 'do MMMM, yyyy')
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CouponClient data={formattedCoupons} />
      </div>
    </div>
  );
};

export default couponsPage;
