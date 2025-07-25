import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

const Navbar = async () => {
  const { userId } = auth();

  if(!userId){
    redirect("/sign-in"); 
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    } ,
  });

  return (
    <div className="border-b">
        <div className="flex h-16 items-center px-4">
            <StoreSwitcher items={stores}/>
            <div className="ml-2">      
                <Link href={`${process.env.FRONTEND_STORE_URL}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Go to Store
                  </Button>
                </Link>
            </div>
            <MainNav className="mx-6"/>
            <div className="ml-auto flex items-center space-x-4">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    </div>
  )
}

export default Navbar;