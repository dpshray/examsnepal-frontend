import { Metadata } from "next";
import InstituteApiDocsClient from "./InstituteApiDocsClient";

export const metadata: Metadata = {
  title: "Institute API & Integration Documentation | ExamsNepal",
  description:
    "Complete developer and integration guide for institutes to embed classes, exams, lecture notes, and student portals into their custom websites.",
  keywords: [
    "institute api",
    "examsnepal api",
    "classes api",
    "student portal integration",
    "institute widget",
    "exams nepal developer documentation",
  ],
  openGraph: {
    title: "Institute API & Website Integration Guide | ExamsNepal",
    description:
      "Integrate your institute's classes, mock exams, and student registration portal directly into your own website.",
    url: "https://www.examsnepal.com/institute-api",
  },
  alternates: {
    canonical: "/institute-api",
  },
};

export default function InstituteApiDocsPage() {
  return <InstituteApiDocsClient />;
}
