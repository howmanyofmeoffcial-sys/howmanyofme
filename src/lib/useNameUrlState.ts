import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Read/write shareable name-tool URL params.
 *  ?name=Rahul&country=US&view=trend&compare=Aarav
 */
export function useNameUrlState() {
  const [params, setParams] = useSearchParams();

  const state = useMemo(
    () => ({
      name: params.get("name") || "",
      compare: params.get("compare") || "",
      country: params.get("country") || "Global",
      view: params.get("view") || "trend",
    }),
    [params],
  );

  const update = useCallback(
    (next: Partial<typeof state>) => {
      const merged = new URLSearchParams(params);
      Object.entries(next).forEach(([k, v]) => {
        if (!v) merged.delete(k);
        else merged.set(k, v);
      });
      setParams(merged, { replace: true });
    },
    [params, setParams],
  );

  const shareUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  return { state, update, shareUrl };
}
