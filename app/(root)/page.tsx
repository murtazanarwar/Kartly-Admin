import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function setupPage() {
  return (
    <div className="p-4">
      this is protected route
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
