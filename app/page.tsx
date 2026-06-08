import type { Metadata } from "next";
import ShadowStudio from "@/components/shadow-studio/ShadowStudio";

export const metadata: Metadata = {
  title: "Shadow Studio",
  description: "Physics-based interactive CSS shadow designer",
};

export default function ShadowStudioPage() {
  return <ShadowStudio />;
}
