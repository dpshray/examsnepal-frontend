import Script from "next/script";

// GA4 web stream for examsnepal.com. Measurement IDs are public; override per
// environment with NEXT_PUBLIC_GA_MEASUREMENT_ID (set it to "" to disable).
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-DM6VQDPEGS";

/**
 * Google Analytics 4 tag, production builds only so local development doesn't
 * pollute the data. Client-side route changes are tracked by GA4's enhanced
 * measurement ("page changes based on browser history events").
 */
export default function GoogleAnalytics() {
    if (process.env.NODE_ENV !== "production" || !GA_ID) return null;

    return (
        <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive"/>
            <Script id="ga4-init" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
        </>
    );
}
