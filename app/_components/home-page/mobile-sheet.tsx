import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {Menu} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MobileSheet() {
  const [open, setOpen] = useState(false);

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

        <nav className="flex flex-col gap-4 px-4">
          <Link
            href="#features"
            className="text-base font-medium hover:text-primary transition py-2"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-base font-medium hover:text-primary transition py-2"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="#about"
            className="text-base font-medium hover:text-primary transition py-2"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
        </nav>

        <div className="flex flex-col gap-3 mt-6 px-4">
          <Button
            asChild
            variant="outline"
            className="w-full border-primary text-primary rounded-full bg-transparent"
          >
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          </Button>

          <Button
            className="w-full rounded-full"
            onClick={() => setOpen(false)}
          >
            <Link href="/">Create CV</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
