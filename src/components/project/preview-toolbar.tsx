"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type DeviceMode = "desktop" | "tablet" | "mobile";

interface PreviewToolbarProps {
  url?: string;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onRefresh?: () => void;
}

export function PreviewToolbar({
  url = "localhost:3000/",
  deviceMode,
  onDeviceModeChange,
  onRefresh,
}: PreviewToolbarProps) {
  return (
    <div className="h-11 border-b border-border/80 bg-background/95 px-3 flex items-center justify-between shrink-0 select-none gap-2">
      {/* Browser Controls: Back, Forward, Refresh */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-lg"
          title="Back"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-lg"
          title="Forward"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRefresh}
          className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-lg"
          title="Refresh preview"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Address Bar */}
      <div className="flex-1 max-w-xl mx-2">
        <div className="relative flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 absolute left-2.5" />
          <Input
            value={url}
            readOnly
            className="h-7 text-xs pl-8 pr-3 bg-muted/50 border-border/60 font-mono text-muted-foreground focus-visible:ring-0 text-center sm:text-left"
          />
        </div>
      </div>

      {/* Device frame switchers & Open in new tab */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
          <button
            onClick={() => onDeviceModeChange("desktop")}
            className={cn(
              "p-1 rounded-md transition-all",
              deviceMode === "desktop"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeviceModeChange("tablet")}
            className={cn(
              "p-1 rounded-md transition-all",
              deviceMode === "tablet"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeviceModeChange("mobile")}
            className={cn(
              "p-1 rounded-md transition-all",
              deviceMode === "mobile"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => window.open(`http://${url}`, "_blank")}
          className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-lg hidden sm:flex"
          title="Open in new window"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
