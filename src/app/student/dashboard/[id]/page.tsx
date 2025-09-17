'use client'

import {use, useCallback} from "react";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import forumService from "@/services/ForumService";
import { toast } from "sonner";

export default function ReplyPage({params}: { params: Promise<{ id: number }> }) {

    const {id} = use(params);
    const {register, handleSubmit} = useForm();
    const fetchReply = useCallback(async (id: number) => {

    }, []);
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
    return (
        <section className={' w-full max-w-7xl mx-auto'}>
            <div>
                <div>
                    {/*form*/}
                    <form onSubmit={handleSubmit(handleAddReply)}>
                        <div className={'font-poppins flex-col space-y-4 w-full p-2'}>
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
                </div>
            </div>
        </section>
    )

}