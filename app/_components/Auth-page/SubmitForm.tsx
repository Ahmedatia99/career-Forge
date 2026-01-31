"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export function SubmitForm({
  handleSubmit,
  isLogin,
  loading = false,
}: {
  handleSubmit: () => void;
  isLogin: boolean;
  loading?: boolean;
}) {
  return (
    <>
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-11 sm:h-12 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
            {isLogin ? "Logging in..." : "Registering..."}
          </>
        ) : (
          <>
            {isLogin ? "Login" : "Register"}{" "}
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </>
        )}
      </Button>
      <p className="text-center text-slate-600 text-xs sm:text-sm mt-6 sm:mt-8 ">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          {isLogin ? "Register" : "Login"}
        </Link>
      </p>
    </>
  );
}
