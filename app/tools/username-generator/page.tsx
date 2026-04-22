import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import UsernameGenerator from "@/components/tools/UsernameGenerator";

export const metadata: Metadata = {
  title: "Username Generator — Creative Usernames from Your Name",
  description: "Generate creative usernames based on your name. Perfect for social media, gaming, and online accounts. Free tool.",
  alternates: { canonical: "https://howmanyofme.co/tools/username-generator" },
};

export default function Page() {
  return (<div className="min-h-screen bg-background"><SiteHeader /><UsernameGenerator /><SiteFooter /></div>);
}
