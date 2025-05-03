import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hammer } from "lucide-react";
import { ThemeSwitcher } from "./theme/theme-switcher";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function Navbar() {
  const session = await auth();
  const user = await api.user.getUser({
    id: session?.user?.id ?? "",
  });

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Hammer className="h-6 w-6" />
          <span>Home Finishing</span>
        </Link>
        <nav className="flex gap-4">
          <Link href="/services">
            <Button variant="ghost">Services</Button>
          </Link>
          <Link href="/contractors">
            <Button variant="ghost">Contractors</Button>
          </Link>
          <Link href="/bookings">
            <Button variant="ghost">Bookings</Button>
          </Link>
          {user?.isAdmin && (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          )}
          <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
            <Button>{session ? "Sign out" : "Sign in"}</Button>
          </Link>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
