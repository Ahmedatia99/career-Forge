"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { UserProfile } from "@/lib/types";
interface PersonalInfoSectionProps {
  data?: UserProfile;
  onChange: (data: UserProfile) => void;
}

export function PersonalInfoSection({
  data,
  onChange,
}: PersonalInfoSectionProps) {
  // Ensure data always exists
  const safeData: UserProfile = data || {
    profileSetting: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
    },
    headline: "",
    links: [],
  };

  const handleProfileSettingChange = (field: string, value: string) => {
    const currentProfileSetting = safeData.profileSetting || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
    };
    onChange({
      ...safeData,
      profileSetting: {
        ...currentProfileSetting,
        [field]: value,
      },
    });
  };

  const handleHeadlineChange = (value: string) => {
    onChange({
      ...safeData,
      headline: value,
    });
  };

  const updateLink = (id: string, field: "label" | "url", value: string) => {
    const newLinks = (safeData.links ?? []).map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );

    onChange({ ...safeData, links: newLinks });
  };
  const removeLink = (id: string) => {
    const newLinks = [...(safeData.links ?? [])];
    const index = newLinks.findIndex((link) => link.id === id);
    if (index !== -1) {
      newLinks.splice(index, 1);
      onChange({ ...safeData, links: newLinks });
    }
  };

  const addLink = () => {
    onChange({
      ...safeData,
      links: [
        ...(safeData.links ?? []),
        { label: "", url: "", id: crypto.randomUUID() },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={safeData.profileSetting?.firstName ?? ""}
            onChange={(e) => handleProfileSettingChange("firstName", e.target.value)}
            placeholder="Ahmed"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={safeData.profileSetting?.lastName ?? ""}
            onChange={(e) => handleProfileSettingChange("lastName", e.target.value)}
            placeholder="Atia"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            value={safeData.headline ?? ""}
            onChange={(e) => handleHeadlineChange(e.target.value)}
            placeholder="Software Engineer"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={safeData.profileSetting?.email ?? ""}
            onChange={(e) => handleProfileSettingChange("email", e.target.value)}
            placeholder="atia.ahmed@example.com"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={safeData.profileSetting?.phone ?? ""}
            onChange={(e) => handleProfileSettingChange("phone", e.target.value)}
            placeholder="+20123456789"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={safeData.profileSetting?.country ?? ""}
            onChange={(e) => handleProfileSettingChange("country", e.target.value)}
            placeholder="Egypt"
          />
        </div>
      </div>

      {/* Links */}
      <div className="space-y-2">
        <Label>Links</Label>

        {(safeData.links ?? []).map((link) => (
          <div key={link.id} className="grid grid-cols-[1fr_2fr_auto] gap-2">
            <Input
              placeholder="Label (GitHub, LinkedIn)"
              value={link.label}
              onChange={(e) => updateLink(link.id, "label", e.target.value)}
            />
            <Input
              placeholder="https://example.com"
              value={link.url}
              onChange={(e) => updateLink(link.id, "url", e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLink(link.id)}
              className="h-9 w-9 hover:bg-red-500"
            >
              <Trash2 className="h-4 w-4 " />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addLink}
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>
    </div>
  );
}
