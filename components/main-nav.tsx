"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MainNav({
  className,
}: React.HTMLAttributes<HTMLElement>) {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const params = useParams();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Overview',
      active: pathName === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards',
      active: pathName === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/coupons`,
      label: 'Coupons',
      active: pathName === `/${params.storeId}/coupons`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categories',
      active: pathName === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'Sizes',
      active: pathName === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'Colors',
      active: pathName === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Products',
      active: pathName === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'Orders',
      active: pathName === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      active: pathName === `/${params.storeId}/settings`,
    },
  ];

  return (
    <div>
      <div className={`absolute z-50 border border-t-0 border-black sm:border-0 sm:static bg-white sm:bg-transparent sm:min-h-0 left-0 sm:left-auto ${isOpen ? 'top-[9%]' : 'top-[-100%]'} sm:top-auto w-full sm:w-auto flex sm:flex-none items-center sm:items-start px-5 pt-4 sm:px-0 sm:pt-0`}>
        <nav className={cn("flex flex-col sm:flex-row sm:items-center sm:space-x-4 lg:space-x-6 gap-8 sm:gap-0", className)}>
          {routes.map((route) => (
            <Link onClick={toggleNavbar}
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active ? "text-black dark:text-white" : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center absolute right-12 top-5 cursor-pointer sm:hidden">
        {!isOpen ? (
          <Menu onClick={toggleNavbar} />
        ) : (
          <X onClick={toggleNavbar} />
        )}
      </div>
    </div>
  );
}