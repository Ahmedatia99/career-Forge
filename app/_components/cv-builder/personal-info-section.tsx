"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserProfile } from "@/lib/types"

interface PersonalInfoSectionProps {
  data: UserProfile
  onChange: (data: UserProfile) => void
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const handleChange = (field: keyof UserProfile, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="john.doe@example.com"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={data.country}
            onChange={(e) => handleChange("country", e.target.value)}
            placeholder="United States"
          />
        </div>
      </div>
    </div>
  )
}
