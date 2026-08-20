"use client";

import React, { useState } from "react";
import { Copy, Check, Sparkles, X, Code, FileCode2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileNode } from "./file-tree-item";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  activeFile?: FileNode | null;
  onCloseFile?: () => void;
  className?: string;
}

export function CodeEditor({ activeFile, onCloseFile, className }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState(false);
  
  const defaultCode ="";
//   const defaultCode = `import { Menu, Search, Sparkles, ShoppingBag } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export function Navbar() {
//   return (
//     <nav className="border-b border-border bg-background/95 backdrop-blur-xs sticky top-0 z-50">
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
//         <div className="flex items-center gap-3">
//           <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
//             <Sparkles className="size-4" />
//           </div>
//           <span className="text-sm font-semibold tracking-tight text-foreground">
//             V0-AI Store
//           </span>
//         </div>

//         <div className="hidden items-center gap-8 md:flex text-sm text-muted-foreground">
//           <a href="#products" className="hover:text-foreground transition-colors">
//             Products
//           </a>
//           <a href="#pricing" className="hover:text-foreground transition-colors">
//             Pricing
//           </a>
//           <a href="#docs" className="hover:text-foreground transition-colors">
//             Docs
//           </a>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="sm" className="gap-2">
//             <Search className="size-4" />
//             <span className="hidden sm:inline">Search</span>
//           </Button>
//           <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
//             <ShoppingBag className="size-4" />
//             <span>Cart</span>
//           </Button>
//           <Button variant="ghost" size="icon-xs" className="md:hidden">
//             <Menu className="size-4" />
//           </Button>
//         </div>
//       </div>
//     </nav>
//   )
// }`;

  const currentCode = activeFile?.content || defaultCode;
  const lines = currentCode.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    setFormatted(true);
    setTimeout(() => setFormatted(false), 1500);
  };

  return (
    <div className={cn("flex flex-col h-full flex-1 min-w-0 min-h-0 bg-[#0d1117] text-slate-100 select-none overflow-hidden border-l border-border/80", className)}>
      {/* Editor Tab Bar & Toolbar */}
      <div className="h-10 border-b border-slate-800 bg-[#161b22] px-3 flex items-center justify-between shrink-0">
        {/* File Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1117] text-slate-200 border-t-2 border-emerald-500 rounded-t-md text-xs font-medium shrink-0">
            <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{activeFile ? activeFile.name : "Navbar.tsx"}</span>
            {onCloseFile && (
              <button
                onClick={onCloseFile}
                className="text-slate-400 hover:text-slate-200 ml-1 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls: Copy & Format */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleFormat}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            <Wrench className="w-3 h-3" />
            <span>{formatted ? "Formatted" : "Format"}</span>
          </button>
        </div>
      </div>

      {/* Main Code View Container */}
      <div className="flex-1 overflow-auto font-mono text-xs sm:text-[13px] leading-relaxed p-4 flex">
        {/* Line Numbers */}
        <div className="flex flex-col text-slate-600 select-none pr-4 text-right min-w-[2.5rem]">
          {/* {lines.map((_, i) => (
            <span key={i} className="leading-relaxed">
              {i + 1}
            </span>
          ))} */}
        </div>

        {/* Code Content with Synthetic Syntax Highlighting */}
        <pre className="flex-1 text-slate-200 overflow-x-auto whitespace-pre font-mono">
          <code>
            {lines.map((line, idx) => {
              // Basic regex highlight logic for demo editor look
              let highlightedLine = line;

              return (
                <div key={idx} className="leading-relaxed hover:bg-slate-800/40 px-1 rounded">
                  {line.startsWith("import") || line.startsWith("export") || line.startsWith("return") ? (
                    <span className="text-purple-400 font-semibold">{line}</span>
                  ) : line.includes("<nav") || line.includes("</nav>") || line.includes("<div") || line.includes("</div>") || line.includes("<button") || line.includes("</button>") ? (
                    <span className="text-sky-300">{line}</span>
                  ) : line.includes("className=") ? (
                    <span>
                      {line.split("className=")[0]}
                      <span className="text-emerald-400">className=</span>
                      <span className="text-amber-300">{line.split("className=")[1]}</span>
                    </span>
                  ) : (
                    line
                  )}
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
