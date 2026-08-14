import type { FormatDefinition } from "./formatData";

// [PLACEHOLDER COPY — CONFIRM WITH OWNER] explainer text lives in formatData.ts
// (FORMATS[id].explainer) and is a placeholder pending site-owner-approved copy.
export default function FormatExplainer({ format }: { format: FormatDefinition }) {
    return (
        <section className="max-w-3xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-4">
                What is {format.name}?
            </h2>
            <p className="text-muted-foreground leading-relaxed">{format.explainer}</p>
        </section>
    );
}
