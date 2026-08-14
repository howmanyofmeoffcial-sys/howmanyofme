import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Facebook, Instagram, MessageCircle, Check } from "lucide-react";
import type { NameEstimateResult } from "../../lib/estimation/types";
import { NameIdCard } from "./NameIdCard";
import { trackEvent } from "../../lib/analytics/events";

interface ShareIdCardButtonProps {
  result: NameEstimateResult;
}

export const ShareIdCardButton: React.FC<ShareIdCardButtonProps> = ({ result }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const downloadCard = async () => {
    if (!cardRef.current || isExporting) return;
    try {
      setIsExporting(true);
      trackEvent("id_card_download_clicked", { source_page_type: "homepage" });
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${result.displayName.replace(/\s+/g, "-").toLowerCase()}-name-id-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate image card:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const shareTo = (platform: "facebook" | "instagram" | "sms") => {
    trackEvent("social_share_clicked", { platform, source_page_type: "homepage" });
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check how many people share the name ${result.displayName} on HowManyOfMe!`
    );

    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,noreferrer");
    } else if (platform === "sms") {
      window.location.href = `sms:?body=${text}%20${url}`;
    } else {
      // Instagram: Copy URL + Download card for story/post sharing
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      downloadCard();
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          Share Your Identity Card
        </span>
        <h4 className="font-display text-lg font-bold text-foreground mt-0.5">
          Download or Share Your Name Breakdown
        </h4>
      </div>

      {/* Rendered ID Card (visual + export target) */}
      <div className="py-2">
        <NameIdCard ref={cardRef} result={result} />
      </div>

      {/* Share / Download Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          type="button"
          onClick={downloadCard}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Generating Card..." : "Download Name ID Card"}
        </button>

        <button
          type="button"
          onClick={() => shareTo("facebook")}
          aria-label="Share on Facebook"
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#1877F2] text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          <Facebook className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => shareTo("instagram")}
          aria-label="Share on Instagram or Copy Link"
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          {copied ? <Check className="h-4 w-4" /> : <Instagram className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={() => shareTo("sms")}
          aria-label="Share via SMS"
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-600 text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          <MessageCircle className="h-4 w-4" />
        </button>
      </div>

      {copied && (
        <p className="text-center text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
          ✓ Link copied to clipboard &amp; image downloaded for Instagram sharing!
        </p>
      )}
    </div>
  );
};
