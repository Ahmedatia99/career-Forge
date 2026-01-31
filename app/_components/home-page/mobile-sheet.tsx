"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function MobileSheet() {
  const [open, setOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "U"
    : "U";

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#1A7DDD"
            >
              <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z" />
            </svg>
            CareerForge
          </SheetTitle>
        </SheetHeader>

        {/* User info if logged in */}
        {!loading && user && (
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt={user?.firstName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-1 px-4">
          <Link
            href="/features"
            className="text-base font-medium hover:text-primary transition py-2"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-base font-medium hover:text-primary transition py-2"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-base font-medium hover:text-primary transition py-2"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
        </nav>

        <Separator className="my-4" />

        {loading ? (
          <div className="px-4">
            <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
          </div>
        ) : user ? (
          <div className="flex flex-col gap-1 px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-base font-medium hover:text-primary transition py-2"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/profile-setup"
              className="flex items-center gap-2 text-base font-medium hover:text-primary transition py-2"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 text-base font-medium hover:text-primary transition py-2"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Separator className="my-2" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-base font-medium text-destructive hover:text-destructive/90 transition py-2 w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-4">
            <Button
              asChild
              variant="outline"
              className="w-full border-primary text-primary rounded-full bg-transparent"
            >
              <Link href="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            </Button>

            <Button asChild className="w-full rounded-full">
              <Link href="/signup" onClick={() => setOpen(false)}>
                Create CV
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
