'use client';

import {GiStethoscope, GiTooth} from 'react-icons/gi';
import {FaHeartbeat, FaTools} from 'react-icons/fa';
import {useEffect, useState} from 'react';
import BannerHeader from '@/components/banner/header';
import {QuestionCard} from '@/components/Exams/QuestionCard';
import mcqService from '@/services/McqService';

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

    const categories = [
        {title: 'Dental NMCLE / Loksewa / MDS', icon: GiTooth, questions: '200+'},
        {title: 'Medical NMCLE / Loksewa / MDMS', icon: GiStethoscope, questions: '200+'},
        {title: 'MBBS Entrance and Bachelor Level', icon: FaHeartbeat, questions: '200+'},
        {title: 'Engineering entrance and bachelor level', icon: FaTools, questions: '200+'},
        {title: 'Nursing entrance and bachelor level', icon: GiStethoscope, questions: '200+'},
        {title: 'Pharmacy entrance and bachelor level', icon: FaTools, questions: '200+'},
    ];

    useEffect(() => {
        const fetchMcqs = async () => {
            setLoading(true);
            try {
                const response = await mcqService.searchMcq(query, page);
                setMcqs(response?.data?.data || []);
                setError('');
                console.log(`MCQs`, response?.data?.data);
            } catch (err) {
                setError('Failed to fetch MCQs');
                setMcqs([]);
                console.error(err);
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

    return (
        <section className="min-h-screen bg-gray-50">
            <BannerHeader
                title="Find Your MCQ"
                subtitle="Explore a wide range of MCQs"
                imageSrc="/banner.png"
                onSearchAction={handleSearch}
            />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col items-center text-center mb-8">
                    <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-6">
                        Find MCQ by Category
                    </h2>
                    <p className="text-muted-foreground font-montserrat mb-4 max-w-2xl">
                        Browse through our extensive collection of MCQs categorized by subject and exam type. Whether
                        you&#39;re preparing
                        for a medical, engineering, or other entrance exam, we have the right practice material for you.
                    </p>
                </div>

                {/* Loading/Error Messages */}
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

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
                                        <QuestionCard
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
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Placeholder */}
                        <div className="flex justify-center mt-8">
                            {/* <Pagination page={page} setPage={setPage} total={totalPages} /> */}
                        </div>
                    </>
                ) : (
                    // Show category cards if no MCQs or query is empty
                    !query && !loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 place-items-center">
                            {categories.map((category, index) => (
                                <CategoryCard
                                    key={index}
                                    icon={category.icon}
                                    title={category.title}
                                    questionCount={category.questions}
                                    onClick={() => handleSearch(category.title)}
                                />
                            ))}
                        </div>
                    )
                )}

                {/* No results message (only after search attempt) */}
                {!loading && !error && query && mcqs.length === 0 && (
                    <p className="text-center text-gray-500">
                        No MCQs found for &#34;{query}&#34;. Please try a different search term.
                    </p>
                )}
            </div>
        </section>
    );
}
