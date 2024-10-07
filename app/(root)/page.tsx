import { UserButton } from "@clerk/nextjs";

export default function setupPage() {
  return (
    <div className="p-4 flex items-start justify-end">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
