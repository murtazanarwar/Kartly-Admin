import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params } : { params: { storeId: string }}) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include : {
          product: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => {
    // compute total as sum of (price * quantity)
    const rawTotal = order.orderItems.reduce((sum, oi) => {
      const price = Number(oi.product.price);            // ensure numeric
      return sum + price * oi.quantity;
    }, 0);

    return {
      id: order.id,
      phone: order.phone,
      address: order.address,
      products: order.orderItems
        .map((oi) => `${oi.quantity} × ${oi.product.name}`)
        .join(', '),
      totalPrice: formatter.format(rawTotal),
      isPaid: order.isPaid,
      createdAt: format(order.createdAt, 'do MMMM, yyyy'),
    };
  });
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <OrderClient data={formattedOrders} />
        </div>
    </div>
  )
}

export default OrdersPage