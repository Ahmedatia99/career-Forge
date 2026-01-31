"use client";

import type { CV } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MoreVertical,
  Trash2,
  Eye,
  Copy,
  History,
  BarChart3,
  FileDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { duplicateCV } from "@/services/cv.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CVCardProps {
  cv: CV;
  onDelete: (id: string) => void;
}

export function CVCard({ cv, onDelete }: CVCardProps) {
  const router = useRouter();

  const formattedDate = new Date(cv.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDuplicate = async () => {
    try {
      const response = await duplicateCV(cv.id, {
        title: `${cv.title} (Copy)`,
      });
      if (response.data.success) {
        toast.success("CV duplicated!");
        // Refresh the page to show new CV
        router.refresh();
        window.location.reload();
      }
    } catch (err) {
      toast.error("Failed to duplicate CV");
    }
  };

  return (
    <Card className="group relative transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{cv.title}</CardTitle>
              <CardDescription>Last updated {formattedDate}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/cv-builder/${cv.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Open
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/cv-builder/${cv.id}/versions`}>
                  <History className="mr-2 h-4 w-4" />
                  Versions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(cv.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Template: {cv.template}</p>
        </div>
        <Link href={`/cv-builder/${cv.id}`}>
          <Button className="mt-4 w-full">Edit CV</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
