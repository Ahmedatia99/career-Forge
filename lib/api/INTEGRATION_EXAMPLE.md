# API Integration Example

This document shows how to integrate the API client into your existing codebase.

## 1. Update Auth Context

Replace the mock authentication in `lib/auth-context.tsx`:

```typescript
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authApi, ApiError } from "@/lib/api/client";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          // Verify token is still valid
          await authApi.getCurrentUser();
        }
      } catch (error) {
        // Token expired or invalid, clear storage
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await authApi.register({
        email,
        password,
        confirmedPassword: password, // You might want to add this to your form
      });
      
      setUser(response.user);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error("Registration failed. Please try again.");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

## 2. Update Dashboard Page

Replace localStorage calls in `app/dashboard/page.tsx`:

```typescript
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "../_components/dashboard-header"
import { CVCard } from "../_components/cv-card"
import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
import { cvApi, ApiError } from "@/lib/api/client"
import type { CV } from "@/types/types"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [cvs, setCvs] = useState<CV[]>([])
  const [isLoadingCvs, setIsLoadingCvs] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      loadCVs()
    }
  }, [user, isLoading, router])

  const loadCVs = async () => {
    try {
      setIsLoadingCvs(true)
      setError(null)
      const response = await cvApi.getAll()
      setCvs(response.cvs)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to load CVs. Please try again.")
      }
    } finally {
      setIsLoadingCvs(false)
    }
  }

  const handleCreateCV = () => {
    const newCvId = Math.random().toString(36).substr(2, 9)
    router.push(`/cv-builder/${newCvId}`)
  }

  const handleDeleteCV = async (id: string) => {
    try {
      await cvApi.delete(id)
      setCvs(cvs.filter((cv) => cv.id !== id))
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to delete CV: ${err.message}`)
      } else {
        alert("Failed to delete CV. Please try again.")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Welcome back, {user?.firstName}</h1>
            <p className="text-muted-foreground">Create and manage your professional CVs</p>
          </div>
          <Button onClick={handleCreateCV} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create CV
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {isLoadingCvs ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : cvs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">No CVs yet</h2>
            <p className="mb-6 text-center text-muted-foreground">Get started by creating your first professional CV</p>
            <Button onClick={handleCreateCV} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Your First CV
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv) => (
              <CVCard key={cv.id} cv={cv} onDelete={handleDeleteCV} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
```

## 3. Update CV Builder Page

Replace localStorage calls in `app/cv-builder/[id]/page.tsx`:

```typescript
// ... existing imports ...
import { cvApi, ApiError } from "@/lib/api/client"

export default function CVBuilderPage() {
  // ... existing code ...

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      loadCV()
    }
  }, [user, isLoading, router, cvId])

  const loadCV = async () => {
    try {
      // Try to load existing CV
      const existingCv = await cvApi.getById(cvId)
      setCvData(existingCv)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        // CV doesn't exist, initialize with user profile data
        const storedProfile = localStorage.getItem("user_profile")
        if (storedProfile) {
          const profile: UserProfile = JSON.parse(storedProfile)
          setCvData((prev) => ({
            ...prev,
            personalInfo: profile,
          }))
        } else if (user) {
          setCvData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
          }))
        }
      } else {
        console.error("Failed to load CV:", err)
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const updatedCv = {
        ...cvData,
        updatedAt: new Date().toISOString(),
      }

      // Check if CV exists
      try {
        await cvApi.getById(cvId)
        // CV exists, update it
        const saved = await cvApi.update(cvId, updatedCv)
        setCvData(saved)
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          // CV doesn't exist, create it
          const saved = await cvApi.create({
            ...updatedCv,
            id: cvId,
          })
          setCvData(saved)
        } else {
          throw err
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to save CV: ${err.message}`)
      } else {
        alert("Failed to save CV. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  // ... rest of the component ...
}
```

## 4. Update Profile Setup Page

Replace localStorage calls in `app/profile-setup/page.tsx`:

```typescript
// ... existing imports ...
import { userApi, ApiError } from "@/lib/api/client"

export default function ProfileSetupPage() {
  // ... existing code ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await userApi.updateProfile(profile)
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to save profile: ${err.message}`)
      } else {
        alert("Failed to save profile. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ... rest of the component ...
}
```

## 5. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

For production, update to your production API URL.

## 6. Error Handling Component

Create a reusable error handler:

```typescript
// lib/utils/error-handler.ts
import { ApiError } from "@/lib/api/client"
import { toast } from "sonner" // or your toast library

export function handleApiError(error: unknown, defaultMessage = "An error occurred") {
  if (error instanceof ApiError) {
    // Handle specific error codes
    switch (error.code) {
      case "UNAUTHORIZED":
      case "SESSION_EXPIRED":
        // Redirect to login
        window.location.href = "/login"
        break
      case "VALIDATION_ERROR":
        // Show validation errors
        if (error.details) {
          error.details.forEach((detail) => {
            toast.error(detail.message)
          })
        } else {
          toast.error(error.message)
        }
        break
      default:
        toast.error(error.message || defaultMessage)
    }
  } else if (error instanceof Error) {
    toast.error(error.message || defaultMessage)
  } else {
    toast.error(defaultMessage)
  }
}
```

## 7. Loading States

Add loading indicators for better UX:

```typescript
// components/ui/loading-spinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
```

## Migration Checklist

- [ ] Install API client dependencies (none needed, uses fetch)
- [ ] Create `.env.local` with API URL
- [ ] Update `lib/auth-context.tsx` to use `authApi`
- [ ] Update `app/dashboard/page.tsx` to use `cvApi.getAll()` and `cvApi.delete()`
- [ ] Update `app/cv-builder/[id]/page.tsx` to use `cvApi.getById()`, `cvApi.create()`, and `cvApi.update()`
- [ ] Update `app/profile-setup/page.tsx` to use `userApi.updateProfile()`
- [ ] Add error handling with `handleApiError()`
- [ ] Add loading states
- [ ] Test all API integrations
- [ ] Remove localStorage mock code
- [ ] Update error messages to be user-friendly

## Testing

1. Test authentication flow (login, signup, logout)
2. Test CV CRUD operations
3. Test profile update
4. Test error handling (network errors, validation errors)
5. Test token refresh on 401 errors
6. Test loading states

