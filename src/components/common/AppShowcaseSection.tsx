import Image from "next/image";
import Link from "next/link";

const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=com.dwork.examsnepal&pcampaignid=web_share";

function GooglePlayIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 2.5v19l14-9.5L3 2.5Z" fill="#fff" />
            <path d="M3 2.5 14.5 12 3 21.5V2.5Z" fill="#00E676" />
            <path d="M14.5 12 18.5 9 21 10.7 14.5 12Z" fill="#FF3D00" />
            <path d="M14.5 12 18.5 15 21 13.3 14.5 12Z" fill="#FFC400" />
        </svg>
    );
}

function AppleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#94a3b8" aria-hidden="true">
            <path d="M16.5 2c.1 1.1-.3 2.2-1 3-.7.8-1.9 1.5-3 1.4-.1-1.1.4-2.2 1-3 .8-.8 2-1.4 3-1.4ZM20 17.3c-.6 1.3-.9 1.9-1.6 3-1 1.5-2.5 3.4-4.3 3.4-1.6 0-2-1-4.1-1-2.2 0-2.6 1-4.2 1-1.8 0-3.2-1.7-4.2-3.2C-.8 16.8-.4 11 3 8.3c1.3-1 2.7-1.6 4-1.6 1.5 0 2.6 1 4 1 1.3 0 2.2-1 4-1 1.2 0 3.2.5 4.5 2.3-3.9 2.2-3.3 7.6.5 8.3Z" />
        </svg>
    );
}

// Real home-screen screenshot from the app (720x1600), framed in a phone
// bezel. The status bar in the shot is the device's own, not drawn by us.
function PhonePreview() {
    return (
        <div className="w-[240px] rounded-[32px] bg-gray-900 p-2.5 shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)]">
            <div className="relative aspect-[720/1600] w-full overflow-hidden rounded-[22px]">
                <Image
                    src="/images/app-home-screenshot.jpg"
                    alt="ExamsNepal Android app home screen: search, study prompt, and overall performance stats"
                    fill
                    sizes="240px"
                    className="object-cover"
                />
            </div>
        </div>
    );
}

export function AppShowcaseSection() {
    return (
        <section className="container mx-auto mt-20 px-6 sm:px-10 lg:px-20">
            <div className="relative flex flex-col items-center gap-10 overflow-hidden rounded-3xl bg-green-50 px-6 py-14 sm:px-14 md:flex-row md:justify-between md:gap-16">
                <div
                    className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-green-600/10"
                    aria-hidden="true"
                />

                <div className="relative flex max-w-md flex-col items-center gap-5 text-center md:items-start md:text-left">
                    <span className="inline-flex w-fit rounded-full border border-green-200 bg-white px-4 py-1.5 text-sm font-semibold text-green-700">
                        Now on Android
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Take ExamsNepal with you
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Practice mock tests, review past questions, and check your live rank
                        — right from your phone. The same 194,000+ question bank, wherever
                        you are.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3.5 md:justify-start">
                        <Link
                            href={PLAY_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Get ExamsNepal on Google Play (opens in new tab)"
                            className="flex items-center gap-2.5 rounded-xl bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800"
                        >
                            <GooglePlayIcon />
                            <span className="leading-tight">
                                <span className="block text-[10px] text-white/70">GET IT ON</span>
                                <span className="block text-sm font-semibold">Google Play</span>
                            </span>
                        </Link>
                        <span
                            className="flex items-center gap-2.5 rounded-xl bg-gray-200 px-5 py-3 text-gray-400"
                            aria-label="ExamsNepal on the App Store: coming soon"
                        >
                            <AppleIcon />
                            <span className="leading-tight">
                                <span className="block text-[10px]">COMING SOON ON</span>
                                <span className="block text-sm font-semibold">App Store</span>
                            </span>
                        </span>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <PhonePreview />
                </div>
            </div>
        </section>
    );
}
