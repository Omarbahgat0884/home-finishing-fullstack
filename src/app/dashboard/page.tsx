import DashboardPage from "@/components/dashboard/DashboardPage";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const user = await api.user.getUser({
    id: session?.user?.id || "",
  });

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (!user?.isAdmin) {
    redirect("/");
  }

  return <DashboardPage />;
}
