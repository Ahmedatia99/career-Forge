import { Twitter, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">CareerForge ATS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering job seekers with AI technology to build better careers.
            </p>
            <div className="flex gap-3">
              <Link href="#">
                <Image
                  src="icons8-x.svg"
                  alt="Twitter"
                  width={20}
                  height={20}
                />
              </Link>
              <Link href="#">
                <Image
                  src="icons8-linkedin.svg"
                  alt="Twitter"
                  width={20}
                  height={20}
                />
              </Link>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/#features" className="hover:text-primary transition">
                  Features
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-primary transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Career Advice
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  ATS Checker
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/about" className="hover:text-primary transition">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 CareerForge ATS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
