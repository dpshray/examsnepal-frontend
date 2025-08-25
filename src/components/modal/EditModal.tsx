'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FaEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function EditModal({
                                      id,
                                      question,
                                      onEditAction
                                  }: {
    id: number;
    question: string;
    onEditAction: (id: number, updatedQuestion: string) => void;
}) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<{ question: string }>();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setValue("question", question);
        }
    }, [open, question, setValue]);

    const handleQuestionSubmit = (data: { question: string }) => {
        onEditAction(id, data.question); // Send back updated data
        setOpen(false); // Close modal
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-transparent hover:bg-transparent shadow-none hover:shadow-none border-none"
                    aria-label="Edit question"
                >
                    <FaEdit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Question</DialogTitle>
                    <DialogDescription>Update your dropped question below.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit(handleQuestionSubmit)}>
                    <Textarea
                        id="question"
                        placeholder="Update your question..."
                        {...register("question", { required: "Question is required" })}
                    />
                    {errors.question && (
                        <p className="text-sm text-red-500">{errors.question.message}</p>
                    )}
                    <div className="flex justify-end">
                        <Button type="submit" className="primary-btn">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
