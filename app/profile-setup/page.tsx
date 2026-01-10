"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProfileSetting } from "@/types/user-types";
import { getCurrentUser } from "@/services/user.service";
import { setUserProfile } from "@/lib/auth-storage";

const initialProfileState: ProfileSetting = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  profilePicture: "",
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileSetting>(initialProfileState);

  /**
   * Extract user data from API response
   * Handles different response structures
   */
  const extractUserData = useCallback((responseData: any): ProfileSetting => {
    const data = responseData?.data || responseData;

    return {
      firstName: data?.firstName ?? "",
      lastName: data?.lastName ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      country: data?.country ?? "",
      profilePicture: data?.profilePicture ?? "",
    };
  }, []);

  /**
   * Fetch current user profile from API
   */
  const fetchUserProfile = useCallback(async () => {
    setIsInitialLoading(true);
    try {
      const res = await getCurrentUser();
      console.log("User data from API:", res.data);

      const profileData = extractUserData(res.data);
      console.log("Extracted profile data:", profileData);

      setProfile(profileData);
      setUserProfile(profileData);
    } catch (err) {
      console.error("Failed to get current user", err);
    } finally {
      setIsInitialLoading(false);
    }
  }, [extractUserData]);

  /**
   * Handle form field change
   */
  const handleFieldChange = useCallback(
    (field: keyof ProfileSetting, value: string) => {
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  /**
   * Handle form submission
   */
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        setUserProfile(profile);
        console.log("Profile saved to storage:", profile);
        router.push("/dashboard");
      } catch (err) {
        console.error("Failed to save profile", err);
      } finally {
        setIsLoading(false);
      }
    },
    [profile, router]
  );

  /**
   * Handle skip button click
   */
  const handleSkip = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  // Fetch user profile on component mount
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchUserProfile();
  }, [user, router, fetchUserProfile]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-muted/30 p-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-base">
              Add your personal information to get started with your CV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={profile.firstName ?? ""}
                    onChange={(e) =>
                      handleFieldChange("firstName", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={profile.lastName ?? ""}
                    onChange={(e) =>
                      handleFieldChange("lastName", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email ?? ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={profile.phone ?? ""}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="United States"
                  value={profile.country ?? ""}
                  onChange={(e) => handleFieldChange("country", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePicture">
                  Profile Picture URL (Optional)
                </Label>
                <Input
                  id="profilePicture"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={profile.profilePicture ?? ""}
                  onChange={(e) =>
                    handleFieldChange("profilePicture", e.target.value)
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  Skip for now
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Continue to Dashboard"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
