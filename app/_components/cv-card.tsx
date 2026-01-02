"use client";

import type { CV } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MoreVertical, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface CVCardProps {
  cv: CV;
  onDelete: (id: string) => void;
}

export function CVCard({ cv, onDelete }: CVCardProps) {
  const formattedDate = new Date(cv.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
              <DropdownMenuItem
                onClick={() => onDelete(cv.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4 hover:bg-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Template: {cv.template}</p>
          <p>
            {cv.workExperience?.length ?? 0} work experience •{" "}
            {cv.education?.length ?? 0} education
          </p>
        </div>
        <Link href={`/cv-builder/${cv.id}`}>
          <Button className="mt-4 w-full">Edit CV</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
