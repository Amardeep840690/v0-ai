"use client";

import React, { useState } from "react";
import { PreviewToolbar, DeviceMode } from "./preview-toolbar";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewWorkspaceProps {
  sandboxUrl?: string | null;
  className?: string;
}

export function PreviewWorkspace({
  sandboxUrl,
  className,
}: PreviewWorkspaceProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getContainerWidth = () => {
    switch (deviceMode) {
      case "tablet":
        return "max-w-[768px]";
      case "mobile":
        return "max-w-[390px]";
      default:
        return "w-full";
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full flex-1 min-w-0 min-h-0 bg-muted/40 overflow-hidden select-none",
        className
      )}
    >
      {/* Browser Toolbar */}
      <PreviewToolbar
        url={sandboxUrl ?? "http://localhost:3000"}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        onRefresh={handleRefresh}
      />

      {/* Main Preview Container Frame */}
      <div className="flex-1 overflow-hidden p-2 sm:p-4 flex justify-center bg-muted/20">
        <div
          className={cn(
            "h-full bg-background border border-border/80 rounded-2xl shadow-floating overflow-hidden flex flex-col transition-all duration-300 relative w-full",
            getContainerWidth(),
            isRefreshing && "opacity-60 scale-[0.995]"
          )}
        >
          {sandboxUrl ? (
            <iframe
              key={refreshKey}
              src={sandboxUrl}
              className="h-full w-full border-0"
              title="Project Preview"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-foreground">
                  Preview will appear here
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Generating preview... Once the sandbox is ready, your application will render automatically.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
