import FormatHero from "./FormatHero";
import FormatExplainer from "./FormatExplainer";
import HowItWorks from "./HowItWorks";
import FormatComparisonTable from "./FormatComparisonTable";
import AvailableExams from "./AvailableExams";
import FormatFaq from "./FormatFaq";
import { FORMATS, type FormatId } from "./formatData";

const SITE_URL = "https://examsnepal.com";

export default function FormatPageTemplate({ formatId }: { formatId: FormatId }) {
    const format = FORMATS[formatId];

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                    { "@type": "ListItem", position: 2, name: format.name, item: `${SITE_URL}${format.route}` },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: format.faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
            },
        ],
    };

    return (
        <div className="min-h-screen bg-white">
            {/* eslint-disable-next-line react/no-danger */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <FormatHero format={format} />
            <FormatExplainer format={format} />
            <HowItWorks format={format} />
            <FormatComparisonTable current={format.id} />
            <AvailableExams />
            <FormatFaq format={format} />
        </div>
    );
}
