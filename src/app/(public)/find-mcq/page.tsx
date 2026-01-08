'use client';

import {GiStethoscope, GiTooth} from 'react-icons/gi';
import {FaHeartbeat, FaTools} from 'react-icons/fa';
import {useEffect, useState} from 'react';
import BannerHeader from '@/components/banner/header';
import {QuestionSolutionCard} from '@/components/Exams/QuestionCard';
import mcqService from '@/services/McqService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import CustomPagination from '@/components/Pagination';

interface CategoryCardProps {
    icon: React.ElementType;
    title: string;
    questionCount?: string;
    onClick?: () => void;
}

function CategoryCard({icon: Icon, title, questionCount, onClick}: CategoryCardProps) {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer opacity-80 bg-[#B1B1B114] max-w-md px-2 pt-3 h-24 rounded-lg shadow-md flex gap-3 hover:drop-shadow-2xl transition duration-300 ease-in-out"
            style={{boxShadow: '0px 4px 8px 0px #0000001A'}}
        >
            <div className="flex items-center justify-center w-16 h-16 shrink-0 bg-white rounded-full">
                <Icon className="w-8 h-8 hover:fill-green-600 hover:stroke-green-600" fill="green"/>
            </div>
            <div className="flex flex-col justify-center">
                <h3 className="text-base font-montserrat text-black">{title}</h3>
                <p className="text-sm font-montserrat">{questionCount || '0'} Questions</p>
            </div>
        </div>
    );
}

interface McqOption {
    option: string;
    value: number;
}

interface Mcq {
    id: number;
    question: string;
    options: McqOption[];
    explanation: string;
    selectedValue?: string;
}

export default function FindMcq() {
    const [query, setQuery] = useState<string>('');
    const [mcqs, setMcqs] = useState<Mcq[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchMcqs = async () => {
            setLoading(true);
            try {
                const response = await mcqService.searchMcq(query, page);
                setMcqs(response?.data?.data || []);
                setTotalPages(response?.data?.last_page || 1);
                setError('');
            } catch (err: any) {
                const message =
                    err?.data?.message || 
                    err?.message ||                
                    'Failed to fetch MCQs';
                setError(message);
                setMcqs([]);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchMcqs();
        }
    }, [query, page]);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="min-h-screen bg-gray-50">
            <BannerHeader
                title="Find Your MCQ"
                subtitle="Explore a wide range of MCQs"
                imageSrc="/banner.png"
                onSearchAction={handleSearch}
            />

            <div className="max-w-6xl mx-auto px-4 py-8">
                
                {loading && (
                    <div>
                        <Skeleton className="h-6 w-1/3 mb-4 mx-auto" />
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    </div>
                )}

                {/* MCQs Found */}
                {!loading && !error && mcqs.length > 0 ? (
                    <>
                        <div className="flex flex-col gap-4">
                            {mcqs.map((mcq) => {
                                const correctAnswers = mcq.options
                                    .filter((opt) => opt.value === 1)
                                    .map((opt) => opt.option.trim());

                                return (
                                    <div key={mcq.id} className="">
                                        <QuestionSolutionCard
                                            questionNumber={mcq.id}
                                            questionText={mcq.question}
                                            options={mcq.options.map((option, idx) => ({
                                                label: option.option.trim(),
                                                value: option.value === 1 ? option.option.trim() : `option-${idx}`,
                                                isCorrect: option.value === 1,
                                            }))}
                                            onSelect={() => {
                                            }}
                                            selectedValue={mcq.selectedValue || ''}
                                            showFeedback={true}
                                            correctAnswers={correctAnswers}
                                            explanation={mcq.explanation}
                                            id={mcq.id}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                       
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <CustomPagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChangeAction={handlePageChange}
                                    maxPagesToShow={5}
                                />
                            </div>
                        )}
                    </>
                ) : (
                        !query && !loading && (
                            <div className="flex flex-col items-center text-center mb-8">
                                <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-4">
                                    Explore MCQs Instantly
                                </h2>
                                <p className="text-muted-foreground font-montserrat mb-4 max-w-2xl">
                                    Search for any topic or exam type to start practicing multiple choice questions.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Try keywords like <span className="font-semibold">&quot;Physiology&quot;</span> or <span className="font-semibold">&quot;Engineering&quot;</span>.
                                </p>
                            </div>
                        )
                    )
                }

                {/* No results message (only after search attempt) */}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && error && query && mcqs.length === 0 && (
                    <p className="text-center text-gray-500">
                        No MCQs found for &#34;{query}&#34;. Please try a different search term.
                    </p>
                )}
            </div>
        </section>
    );
}
