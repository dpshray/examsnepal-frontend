import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FormatDefinition } from "./formatData";

// [PLACEHOLDER COPY — CONFIRM WITH OWNER] FAQ content lives in formatData.ts
// (FORMATS[id].faqs) and is a placeholder pending site-owner-approved copy.
export default function FormatFaq({ format }: { format: FormatDefinition }) {
    return (
        <section className="max-w-3xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-6">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="w-full">
                {format.faqs.map((faq, index) => (
                    <AccordionItem key={faq.question} value={`faq-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}
