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
    AlertDialogTrigger
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
        <Card className="shadow-md border border-gray-200 rounded-2xl py-2">
            <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-red-600"/>
                        <span>{pin.bookmarks_count} Pin</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        Exam ID: {pin.exam_id}
                    </span>
                </div>

                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                        <span className={' font-semibold text-green-600 mr-1'}>
                            {index + 1}.

                        </span>
                        {pin.question}
                    </h3>
                    <ul className="space-y-2 relative">
                        {pin.options.map((opt, idx) => (
                            <li key={opt.id} className={cn('text-sm text-gray-700 border p-2 rounded-md bg-gray-50',
                                opt.value ? 'border-green-500' : 'border-gray-300')}>
                                <span className="font-medium mr-1">
                                    {opt.value ? (
                                        <span className="text-green-500 font-semibold mr-1">✔️</span>
                                    ) : (
                                        <span className="text-red-500 font-semibold mr-1">✖️</span>
                                    )}
                                </span>
                                {opt.option}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col items-end justify-end gap-2 w-full">
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn('w-fit bg-green-600 text-white hover:bg-green-700')}
                    >
                        {isExpanded ? 'Hide Explanation' : 'Show Explanation'}
                    </Button>
                    {isExpanded && (
                        <div className="mt-2 text-sm text-gray-600 text-left w-full">
                            <h4 className="font-semibold mb-1">Explanation:</h4>
                            <p className={' whitespace-pre-line font-poppins'}>{pin.explanation}</p>
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
        }, 2000);
    };

    return (
        <Card className="shadow-md border border-gray-200 rounded-2xl py-2">
            <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-red-600"/>
                        <span>1</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        Exam ID: {pin.question.exam_id}
                    </span>
                </div>

                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                            <span className={' font-semibold text-green-600 mr-1'}>
                            {index + 1}.
                            </span>
                        {pin.question.question}
                    </h3>
                    <ul className="space-y-2 relative">
                        {pin.question.options.map((opt, idx) => (
                            <li key={opt.id} className={cn('text-sm text-gray-700 border p-2 rounded-md bg-gray-50',
                                opt.value ? 'border-green-500' : 'border-gray-300')}>
                                <span className="font-medium mr-1">
                                    {opt.value ? (
                                        <span className="text-green-500 font-semibold mr-1">✔️</span>
                                    ) : (
                                        <span className="text-red-500 font-semibold mr-1">✖️</span>
                                    )}
                                </span>
                                {opt.option}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col items-end justify-end gap-2 w-full">
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn('w-fit bg-green-600 text-white hover:bg-green-700')}
                    >
                        {isExpanded ? 'Hide Explanation' : 'Show Explanation'}
                    </Button>
                    {isExpanded && (
                        < section id={'pin-explanation'} className="mt-2 text-sm text-gray-600  w-full">
                            <div className="mt-2 text-sm text-gray-600 text-left w-full">
                                <h4 className="font-semibold mb-1">Explanation:</h4>
                                <p className={' whitespace-pre-line font-poppins'}>{pin.question.explanation}</p>
                            </div>

                            <div className={' flex justify-end items-end gap-2'}>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            className="w-fit bg-red-600 text-white hover:bg-red-700 flex items-end justify-end gap-2">
                                            Unpin
                                            <RiUnpinLine className="w-4 h-4"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to unpin this
                                                question?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. Are you sure you want to
                                                unpin this question?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

                                            <AlertDialogAction onClick={() => handleDelete(pin.question_id)}
                                                               disabled={isDeleting}
                                                               className={' bg-red-600 text-white hover:bg-red-700 cursor-pointer '}>
                                                {isDeleting ? 'Unpinning...' : 'Unpin'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </section>
                    )}


                </div>
            </CardContent>
        </Card>
    );
};

export const MyPinCardSkeleton = () => {
    return (
        <Card className="shadow-md border border-gray-200 rounded-2xl py-2">
            <CardContent className="p-6 flex flex-col gap-4">
                {/* Header: Icon + Exam ID */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full"/>
                        <Skeleton className="h-4 w-6"/>
                    </div>
                    <Skeleton className="h-5 w-24 rounded-md"/>
                </div>

                {/* Question */}
                <div>
                    <Skeleton className="h-6 w-3/4 mb-2"/>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-full rounded-md"/>
                        <Skeleton className="h-5 w-full rounded-md"/>
                        <Skeleton className="h-5 w-full rounded-md"/>
                        <Skeleton className="h-5 w-full rounded-md"/>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col items-end justify-end gap-2 w-full">
                    <Skeleton className="h-8 w-32 rounded-md"/>
                    <Skeleton className="h-8 w-20 rounded-md"/>
                </div>
            </CardContent>
        </Card>
    );
};
