export type AssetType =
  | "data-report"
  | "research"
  | "tool"
  | "dataset"
  | "visualization"
  | "embed"
  | "resource";

export interface LinkableAsset {
  slug: string;
  title: string;
  description: string;
  assetType: AssetType;
  primaryTopic: string;
  sources: string[];
  publishedAt: string;
  updatedAt?: string;
  downloadUrl?: string;
  embeddable?: boolean;
  citationsCount?: number;
}
