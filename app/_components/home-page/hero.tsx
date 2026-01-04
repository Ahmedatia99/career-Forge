"use client";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative py-16 md:py-24 px-4 bg-card">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h1 className="md:text-5xl sm:text-4xl text-3xl font-bold text-balance">
            “Create Your CV in Minutes with AI”
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Upload your old CV, generate new sections, and export instantly. Let
            AI handle the heavy lifting.
          </p>
          <div className="flex gap-4 items-center">
            {!user ? (
              <Button>
                <Link href="/signup"> Signup</Link>
              </Button>
            ) : (
              <Button>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
            <Button className="bg-gray-400 cursor-not-allowed hover:bg-gray-400">
              Upload CV
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* add shadow to the image */}
          <Image
            width={500}
            height={500}
            src="cvTemplate.png"
            className="shadow-2xl rounded-lg border-2 border-border"
            alt="Hero"
          />
        </div>
      </div>
    </section>
  );
}
