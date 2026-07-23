"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Activity, ExternalLink, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLatestProject } from "@/features/project/hooks/project";

export function ContinueWorking() {
  const { data: latestProject, isLoading, isError } = useGetLatestProject();

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="size-4 text-muted-foreground" />
          <div>
            <h3 className="text-base font-semibold">Continue Working</h3>
            <p className="text-xs text-muted-foreground">
              Pick up where you left off
            </p>
          </div>
        </div>

        <Card className="rounded-2xl shadow-floating">
          <CardHeader className="flex flex-row items-center justify-between gap-4 px-6 py-6">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="h-12 w-12 rounded-xl" />

              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <Skeleton className="h-10 w-36 rounded-xl" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isError || !latestProject) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="size-4 text-muted-foreground" />

        <div>
          <h3 className="text-base font-semibold">Continue Working</h3>

          <p className="text-xs text-muted-foreground">
            Pick up where you left off
          </p>
        </div>
      </div>

      <Card className="rounded-2xl border shadow-floating transition-all duration-200 hover:shadow-lg hover:border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between gap-6 px-6 py-6">
          {/* Left */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <FolderOpen className="size-6" />
            </div>

            <div className="min-w-0">
              <h4 className="truncate text-lg font-semibold">
                {latestProject.name}
              </h4>

              <p className="mt-1 text-sm text-muted-foreground">
                Last updated{" "}
                {formatDistanceToNow(new Date(latestProject.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {/* Right */}
          <Button asChild className="shrink-0 gap-2 btn-champagne">
            <Link href={`/projects/${latestProject.id}`}>
              Open Project
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
