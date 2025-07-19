"use client";

import * as z from "zod";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Coupon } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  code: z.string().min(1),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0),
  minCartValue: z.number().min(0).optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().int().min(1).optional(),
});

type CouponFormValues = z.infer<typeof formSchema>;

interface CouponFormProps {
  initialData: Coupon | null;
}

export const CouponForm: React.FC<CouponFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const defaultValues: CouponFormValues = initialData
    ? {
        code: initialData.code,
        discountType: initialData.discountType as "PERCENTAGE" | "FIXED",
        discountValue: initialData.discountValue,
        minCartValue: initialData.minCartValue ?? undefined,
        expiresAt: initialData.expiresAt
          ? initialData.expiresAt.toISOString().split("T")[0]
          : undefined,
        usageLimit: initialData.usageLimit ?? undefined,
      }
    : {
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minCartValue: undefined,
        expiresAt: undefined,
        usageLimit: undefined,
      };

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const title = initialData ? "Edit Coupon" : "Create Coupon";
  const description = initialData
    ? "Edit an existing coupon."
    : "Add a new coupon.";
  const toastMessage = initialData ? "Coupon updated." : "Coupon created.";
  const action = initialData ? "Save Changes" : "Create";

  const onSubmit: SubmitHandler<CouponFormValues> = async (data) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/coupons/${params.couponId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/coupons`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/coupons`);
      toast.success(toastMessage);
    } catch (error) {
      console.error("[COUPON FORM]", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/coupons/${params.couponId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/coupons`);
      toast.success("Coupon deleted.");
    } catch (error) {
      console.error("[DELETE COUPON]", error);
      toast.error("Make sure no orders used this coupon first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. SAVE20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <FormControl>
                    <select
                      disabled={loading}
                      {...field}
                      className="block w-full p-2 border rounded"
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED">Fixed Amount</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minCartValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Cart Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading} className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
