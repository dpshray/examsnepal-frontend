import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { FormatDefinition } from "./formatData";

export default function FormatHero({ format }: { format: FormatDefinition }) {
    return (
        <div className="bg-gradient-to-br from-green-700 to-green-600 text-white">
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold font-montserrat mb-3">{format.heroTitle}</h1>
                <p className="text-green-50 max-w-2xl mx-auto mb-8">{format.heroTagline}</p>
                <Button
                    asChild
                    size="lg"
                    className="bg-white text-green-700 hover:bg-green-50 font-semibold"
                >
                    <Link href="/login">{format.ctaLabel}</Link>
                </Button>
            </div>
        </div>
    );
}
