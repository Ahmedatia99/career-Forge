"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-context";
import { Card } from "@/components/ui/card";
import { BrandingSection } from "../_components/Auth-page/BrandingSection";
import { FormInput } from "../_components/Auth-page/FormInput";
import { SubmitForm } from "../_components/Auth-page/SubmitForm";
import { validatePassword } from "@/lib/password-validation";

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
    ) : (
      <XCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
    )}
    <span className={met ? "text-green-700" : "text-slate-600"}>{text}</span>
  </div>
);

export default function SignUpPage() {
  const router = useRouter();
  const { registerUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Validate password in real-time
  const passwordValidation = useMemo(() => {
    if (!password) return null;
    return validatePassword(password);
  }, [password]);

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    // Validate password before submission
    if (!password) {
      toast.error("Password is required", {
        description: "Please enter a password",
      });
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      toast.error("Password does not meet requirements", {
        description: validation.errors.join(", "),
        duration: 5000,
      });
      setError(validation.errors.join(", "));
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUser({
        email,
        password,
        firstName: firstName || "",
        lastName: lastName || "",
      });

      if (result.success && result.data) {
        toast.success("Registration successful!", {
          description: result.message || "Welcome! Redirecting to dashboard...",
        });
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        const errorMessage =
          typeof result.error === "object"
            ? result.error?.message
            : result.error ||
              result.message ||
              "Registration failed. Please try again.";
        toast.error("Registration failed", {
          description: errorMessage,
        });
        setError(errorMessage || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      const errorMsg =
        error?.message || "Failed to create account. Please try again.";
      toast.error("Registration error", {
        description: errorMsg,
      });
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col lg:flex-row items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute left-0 top-0 h-full w-40 bg-linear-to-r from-blue-200/40 to-transparent pointer-events-none" />
      <div className="absolute right-12 top-20 w-80 h-80 bg-linear-to-br from-blue-300/30 to-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Branding */}
        <BrandingSection />

        {/* Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-blue-400/40 to-blue-500/50 rotate-4 shadow-2xl rounded-2xl" />

            <Card className="relative bg-white/95 backdrop-blur-xl shadow-2xl border border-blue-200/50 rounded-2xl p-8">
              {/* Tabs */}
              <div className="flex gap-8 mb-8 border-b border-slate-200">
                <Link
                  href="/login"
                  className="pb-3 text-lg font-semibold text-muted-foreground hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="pb-3 text-lg font-semibold border-b-2 border-blue-600"
                >
                  Register
                </Link>
              </div>

              <div className="space-y-5">
                <FormInput
                  icon={User}
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={setFirstName}
                  disabled={isLoading}
                />

                <FormInput
                  icon={User}
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={setLastName}
                  disabled={isLoading}
                />

                <FormInput
                  icon={Mail}
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={setEmail}
                  disabled={isLoading}
                />

                <div className="space-y-2">
                  <FormInput
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={setPassword}
                    disabled={isLoading}
                  />

                  {/* Password Requirements */}
                  {password && passwordValidation && (
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3 space-y-1.5">
                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        Password Requirements:
                      </p>
                      <div className="space-y-1">
                        <PasswordRequirement
                          met={password.length >= 8}
                          text="At least 8 characters"
                        />
                        <PasswordRequirement
                          met={/[A-Z]/.test(password)}
                          text="One uppercase letter (A-Z)"
                        />
                        <PasswordRequirement
                          met={/[a-z]/.test(password)}
                          text="One lowercase letter (a-z)"
                        />
                        <PasswordRequirement
                          met={/[0-9]/.test(password)}
                          text="One number (0-9)"
                        />
                        <PasswordRequirement
                          met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                            password
                          )}
                          text="One special character (!@#$%...)"
                        />
                      </div>
                      {passwordValidation.isValid && (
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Password strength: {passwordValidation.strength}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
                {successMessage && (
                  <p className="text-sm text-green-600">{successMessage}</p>
                )}

                <SubmitForm
                  handleSubmit={handleSubmit}
                  isLogin={false}
                  loading={isLoading}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
