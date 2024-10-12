"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";
import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if( !isOpen ){
      onOpen();
    }
  },[isOpen, onOpen]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-end">
        <UserButton />
      </div>
      Root Page
    </div>
  );
}
