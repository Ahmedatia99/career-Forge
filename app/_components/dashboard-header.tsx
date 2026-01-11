"use client";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
  const { user, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) return null;

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="relative z-10 border-b bg-card shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={"/"} className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <span className="text-xl font-semibold">Career Forge</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/features"
            className="text-sm font-medium hover:text-primary transition"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium hover:text-primary transition"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-primary transition"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden md:block">
          {!user ? (
            <Link
              className="px-5 py-2 bg-primary text-white rounded-xl"
              href="/login"
            >
              Login
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt={user?.firstName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <Link href="/profile-setup"> Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card">
          <nav className="container mx-auto flex flex-col px-4 py-4 space-y-4">
            <Link
              href="/features"
              className="text-sm font-medium hover:text-primary transition py-2"
              onClick={closeMobileMenu}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-primary transition py-2"
              onClick={closeMobileMenu}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary transition py-2"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-primary transition py-2"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>

            <div className="border-t pt-4">
              {!user ? (
                <Link
                  className="block w-full px-5 py-2 bg-primary text-white rounded-xl text-center"
                  href="/login"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              ) : (
                <>
                  <div className="flex items-center gap-3 py-2 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={user?.firstName}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile-setup"
                    className="flex items-center gap-2 text-sm font-medium py-2 hover:text-primary transition"
                    onClick={closeMobileMenu}
                  >
                    <User className="h-4 w-4" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-2 text-sm font-medium py-2 text-destructive hover:text-destructive/90 transition w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
