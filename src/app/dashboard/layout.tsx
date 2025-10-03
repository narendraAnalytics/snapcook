import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserSyncWrapper } from "@/components/user-sync-wrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  return (
    <UserSyncWrapper>
      {children}
    </UserSyncWrapper>
  );
}