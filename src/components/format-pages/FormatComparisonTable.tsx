import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { FORMAT_LIST, type FormatId } from "./formatData";

// Single shared comparison table rendered on all 3 format pages (/free-quiz, /sprint-quiz,
// /mock-test) — this is the main internal-linking mechanism between them.
export default function FormatComparisonTable({ current }: { current: FormatId }) {
    const rows: { label: string; get: (id: FormatId) => string }[] = [
        { label: "Duration", get: (id) => `${FORMAT_LIST_MAP[id].durationMinutes} min` },
        { label: "Negative marking", get: (id) => FORMAT_LIST_MAP[id].negativeMarking },
        { label: "Subscription", get: (id) => FORMAT_LIST_MAP[id].subscriptionRequirement },
        { label: "Best for", get: (id) => FORMAT_LIST_MAP[id].bestFor },
    ];

    return (
        <section className="max-w-5xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-6 text-center">
                Free Quiz vs Sprint Quiz vs Mock Test
            </h2>
            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-gray-50" />
                            {FORMAT_LIST.map((format) => (
                                <TableHead
                                    key={format.id}
                                    className={cn("bg-gray-50 text-center", format.id === current && "text-green-700")}
                                >
                                    {format.id === current ? (
                                        <span className="font-semibold">{format.name}</span>
                                    ) : (
                                        <Link href={format.route} className="font-semibold hover:underline">
                                            {format.name}
                                        </Link>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.label}>
                                <TableCell className="font-medium text-gray-900 whitespace-nowrap">{row.label}</TableCell>
                                {FORMAT_LIST.map((format) => (
                                    <TableCell key={format.id} className="text-center whitespace-normal">
                                        {row.get(format.id)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}

const FORMAT_LIST_MAP = Object.fromEntries(FORMAT_LIST.map((f) => [f.id, f])) as Record<FormatId, (typeof FORMAT_LIST)[number]>;
