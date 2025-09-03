'use client';

import {StudentBannerHeader} from "@/components/banner/header";
import {useCallback, useEffect, useState} from "react";
import doubtsService from "@/services/DoubtService";
import {DOUBT_TYPES, DoubtType} from "@/lib/Constan";
import {DoubtsCardSkeleton, DoubtSolvedCard, UnSolvedDoubtsCard,} from "@/components/card/DoubtCard";
import CustomPagination from "@/components/Pagination";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {BoxIcon, FileX, PanelsTopLeftIcon} from "lucide-react";
import {motion} from 'framer-motion';
import ErrorComponent from "@/components/state/ErrorComponent";
import {Button} from "@/components/ui/button";

interface DoubtData {
    doubt: string;
    created_at: string;
    updated_at: string;
    question?: any;
    solved_by?: any;
    status?: string;
    remark?: string;
    question_id?: number;
}

export default function Doubts() {
    const [selectedTab, setSelectedTab] = useState<DoubtType>(DOUBT_TYPES.SOLVED);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [solvedDoubts, setSolvedDoubts] = useState<DoubtData[]>([]);
    const [unsolvedDoubts, setUnsolvedDoubts] = useState<DoubtData[]>([]);
    const [solvedPage, setSolvedPage] = useState(1);
    const [totalSolvedPages, setTotalSolvedPages] = useState(1);
    const [unsolvedPage, setUnsolvedPage] = useState(1);
    const [totalUnsolvedPages, setTotalUnsolvedPages] = useState(1);

    const handleGetSolvedDoubts = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await doubtsService.getSolvedDoubts(page);
            setSolvedDoubts(response?.data?.data || []);
            setTotalSolvedPages(Math.ceil((response?.data?.total || 0) / 10));
        } catch (error: any) {
            setError(error?.message || "Failed to load solved doubts");
            setSolvedDoubts([]);
            setTotalSolvedPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleGetUnsolvedDoubts = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await doubtsService.getUnsolvedDoubts(page);
            setUnsolvedDoubts(response?.data?.data || []);
            setTotalUnsolvedPages(Math.ceil((response?.data?.total || 0) / 10));
        } catch (error: any) {
            setError(error?.message || "Failed to load unsolved doubts");
            setUnsolvedDoubts([]);
            setTotalUnsolvedPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRetry = useCallback(() => {
        if (selectedTab === DOUBT_TYPES.SOLVED) {
            handleGetSolvedDoubts(solvedPage);
        } else {
            handleGetUnsolvedDoubts(unsolvedPage);
        }
    }, [selectedTab, solvedPage, unsolvedPage, handleGetSolvedDoubts, handleGetUnsolvedDoubts]);

    useEffect(() => {
        if (selectedTab === DOUBT_TYPES.SOLVED) {
            handleGetSolvedDoubts(solvedPage);
        } else {
            handleGetUnsolvedDoubts(unsolvedPage);
        }
    }, [selectedTab, solvedPage, unsolvedPage, handleGetSolvedDoubts, handleGetUnsolvedDoubts]);

    const handlePageChange = (page: number) => {
        if (selectedTab === DOUBT_TYPES.SOLVED) {
            setSolvedPage(page);
        } else {
            setUnsolvedPage(page);
        }
    };

    const handleTabChange = (value: string) => {
        setSelectedTab(value as DoubtType);
        setError(null);
        if (value === DOUBT_TYPES.SOLVED) {
            setSolvedPage(1);
        } else {
            setUnsolvedPage(1);
        }
    };

    const getCurrentData = () => (selectedTab === DOUBT_TYPES.SOLVED ? solvedDoubts : unsolvedDoubts);
    const getCurrentTotalPages = () => (selectedTab === DOUBT_TYPES.SOLVED ? totalSolvedPages : totalUnsolvedPages);
    const getCurrentPage = () => (selectedTab === DOUBT_TYPES.SOLVED ? solvedPage : unsolvedPage);

    const EmptyState = ({type}: { type: "solved" | "unsolved" }) => (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <FileX className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4"/>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                No {type === "solved" ? "Solved" : "Unsolved"} Doubts Found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 text-center max-w-md px-4">
                {type === "solved"
                    ? "No doubts have been solved yet. Check back later for answered questions."
                    : "You haven't asked any questions yet. Start by asking your first doubt!"}
            </p>
            <Button variant="outline" onClick={handleRetry} className="mt-6">
                Refresh
            </Button>
        </div>
    );

    const tabContent = [
        {value: DOUBT_TYPES.SOLVED, label: "Solved Doubts", icon: PanelsTopLeftIcon},
        {value: DOUBT_TYPES.UNSOLVED, label: "Unsolved Doubts", icon: BoxIcon},
    ];

    return (
        <section id="doubts" className="min-h-screen bg-gray-50 font-poppins">
            <StudentBannerHeader
                title="Ask Your Doubts"
                subtitle="Get instant answers to your questions"
                className="bg-primaryGreen text-white"
                textClassName="text-white"
            />

            <div className="max-w-7xl w-full py-8 sm:py-12 lg:py-16 mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="flex flex-col items-center text-center mb-8 sm:mb-10"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        &#34;All question types solved in detail.&#34;
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed max-w-2xl">
                        Click on the Exam Name to access the solutions and get detailed explanations
                    </p>
                </motion.div>

                <ErrorComponent error={error} onRetry={handleRetry}/>

                <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
                    <ScrollArea className="w-full">
                        <TabsList
                            role="tablist"
                            className="before:bg-border relative mb-6 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px"
                        >
                            {tabContent.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="bg-muted overflow-hidden rounded-b-none border-x border-t  px-4 sm:px-6 data-[state=active]:z-10 data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all duration-200 flex items-center"
                                >
                                    <tab.icon className="me-2 opacity-60" size={16} aria-hidden="true"/>
                                    <span className="text-sm sm:text-base">{tab.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>

                    <TabsContent value={DOUBT_TYPES.SOLVED} className="mt-0">
                        {loading ? (
                            <div className="space-y-4 sm:space-y-6">
                                {Array.from({length: 6}).map((_, idx) => (
                                    <DoubtsCardSkeleton key={`solved-skeleton-${idx}`}/>
                                ))}
                            </div>
                        ) : !error && solvedDoubts.length === 0 ? (
                            <EmptyState type="solved"/>
                        ) : (
                            <div className="space-y-4 sm:space-y-6">
                                {solvedDoubts.map(
                                    (doubt, index) =>
                                        doubt.question &&
                                        doubt.solved_by && (
                                            <motion.div
                                                key={`solved-doubt-${index}`}
                                                initial={{opacity: 0, y: 20}}
                                                animate={{opacity: 1, y: 0}}
                                                transition={{duration: 0.4, delay: index * 0.1}}
                                            >
                                                <DoubtSolvedCard
                                                    index={index}
                                                    doubt={doubt.doubt}
                                                    created_at={doubt.created_at}
                                                    updated_at={doubt.updated_at}
                                                    question={doubt.question}
                                                    solved_by={doubt.solved_by}
                                                />
                                            </motion.div>
                                        )
                                )}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value={DOUBT_TYPES.UNSOLVED} className="mt-0">
                        {loading ? (
                            <div className="space-y-4 sm:space-y-6">
                                {Array.from({length: 6}).map((_, idx) => (
                                    <DoubtsCardSkeleton key={`unsolved-skeleton-${idx}`}/>
                                ))}
                            </div>
                        ) : !error && unsolvedDoubts.length === 0 ? (
                            <EmptyState type="unsolved"/>
                        ) : (
                            <div className="space-y-4 sm:space-y-6">
                                {unsolvedDoubts.map((doubt, index) => (
                                    <motion.div
                                        key={`unsolved-doubt-${index}`}
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.4, delay: index * 0.1}}
                                    >
                                        <UnSolvedDoubtsCard
                                            index={index}
                                            doubt={doubt.doubt}
                                            created_at={doubt.created_at}
                                            updated_at={doubt.updated_at}
                                            status={doubt.status}
                                            remark={doubt.remark}
                                            question={doubt.question}
                                            question_id={doubt.question_id || 0}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {getCurrentTotalPages() > 1 && !loading && !error && getCurrentData().length > 0 && (
                    <div className="flex justify-center mt-8 sm:mt-12">
                        <CustomPagination
                            totalPages={getCurrentTotalPages()}
                            currentPage={getCurrentPage()}
                            onPageChangeAction={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
