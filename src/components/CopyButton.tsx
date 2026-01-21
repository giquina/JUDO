import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  successMessage?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ value, successMessage, size = "icon", variant = "ghost", className, ...props }, ref) => {
    const { copied, copy } = useCopyToClipboard();

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              variant={variant}
              size={size}
              className={cn("transition-colors", className)}
              onClick={(e) => {
                e.stopPropagation();
                copy(value, successMessage);
              }}
              {...props}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : "Copy"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

CopyButton.displayName = "CopyButton";

export { CopyButton };
