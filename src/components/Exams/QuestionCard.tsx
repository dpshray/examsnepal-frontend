import {cn} from "@/lib/utils";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Textarea} from "@/components/ui/textarea"
import doubtsService from "@/services/DoubtService";
import {toast} from "sonner";

type Option = {
    label: string | number;
    value: string;
    isCorrect: boolean;
};

type Question = {
    id: number;
    question: string;
    explanation: string;
    options: Option[];
};

type QuestionCardProps = {
    questionNumber: number;
    questionText: string;
    options: Option[];
    onSelect: (value: any) => void;
    selectedValue?: string;
    showFeedback: boolean;
    correctAnswers: string[];
    explanation: string;
    disabled?: boolean;
    className?: string
    id?: number
    raiseDoubt?: boolean
};


export const QuestionSolutionCard = ({
                                         questionNumber,
                                         questionText,
                                         options,
                                         onSelect,
                                         selectedValue,
                                         showFeedback,
                                         correctAnswers,
                                         explanation,
                                         disabled = false,
                                         id,
                                         className,
                                         raiseDoubt=true
                                     }: QuestionCardProps) => {
    const questionId = `question-${questionNumber}`;
    const [explanationVisible, setExplanationVisible] = useState(false);
    const handleExplanation = () => {
        setExplanationVisible(!explanationVisible);
    };

    return (
        <article
            aria-labelledby={`${questionId}-title`}
            className={cn(
                'w-full flex flex-col gap-4 p-6 bg-transparent rounded-lg shadow-sm border border-border',
                showFeedback && selectedValue && correctAnswers.includes(selectedValue) && 'border-green-500',
                showFeedback && selectedValue && !correctAnswers.includes(selectedValue) && 'border-red-500',
                showFeedback && !selectedValue && 'border-blue-200'
                , className
            )}
        >
            <header>
                <h2 id={`${questionId}-title`} className="text-lg sm:text-xl font-semibold text-muted-900 leading-snug">
                    {questionNumber}. {questionText}
                </h2>
            </header>

            <fieldset className="mt-2 w-full">
                <legend className="sr-only">Answer choices</legend>
                <RadioGroup
                    value={selectedValue ?? ""}
                    className="flex flex-col gap-3"
                    onValueChange={onSelect}
                    disabled={showFeedback}
                >
                    {options.map((item, index) => {
                        const isCorrect = correctAnswers.includes(item.value);
                        const isSelected = selectedValue === item.value;

                        return (
                            /*Disable the radio button if showFeedback is true*/
                            <div
                                key={index}
                                aria-labelledby={`${questionId}-option-${item.value}`}
                                onClick={!showFeedback ? () => {
                                    return onSelect(item.value);
                                } : undefined}
                                className={cn(
                                    " relative flex items-center p-2 rounded text-base font-poppins font-normal w-full bg-gray-100  text-gray-800 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200  transition-colors duration-200",
                                    selectedValue === item.value && !showFeedback && "border border-green-200 bg-green-50  ",
                                    showFeedback && isCorrect && "bg-green-100 border-green-500",
                                    showFeedback && isSelected && !isCorrect && "bg-red-100 border-red-500",
                                    showFeedback && "pointer-events-none opacity-70 cursor-not-allowed"
                                )}
                                aria-disabled={disabled}

                            >


                                <RadioGroupItem
                                    value={item.value}
                                    id={`${questionId}-option-${item.value}`}
                                    className={cn(
                                        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70 border-gray-900 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30',
                                        showFeedback ? 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70' : '',
                                    )}
                                    disabled={showFeedback}
                                    checked={isSelected}
                                    aria-checked={isSelected}
                                />
                                <Label
                                    htmlFor={`${questionId}-option-${item.value}`}
                                    className={cn(
                                        "ml-3",
                                        showFeedback ? "peer-disabled:cursor-not-allowed peer-disabled:opacity-70" : "",
                                        showFeedback
                                            ? isCorrect
                                                ? "text-green-700"
                                                : isSelected
                                                    ? "text-red-700"
                                                    : ""
                                            : ""
                                    )}
                                    aria-hidden="true"

                                >
                                    {item.label}

                                </Label>
                            </div>
                        );
                    })}
                </RadioGroup>
            </fieldset>
            {
                showFeedback && (
                    <Button
                        variant="outline"
                        className="mt-2 w-full sm:w-auto primary-btn"
                        onClick={handleExplanation}
                    >
                        Show Explanation
                    </Button>
                )
            }

            {
                explanationVisible && (
                    <div className={' flex flex-col gap-2'}>
                        <div className="mt-2 text-base text-muted-foreground italic font-poppins">
                            <span className="font-bold text-muted-900">Explanation:</span>
                            <p dangerouslySetInnerHTML={{__html: explanation}}/>
                        </div>
                        {raiseDoubt && <RaiseDoubtModal questionId={id}/>}
                    </div>

                )
            }


        </article>
    );
};

export const QuestionCardSkeleton = () => {
    return (
        <article
            className="w-full flex flex-col gap-4 p-6 bg-transparent rounded-lg shadow-sm border border-border animate-pulse">
            <header>
                <div className="h-6 sm:h-7 bg-muted rounded w-3/4"></div>
            </header>

            <fieldset className="mt-2 w-full flex flex-col gap-3">
                {[1, 2, 3, 4].map((_, idx) => (
                    <div
                        key={idx}
                        className="flex items-center p-2 rounded w-full bg-input text-gray-800 dark:text-gray-200 border border-border"
                    >
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-muted"></div>
                        <div className="ml-3 h-4 bg-muted rounded w-2/3"></div>
                    </div>
                ))}
            </fieldset>

            <div className="mt-2 h-4 bg-muted w-1/2 rounded"></div>
            <div className="h-3 bg-muted w-full rounded"></div>
            <div className="h-3 bg-muted w-5/6 rounded"></div>
        </article>
    );
};

export function RaiseDoubtModal({questionId }: { questionId?: number }) {
    const [open, setOpen] = useState(false);
    const [doubt, setDoubt] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // console.log("questionId", questionId)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!doubt.trim()) {
            setError("Please enter your doubt before submitting.");
            return;
        }

        setLoading(true);
        try {
            const response = await doubtsService.createDoubt({
                question_id: questionId,
                doubt: doubt.trim(),
            });

            toast.success(response?.data?.message || "Doubt sent successfully");
            setDoubt("");
            setOpen(false);
        } catch (err: any) {
            console.error("Error sending doubt:", err);
            toast.error("Failed to send your doubt. Please try again.");
            setError("An error occurred while submitting your doubt.");
            setOpen(false)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-2 w-fit bg-amber-600 hover:bg-amber-700 !text-white">
                    Raise a doubt
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="font-poppins text-center space-y-2">
                    <DialogTitle className="text-black/80">
                        Have Doubts about the Solutions? Write them here...
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        We will get back to you as soon as possible.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <Textarea
                        rows={6}
                        id="doubt-modal"
                        placeholder="Write your doubt here..."
                        aria-label="Write your doubt here..."
                        value={doubt}
                        onChange={(e) => setDoubt(e.target.value)}
                        disabled={loading}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="flex flex-col sm:flex-row sm:justify-end">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                {loading ? "Sending..." : "Send Doubt"}
                            </Button>
                        </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
