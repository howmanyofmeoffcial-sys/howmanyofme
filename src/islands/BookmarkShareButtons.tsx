import { useState } from "react";
import { Bookmark, Share2 } from "lucide-react";

export default function BookmarkShareButtons({ name }: { name: string }) {
  const [saved, setSaved] = useState(false);

  const saveResult = () => {
    try {
      const key = "hmom:saved";
      const list: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      if (!list.includes(name)) {
        list.unshift(name);
        localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
      }
      setSaved(true);
    } catch {
      /* storage unavailable */
    }
  };

  const shareResult = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${name} — name insights`, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={saveResult}
        aria-pressed={saved}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-card hover:bg-secondary text-sm font-medium transition text-foreground"
      >
        <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
        {saved ? "Saved" : "Save"}
      </button>
      <button
        onClick={shareResult}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
    </div>
  );
}
