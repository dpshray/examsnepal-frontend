'use client';

import { StudentBannerHeader } from "@/components/banner/header";
import { useCallback, useEffect, useState } from "react";
import doubtsService from "@/services/DoubtService";
import { DOUBT_TYPES, DoubtType } from "@/lib/Constan";
import {
    DoubtsCardSkeleton,
    DoubtSolvedCard,
    UnSolvedDoubtsCard,
} from "@/components/card/DoubtCard";

import Pagination from "@/components/Pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { BoxIcon, PanelsTopLeftIcon } from "lucide-react";

export default function Doubts() {
    const [selectedTab, setSelectedTab] = useState<DoubtType>(DOUBT_TYPES.SOLVED);
    const [loading, setLoading] = useState(false);
    const [solvedDoubts, setSolvedDoubts] = useState<any[]>([]);
    const [unsolvedDoubts, setUnsolvedDoubts] = useState<any[]>([]);
    const [solvedPage, setSolvedPage] = useState(1);
    const [totalSolvedPages, setTotalSolvedPages] = useState(1);
    const [unsolvedPage, setUnsolvedPage] = useState(1);
    const [totalUnsolvedPages, setTotalUnsolvedPages] = useState(1);

    const handleGetSolvedDoubts = useCallback(async (page: number) => {
        setLoading(true);
        try {
            const response = await doubtsService.getSolvedDoubts(page);
            setSolvedDoubts(response?.data?.data || []);
            setTotalSolvedPages(Math.ceil((response?.data?.total || 0) / 10));
        } catch {
            setSolvedDoubts([]);
            setTotalSolvedPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleGetUnsolvedDoubts = useCallback(async (page: number) => {
        setLoading(true);
        try {
            const response = await doubtsService.getUnsolvedDoubts(page);
            setUnsolvedDoubts(response?.data?.data || []);
            setTotalUnsolvedPages(Math.ceil((response?.data?.total || 0) / 10));
        } catch {
            setUnsolvedDoubts([]);
            setTotalUnsolvedPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedTab === DOUBT_TYPES.SOLVED) {
            handleGetSolvedDoubts(solvedPage);
        } else {
            handleGetUnsolvedDoubts(unsolvedPage);
        }
    }, [
        selectedTab,
        solvedPage,
        unsolvedPage,
        handleGetSolvedDoubts,
        handleGetUnsolvedDoubts,
    ]);

    const handlePageChange = (page: number) => {
        if (selectedTab === DOUBT_TYPES.SOLVED) setSolvedPage(page);
        else setUnsolvedPage(page);
    };

    useEffect(() => {
        // Reset page when tab changes
        if (selectedTab === DOUBT_TYPES.SOLVED) setSolvedPage(1);
        else setUnsolvedPage(1);
    }, [selectedTab]);

    return (
        <section id="doubts" className="min-h-screen bg-white font-poppins">
            <StudentBannerHeader
                title="Ask Your Doubts"
                subtitle="Get instant answers to your questions"
                className="bg-primaryGreen text-white"
                textClassName="text-white"
            />

            <div className="max-w-7xl w-full my-6 md:my-10 mx-auto px-4 md:px-4">
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        “All question types solved in detail.”
                    </h2>
                    <p className="text-lg font-light leading-snug">
                        Click on the Exam Name to access the solutions
                    </p>
                </div>

                {/* Tabs */}
                <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val as DoubtType)} className="mt-6">
                    <ScrollArea>
                        <TabsList
                            role="tablist"
                            className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px"
                        >
                            <TabsTrigger
                                value={DOUBT_TYPES.SOLVED}
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                            >
                                <PanelsTopLeftIcon className="me-2 opacity-60" size={16} aria-hidden="true" />
                                Solved Doubts
                            </TabsTrigger>
                            <TabsTrigger
                                value={DOUBT_TYPES.UNSOLVED}
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                            >
                                <BoxIcon className="me-2 opacity-60" size={16} aria-hidden="true" />
                                Unsolved Doubts
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    {/* Solved Doubts */}
                    <TabsContent value={DOUBT_TYPES.SOLVED}>
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <DoubtsCardSkeleton key={idx} />
                                ))}
                            </div>
                        ) : (
                            solvedDoubts.map((doubt, index) =>
                                doubt.question && doubt.solved_by ? (
                                    <DoubtSolvedCard
                                        key={index}
                                        index={index}
                                        doubt={doubt.doubt}
                                        created_at={doubt.created_at}
                                        updated_at={doubt.updated_at}
                                        question={doubt.question}
                                        solved_by={doubt.solved_by}
                                    />
                                ) : null
                            )
                        )}
                    </TabsContent>

                    {/* Unsolved Doubts */}
                    <TabsContent value={DOUBT_TYPES.UNSOLVED}>
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <DoubtsCardSkeleton key={idx} />
                                ))}
                            </div>
                        ) : (
                            unsolvedDoubts.map((doubt, index) => (
                                <UnSolvedDoubtsCard
                                    key={index}
                                    index={index}
                                    doubt={doubt.doubt}
                                    created_at={doubt.created_at}
                                    updated_at={doubt.updated_at}
                                    status={doubt.status}
                                    remark={doubt.remark}
                                    question={doubt.question}
                                    question_id={0}
                                />
                            ))
                        )}
                    </TabsContent>
                </Tabs>

                {/* Pagination */}
                <div className="my-6 flex justify-center">
                    {(totalSolvedPages > 1 || totalUnsolvedPages > 1) && (
                        <Pagination
                            totalPages={
                                selectedTab === DOUBT_TYPES.SOLVED
                                    ? totalSolvedPages
                                    : totalUnsolvedPages
                            }
                            currentPage={
                                selectedTab === DOUBT_TYPES.SOLVED
                                    ? solvedPage
                                    : unsolvedPage
                            }
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
