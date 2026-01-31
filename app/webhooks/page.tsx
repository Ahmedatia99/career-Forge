"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DashboardHeader } from "../_components/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Webhook,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Activity,
  Globe,
  Zap,
} from "lucide-react";
import {
  createWebhook,
  listWebhooks,
  getWebhookStats,
  WebhookEvent,
} from "@/services/webhook.service";
import type { Webhook as WebhookType } from "@/services/webhook.service";
import { toast } from "sonner";

const availableEvents: {
  value: WebhookEvent;
  label: string;
  description: string;
}[] = [
  {
    value: "cv.parsed",
    label: "CV Parsed",
    description: "When a CV is successfully parsed",
  },
  {
    value: "cv.optimized",
    label: "CV Optimized",
    description: "When a CV is optimized",
  },
  {
    value: "pdf.generated",
    label: "PDF Generated",
    description: "When a PDF is generated",
  },
  {
    value: "ats.analysis.completed",
    label: "ATS Completed",
    description: "When ATS analysis is done",
  },
  {
    value: "job.completed",
    label: "Job Completed",
    description: "When any job completes",
  },
  { value: "job.failed", label: "Job Failed", description: "When a job fails" },
];

export default function WebhooksPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [stats, setStats] = useState<{
    totalWebhooks: number;
    activeWebhooks: number;
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    successRate: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, loading, router]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [webhooksRes, statsRes] = await Promise.all([
        listWebhooks(),
        getWebhookStats(),
      ]);

      if (webhooksRes.data.success) {
        setWebhooks(webhooksRes.data.data);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      toast.error("Failed to load webhooks");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWebhook = async () => {
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL");
      return;
    }

    if (selectedEvents.length === 0) {
      toast.error("Please select at least one event");
      return;
    }

    try {
      setIsCreating(true);
      const response = await createWebhook({
        url: webhookUrl,
        events: selectedEvents,
      });

      if (response.data.success) {
        toast.success("Webhook created!");
        setDialogOpen(false);
        setWebhookUrl("");
        setSelectedEvents([]);
        loadData();
      }
    } catch (err) {
      toast.error("Failed to create webhook");
    } finally {
      setIsCreating(false);
    }
  };

  const toggleEvent = (event: WebhookEvent) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  };

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Webhooks</h1>
            <p className="text-muted-foreground">
              Receive real-time notifications for events
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Webhook</DialogTitle>
                <DialogDescription>
                  Configure a webhook endpoint to receive event notifications
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Endpoint URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-server.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Events to Subscribe</Label>
                  <div className="space-y-2">
                    {availableEvents.map((event) => (
                      <div
                        key={event.value}
                        className="flex items-start space-x-3 rounded-lg border p-3"
                      >
                        <Checkbox
                          id={event.value}
                          checked={selectedEvents.includes(event.value)}
                          onCheckedChange={() => toggleEvent(event.value)}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={event.value}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {event.label}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWebhook} disabled={isCreating}>
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  Create Webhook
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Webhooks</CardDescription>
                <CardTitle className="text-2xl">
                  {stats.totalWebhooks}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {stats.activeWebhooks}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Deliveries</CardDescription>
                <CardTitle className="text-2xl">
                  {stats.totalDeliveries}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Success Rate</CardDescription>
                <CardTitle className="text-2xl">
                  {stats.successRate.toFixed(1)}%
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Webhooks List */}
        {webhooks.length === 0 ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No webhooks yet</h2>
              <p className="text-muted-foreground mb-4">
                Create a webhook to receive real-time notifications
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Webhook
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm">{webhook.url}</p>
                          {webhook.active ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {webhook.events.map((event) => (
                            <Badge
                              key={event}
                              variant="outline"
                              className="text-xs"
                            >
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-muted-foreground">
                    Created: {new Date(webhook.createdAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
