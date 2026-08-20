"use client";

import React, { useState } from "react";
import { PreviewToolbar, DeviceMode } from "./preview-toolbar";
import { Sparkles, ShoppingBag, ArrowRight, Loader2, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PreviewWorkspaceProps {
  className?: string;
}

export function PreviewWorkspace({ className }: PreviewWorkspaceProps = {}) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
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
    <div className={cn("flex flex-col h-full flex-1 min-w-0 min-h-0 bg-muted/40 overflow-hidden select-none", className)}>
      {/* Browser Toolbar */}
      <PreviewToolbar
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        onRefresh={handleRefresh}
      />

      {/* Main Preview Container Frame */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex justify-center bg-muted/20">
        <div
          className={cn(
            "h-full min-h-[680px] bg-background border border-border/80 rounded-2xl shadow-floating overflow-y-auto flex flex-col transition-all duration-300 relative",
            getContainerWidth(),
            isRefreshing && "opacity-60 scale-[0.995]"
          )}
        >
          {/* Internal Canvas Header Banner */}
          <div className="px-4 py-2 border-b border-border/60 bg-card flex items-center justify-between text-xs sticky top-0 z-40">
            <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
              <Loader2 className="w-3 h-3 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>Generating preview...</span>
            </div>
            <Badge
              variant="outline"
              className="bg-[#f8e7c9]/40 text-[#106e3b] dark:bg-emerald-950/60 dark:text-emerald-300 border-[#f8e7c9] dark:border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium"
            >
              Preview mode
            </Badge>
          </div>

          {/* Rendered Mock DTC Storefront */}
          <div className="flex-1 flex flex-col">
            {/* Storefront Header */}
            <header className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                  V0
                </div>
                <span className="font-semibold text-sm tracking-tight text-foreground">
                  V0-AI Store
                </span>
              </div>

              <nav className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground font-medium">
                <a href="#" className="text-foreground font-semibold">
                  Shop
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Collections
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  About
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Support
                </a>
              </nav>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="xs" className="gap-1.5 rounded-lg">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cart (0)</span>
                </Button>
              </div>
            </header>

            {/* Storefront Hero Section */}
            <section className="px-6 py-10 sm:py-14 space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8e7c9] dark:bg-amber-950/60 text-[#106e3b] dark:text-amber-300 text-xs font-semibold tracking-wide border border-amber-200/50">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New season essentials</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
                Premium essentials for modern living.
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                A clean, conversion-focused storefront with refined spacing, elegant product presentation, and a subtle emerald-and-champagne brand system.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5 py-2.5 rounded-xl gap-2 shadow-sm text-sm">
                  <span>Shop collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="px-5 py-2.5 rounded-xl text-sm font-medium">
                  View lookbook
                </Button>
              </div>
            </section>

            {/* Product Cards Grid Showcase */}
            <section className="px-6 py-8 border-t border-border/40 bg-muted/20 flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Featured products</h3>
                  <p className="text-xs text-muted-foreground">
                    A few polished cards to make the preview feel real.
                  </p>
                </div>
                <a href="#" className="text-xs font-medium text-primary hover:underline">
                  View all
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {[
                  {
                    title: "Minimalist Ergonomic Chair",
                    price: "$240",
                    rating: "4.9",
                    bg: "bg-emerald-500/10",
                  },
                  {
                    title: "Matte Aluminum Desk Lamp",
                    price: "$95",
                    rating: "4.8",
                    bg: "bg-amber-500/10",
                  },
                  {
                    title: "Recycled Wool Throw Blanket",
                    price: "$110",
                    rating: "5.0",
                    bg: "bg-sky-500/10",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border/70 rounded-xl p-3 shadow-2xs hover:shadow-xs transition-all space-y-3 group"
                  >
                    <div
                      className={cn(
                        "h-36 rounded-lg flex items-center justify-center relative overflow-hidden",
                        item.bg
                      )}
                    >
                      <Sparkles className="w-8 h-8 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-foreground truncate">{item.title}</span>
                        <span className="text-foreground font-semibold">{item.price}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
