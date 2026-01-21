import { useState } from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage || "Copied to clipboard");

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      return true;
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
      return false;
    }
  };

  return { copied, copy };
}
