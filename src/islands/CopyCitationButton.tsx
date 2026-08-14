import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyCitationButtonProps {
  citationText: string;
  url?: string;
  title?: string;
}

export default function CopyCitationButton({
  citationText,
  url,
  title,
}: CopyCitationButtonProps) {
  const [copied, setCopied] = useState(false);

  const fullText = url ? `${citationText} Available at: ${url}` : citationText;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy citation:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition shadow-sm"
      title={`Copy citation for ${title || "this statistic"}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          <span className="text-green-600 dark:text-green-400">Citation Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Copy Citation</span>
        </>
      )}
    </button>
  );
}
