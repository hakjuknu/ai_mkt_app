"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
}

export function CopyButton({ 
  text, 
  className,
  size = "sm",
  variant = "outline",
  showText = false
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      size={size}
      variant={variant}
      className={cn("gap-2", className)}
      aria-label={copied ? "복사됨" : "복사하기"}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          {showText && "복사됨"}
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {showText && "복사"}
        </>
      )}
    </Button>
  );
}
