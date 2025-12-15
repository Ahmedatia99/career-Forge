import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-border bg-card sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            {/* make the fileText icon no background */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#1A7DDD"
            >
              <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z" />
            </svg>
          </div>
          <span className="font-semibold text-lg">CV Builder AI</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium hover:text-primary transition"
          >
            Features
          </a>
          <a
            href="#"
            className="text-sm font-medium hover:text-primary transition"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-sm font-medium hover:text-primary transition"
          >
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          
          <Button className="px-5 py-5 border-primary text-primary rounded-full" variant="outline" size="sm">
            Login
          </Button>
          <Button className="px-5 py-5 rounded-full" size="sm">Create CV</Button>
        </div>
      </div>
    </header>
  );
}
