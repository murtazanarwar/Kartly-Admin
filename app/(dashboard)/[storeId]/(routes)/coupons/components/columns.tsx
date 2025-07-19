"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type CouponColumn = {
  id: string
  code: string
  discountType: "PERCENTAGE" | "FIXED"
  discountValue: number
  createdAt: string
}

export const columns: ColumnDef<CouponColumn>[] = [
  {
    accessorKey: "code",
    header: "Coupon Code",
  },
  {
    accessorKey: "discountType",
    header: "Type",
  },
  {
    accessorKey: "discountValue",
    header: "Value",
    cell: ({ row }) => {
      const { discountValue, discountType } = row.original
      return discountType === "PERCENTAGE"
        ? `${discountValue}%`
        : `₹${discountValue}`
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
