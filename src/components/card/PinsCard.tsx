import {useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Pin} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {RiUnpinLine} from "react-icons/ri";
import {Skeleton} from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Option = {
    id: number;
    question_id: number;
    value: boolean;
    option: string;
};

type Student = {
    id: number;
    name: string;
};

export type Pin = {
    id: number;
    question: string;
    explanation: string;
    options: Option[];
    bookmarks_count: number;
    exam_id?: number;
    exam_type_id: number;
    students: Student[];
};

interface PinCardProps {
    pin: Pin;
    index: number;
}

export type MyPin = {
    id: number;
    question: {
        id: number;
        question: string;
        explanation: string;
        options: Option[];
        bookmarks_count: number;
        exam_id?: number;
    };
    question_id: number;
};

type MyPinCardProps = {
    index: number;
    pin: MyPin;
    onDeleteAction: (pinId: number) => void;
};

export const PinCard = ({pin, index}: PinCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="shadow-md border border-gray-200 rounded-2xl w-full">
            <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col gap-3 sm:gap-4">
                <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-red-600 flex-shrink-0"/>
                        <span
                            className="text-xs sm:text-sm">{pin.bookmarks_count} Pin{pin.bookmarks_count !== 1 ? "s" : ""}</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded w-fit">
                        Exam ID: {pin.exam_id ?? "N/A"}
                    </span>
                </div>

                <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 break-words leading-relaxed">
                        <span className="font-semibold text-green-600 mr-1">{index + 1}.</span>
                        {pin.question}
                    </h3>
                    <ul className="space-y-2">
                        {pin.options.map((opt) => (
                            <li
                                key={opt.id}
                                className={cn(
                                    "text-xs sm:text-sm text-gray-700 border p-2 sm:p-3 rounded-md bg-gray-50 break-words leading-relaxed",
                                    opt.value ? "border-green-500" : "border-gray-300"
                                )}
                            >
                                <span className="font-medium mr-1 flex-shrink-0">
                                    {opt.value ? (
                                        <span className="text-green-500 font-semibold mr-1 select-none">✔️</span>
                                    ) : (
                                        <span className="text-red-500 font-semibold mr-1 select-none">✖️</span>
                                    )}
                                </span>
                                {opt.option}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col items-stretch sm:items-end gap-2 w-full">
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full sm:w-fit bg-green-600 text-white hover:bg-green-700 text-sm sm:text-base px-3 py-2"
                    >
                        {isExpanded ? "Hide Explanation" : "Show Explanation"}
                    </Button>
                    {isExpanded && (
                        <div
                            className="mt-2 text-xs sm:text-sm text-gray-600 text-left w-full break-words leading-relaxed">
                            <h4 className="font-semibold mb-2">Explanation:</h4>
                            <p className="mb-3">{pin.explanation}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export const MyPinCard = ({pin, onDeleteAction, index}: MyPinCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (pinId: number) => {
        setIsDeleting(true);
        setTimeout(() => {
            onDeleteAction(pinId);
            setIsDeleting(false);
        }, 2000);
    };

    return (
        <Card className="shadow-md border border-gray-200 rounded-2xl w-full">
            <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col gap-3 sm:gap-4">
                <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-red-600 flex-shrink-0"/>
                        <span
                            className="text-xs sm:text-sm">{pin.question.bookmarks_count} Pin{pin.question.bookmarks_count !== 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded w-fit">
                        Exam ID: {pin.question.exam_id ?? "N/A"}
                    </span>
                </div>

                <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 break-words leading-relaxed">
                        <span className="font-semibold text-green-600 mr-1">{index + 1}.</span>
                        {pin.question.question}
                    </h3>
                    <ul className="space-y-2">
                        {pin.question.options.map((opt) => (
                            <li
                                key={opt.id}
                                className={cn(
                                    "text-xs sm:text-sm text-gray-700 border p-2 sm:p-3 rounded-md bg-gray-50 break-words leading-relaxed",
                                    opt.value ? "border-green-500" : "border-gray-300"
                                )}
                            >
                                <span className="font-medium mr-1 flex-shrink-0">
                                    {opt.value ? (
                                        <span className="text-green-500 font-semibold mr-1 select-none">✔️</span>
                                    ) : (
                                        <span className="text-red-500 font-semibold mr-1 select-none">✖️</span>
                                    )}
                                </span>
                                {opt.option}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col items-stretch sm:items-end gap-2 w-full">
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full sm:w-fit bg-green-600 text-white hover:bg-green-700 text-sm sm:text-base px-3 py-2"
                    >
                        {isExpanded ? "Hide Explanation" : "Show Explanation"}
                    </Button>
                    {isExpanded && (
                        <div className="mt-2 text-xs sm:text-sm text-gray-600 w-full break-words leading-relaxed">
                            <h4 className="font-semibold mb-2">Explanation:</h4>
                            <p className="mb-4">{pin.question.explanation}</p>

                            <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            className="w-full sm:w-fit bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 text-sm px-3 py-2">
                                            Unpin
                                            <RiUnpinLine className="w-4 h-4"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="w-11/12 max-w-md mx-auto">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-sm sm:text-base">Are you sure you want to
                                                unpin this question?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-xs sm:text-sm">
                                                This action cannot be undone. Are you sure you want to unpin this
                                                question?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                            <AlertDialogCancel disabled={isDeleting}
                                                               className="w-full sm:w-auto text-sm">Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(pin.question_id)}
                                                disabled={isDeleting}
                                                className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 text-sm"
                                            >
                                                {isDeleting ? "Unpinning..." : "Unpin"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export const MyPinCardSkeleton = () => {
    return (
        <Card className="shadow-md border border-gray-200 rounded-2xl w-full">
            <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col gap-3 sm:gap-4">
                <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full flex-shrink-0"/>
                        <Skeleton className="h-4 w-12 sm:w-16"/>
                    </div>
                    <Skeleton className="h-6 w-20 sm:w-24 rounded-md"/>
                </div>

                <div>
                    <Skeleton className="h-5 sm:h-6 w-full sm:w-3/4 mb-2 sm:mb-3 rounded-md"/>
                    <div className="space-y-2">
                        <Skeleton className="h-8 sm:h-10 w-full rounded-md"/>
                        <Skeleton className="h-8 sm:h-10 w-full rounded-md"/>
                        <Skeleton className="h-8 sm:h-10 w-full rounded-md"/>
                        <Skeleton className="h-8 sm:h-10 w-full rounded-md"/>
                    </div>
                </div>

                <div className="flex flex-col items-stretch sm:items-end gap-2 w-full">
                    <Skeleton className="h-8 sm:h-10 w-full sm:w-40 rounded-md"/>
                </div>
            </CardContent>
        </Card>
    );
};