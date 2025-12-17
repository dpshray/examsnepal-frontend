'use client'

import {use, useCallback, useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import forumService from "@/services/ForumService";
import { toast } from "sonner";

export default function ReplyPage({params}: { params: Promise<{ id: number }> }) {
    const {id} = use(params);
    const {register, handleSubmit} = useForm();
    const [answers, setAnswers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReply = useCallback(async (id: number) => {
        try {
            setLoading(true);
            const res = await forumService.getForumQuestionById(id); 
            setAnswers(res?.question?.answers ?? []);
        } catch (err) {
            console.error(err);
            setAnswers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) fetchReply(id);
    }, [id, fetchReply]);

    const handleAddReply = async (data: any) => {
        try {
            const payload = {
                question_id: id,
                answer: data.reply
            }
            console.log(payload)
            const response = await forumService.addReply(payload)
            console.log(`Reply`, response)
            if (response) {
                toast.success(response?.message || "Reply submitted successfully");
                fetchReply(id);
            }
        } catch (error) {
        }

    }

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
            d.getDate()
        ).padStart(2, "0")}`;
    };

    return (
        <section className={' w-full max-w-7xl mx-auto p-2'}>
            {/*form*/}
            <form onSubmit={handleSubmit(handleAddReply)}>
                <div className={'font-poppins flex-col space-y-4 w-full '}>
                    <Label htmlFor={'reply'} className={' font-poppins text-lg'}>Reply</Label>
                    <Textarea
                        id={'reply'}
                        placeholder={'Add your reply here'}
                        rows={4}
                        {...register('reply')}
                        className={'focus-visible:ring-0 text-black/90 text-base font-poppins'}
                    />
                    <Button className={'primary-btn'} type={'submit'}>
                        Submit
                    </Button>
                </div>
            </form>

            <div className="mt-6 space-y-4">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-lg bg-gray-100 animate-pulse h-20" />
                    ))
                ) : answers.length === 0 ? (
                    <p className="text-sm text-gray-500">No replies yet.</p>
                ) : (
                answers.map((ans) => (
                    <div
                        key={ans.id}
                        className="p-4 border rounded-lg shadow-sm bg-white space-y-1"
                    >
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-gray-800">
                            {ans.student_profile?.name ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(ans.created_at)}</p>
                    </div>
                        <p className="text-gray-700 text-sm">{ans.answer}</p>
                    </div>
                ))
                )}
            </div>
        </section>
    )

}