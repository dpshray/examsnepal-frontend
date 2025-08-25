import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {LuMessageCircleReply} from "react-icons/lu";

export type OptionType = {
    id: number;
    option: string;
    question_id: number;
    value: number;
};

export interface BaseQuestionType {
    id: number;
    exam_id: number;
    question: string;
    explanation: string;
}

export interface QuestionWithOptions extends BaseQuestionType {
    options: OptionType[];
}

export interface DoubtsUnsolvedCardProps {
    question_id?: number;
    solved_by?: string | null;
    doubt: string;
    created_at: string;
    updated_at: string;
    status: string;
    remark: string | null;
    question: QuestionWithOptions | null;
    index?: number | any;
}

export interface DoubtSolvedCardProps {
    index?: number | any;
    id?: number;
    doubt: string;
    created_at: string;
    updated_at: string;
    question: BaseQuestionType;
    solved_by: {
        id: number;
        fullname: string;
        username: string;
    };

}


export function DoubtSolvedCard({
                                    doubt,
                                    created_at,
                                    updated_at,
                                    question,
                                    solved_by,
                                    index
                                }: any) {
    const [explanation, setExplanation] = useState<string | boolean>(false);
    return (
        <div className="w-full font-poppins flex flex-col items-start justify-start shadow-lg rounded-md p-4">
            <div className="font-poppins flex items-center mb-2">
                <h2 className="text-lg md:text-xl font-semibold  font-poppins space-x-2 ">
                    <span className={' font-semibold  text-green-600 mr-3'}>
                        {index + 1 + '.'}
                    </span>
                    {question.question}
                </h2>
            </div>

            <div className="w-full flex flex-col items-start justify-start mb-2">
                {question && (
                    <div className="flex items-center w-full">
                        <ul className={`pl-5 flex flex-col space-y-2 w-full ${question.options.length > 0 ? 'block' : 'hidden'}`}>
                            {question.options.map((option: any, index: number) => (
                                <li
                                    key={option.id}
                                    className="text-sm flex items-center space-x-2 text-gray-700"
                                >
                                        <span
                                            className="font-semibold w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full">
                                          {String.fromCharCode(65 + index)}
                                        </span>
                                    <span>{option.option}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <Card className="relative bg-green-100 border-l-8 border-primaryGreen px-2 py-1 gap-2 w-full rounded-md">
                <div className="flex justify-between items-start">
                    <div className={'flex flex-col w-full space-y-2'}>
                        <h3 className="text-xl font-semibold mb-2">Your Doubt</h3>
                        <p className={' text-base md:text-lg'}>
                            {doubt}
                        </p>
                    </div>
                </div>
                <div className={' flex justify-between items-center'}>
                    <div className={'flex flex-col space-y-1'}>
                        <p className="text-sm text-black/90 ">
                            Solved by {solved_by.fullname} (@{solved_by.username})
                        </p>
                        <p className="text-xs text-black/90 ">
                            Updated on: {new Date(updated_at).toLocaleDateString()}
                        </p>
                    </div>
                    <Button size={'icon'}
                            onClick={() => {
                                setExplanation(!explanation);
                            }}
                            className={'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-300 rounded-full p-2'}>
                        <LuMessageCircleReply className={'w-4 h-4 text-white'} fill={'#fff'}/>
                    </Button>
                </div>
                <div className={' flex flex-col space-y-2 mt-1 font-poppins'}>
                    {
                        explanation && (
                            <div className="flex flex-col space-y-2">
                                <h3 className="text-lg font-semibold">Explanation</h3>
                                <p className={' text-base'}>
                                    {question.explanation}
                                </p>
                            </div>
                        )
                    }
                </div>
            </Card>
        </div>
    );
}


export function UnSolvedDoubtsCard({
                                       doubt,
                                       question,
                                       index,
                                   }: DoubtsUnsolvedCardProps) {

    return (
        <div className="w-full font-poppins flex flex-col items-start justify-start shadow-lg rounded-md p-4">
            {question ? (
                <div className="flex items-center mb-2">
                    <h2 className="text-lg font-semibold space-x-2">
           <span className="font-bold text-green-600 mr-2">
            {index + 1 + '.'}
            </span>

                        {question.question}
                    </h2>
                </div>
            ) : (
                <h2 className="text-lg md:text-xl font-semibold text-red-600 mb-2">
                    Question not available
                </h2>
            )}

            <div className="w-full flex flex-col items-start justify-start mb-2">
                {question && (
                    <div className="flex items-center w-full">
                        <ul className={`pl-5 flex flex-col space-y-2 w-full ${question.options.length > 0 ? 'block' : 'hidden'}`}>
                            {question.options.map((option, index) => (
                                <li
                                    key={option.id}
                                    className="text-sm flex items-center space-x-2 text-gray-700"
                                >
                                        <span
                                            className="font-semibold w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full">
                                          {String.fromCharCode(65 + index)}
                                        </span>
                                    <span>{option.option}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <Card
                className="relative bg-gradient-to-r from-amber-50 to-amber-100 border-l-8 border-amber-500  p-2 w-full rounded-md">
                <div className="flex  flex-col justify-between items-start">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold ">Your Doubt</h3>
                        <p className={' text-base'}>
                            {doubt}
                        </p>
                    </div>
                    <p className={' text-base text-gray-700 mt-2'}>
                        {question?.explanation}
                    </p>
                </div>
            </Card>
        </div>
    );
}

export function DoubtsCardSkeleton() {
    return (
        <div className="w-full">
            <div className="mb-6">
                {/* Question skeleton */}
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>

            <Card className="relative bg-gray-50 border-l-4 border-green-200 p-4 rounded-md">
                <div className="flex justify-between items-start">
                    <div className="w-full">
                        {/* Heading skeleton */}
                        <div className="h-7 bg-gray-200 rounded animate-pulse w-1/3 mb-4"></div>

                        {/* Doubt text skeleton */}
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-4/5"></div>
                    </div>

                    {/* Mail icon skeleton */}
                    <div className="flex-shrink-0 ml-4">
                        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse relative">
                            <div
                                className="absolute -top-2 -right-2 bg-gray-200 rounded-full w-5 h-5 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
