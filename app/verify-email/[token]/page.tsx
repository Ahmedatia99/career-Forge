"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";

import { verifyEmail } from "@/services/auth.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Status = "loading" | "success" | "error";

export default function VerifyEmail({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const runVerify = async () => {
      try {
        await verifyEmail(params.token);
        setStatus("success");
        setMessage("Your email has been verified successfully.");
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            "Verification link is invalid or expired."
        );
      }
    };

    runVerify();
  }, [params.token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-lg p-8 text-center space-y-6 shadow-xl bg-white/90 backdrop-blur">
        {/* Icon */}
        <div className="mx-auto">
          {status === "loading" && (
            <div className="relative w-fit mx-auto">
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <Loader2 className="h-24 w-24 text-purple-600 animate-spin absolute -top-2 -left-2" />
            </div>
          )}

          {status === "success" && (
            <div className="h-20 w-20 mx-auto rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          )}

          {status === "error" && (
            <div className="h-20 w-20 mx-auto rounded-full bg-linear-to-br from-red-400 to-rose-600 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-white" />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Email Verified"}
            {status === "error" && "Verification Failed"}
          </h1>
          <p className="text-muted-foreground">
            {status === "loading" && "Please wait while we verify your email."}
            {status === "success" && "Your account is now active."}
            {status === "error" && "Something went wrong during verification."}
          </p>
        </div>

        {/* Message */}
        {status !== "loading" && (
          <Alert variant={status === "success" ? "default" : "destructive"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-4">
          {status === "success" && (
            <>
              <Button
                className="w-full"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </>
          )}

          {status === "error" && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Back to Login
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
