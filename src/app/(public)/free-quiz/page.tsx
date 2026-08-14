import type { Metadata } from "next";
import FormatPageTemplate from "@/components/format-pages/FormatPageTemplate";
import { FORMATS } from "@/components/format-pages/formatData";

const format = FORMATS["free-quiz"];

export const metadata: Metadata = {
    title: format.metaTitle,
    description: format.metaDescription,
    alternates: { canonical: format.route },
};

export default function FreeQuizPage() {
    return <FormatPageTemplate formatId="free-quiz" />;
}
