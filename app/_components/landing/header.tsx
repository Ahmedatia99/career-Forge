import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
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
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button size="sm">Create CV</Button>
        </div>
      </div>
    </header>
  );
}
