# Image Optimization Strategy & Policy

This document strictly enforces the image optimization strategy for HowManyOfMe to ensure peak Core Web Vitals (LCP, CLS, FCP) and a flawless user experience.

## Core Directives

### 1. When to use `next/image`
You **MUST** use `next/image` (`import Image from 'next/image'`) for:
*   **Above-the-fold images**: Any image visible before scrolling.
*   **Large content images**: Photography, large charts, tool screenshots, or blog post feature images.
*   **Layout-impacting images**: Any graphic that takes up significant screen real-estate and could cause layout shifting (CLS) if loaded slowly.

### 2. When NOT to use `next/image`
You **MUST NOT** use `next/image` for:
*   **Small Icons**: Use SVG components (like `lucide-react`) or inline SVGs.
*   **Tiny UI Elements**: Small decorative borders, tiny flags, or repetitive list bullet images.
*   **Purely Decorative Images**: If it's purely decorative, consider CSS background images or inline SVGs to avoid JavaScript overhead.

## Hard Technical Requirements

Whenever `next/image` is implemented, the following rules apply without exception:

1.  **Strict Sizing**: `width` and `height` attributes MUST be defined to prevent Cumulative Layout Shift (CLS). If the image must be responsive, use `fill={true}` in combination with a relative parent container (`relative aspect-video`, etc.).
2.  **LCP Prioritization**: The Largest Contentful Paint (LCP) element (typically the hero image on the page) MUST include the `priority={true}` prop to bypass lazy loading and inject a preload tag into the document head.
3.  **Lazy Loading**: All below-the-fold images must remain on the default lazy loading behavior. Do NOT apply `priority={true}` to off-screen images, as this chokes the network bandwidth.
4.  **Format and Sizing restrictions**: Never serve oversized images. Ensure standard formats (like `.webp` or `.png`) are used, allowing Next.js to auto-convert and serve correctly sized WebP/AVIF renditions based on the user's device viewport.

## Audit Validation
*   Before any pull request, developers must ensure zero raw `<img src="...">` tags exist in the repository unless explicitly justified (e.g., inside a highly specific third-party library wrapper).
*   Any violation of the `priority` or `width`/`height` rules will result in a failed performance audit.
