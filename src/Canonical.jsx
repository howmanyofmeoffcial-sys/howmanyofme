import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CANONICAL_HOST = "https://howmanyofme.co";

/**
 * Fallback canonical setter.
 * - Always normalizes to the apex host (https://howmanyofme.co), never www or preview.
 * - Strips tracking params (utm_*, fbclid, gclid, ref).
 * - Removes trailing slashes (except root) for URL consistency.
 * - Defers to page-level SEOHead: if a page already set a canonical, we do NOT overwrite it.
 *   This prevents case-sensitive duplicates (/name/Gracie vs /name/gracie) where the page
 *   knows the correct canonical form.
 */
export default function Canonical() {
  const location = useLocation();

  useEffect(() => {
    // Wait a tick so page-level SEOHead can run first.
    const id = window.setTimeout(() => {
      const existing = document.querySelector("link[rel='canonical']");
      // If a page-level SEOHead already set a canonical to our apex domain, leave it alone.
      if (existing && existing.getAttribute("href")?.startsWith(CANONICAL_HOST)) return;

      let pathname = location.pathname || "/";
      if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);

      const url = `${CANONICAL_HOST}${pathname}`;

      let link = existing;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", url);
    }, 0);

    return () => window.clearTimeout(id);
  }, [location]);

  return null;
}
