'use client';

import {useEffect, useState} from 'react';
import {MessageCircle} from 'lucide-react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import mcqService from '@/services/McqService';

export interface QuestionComment {
    id: number;
    name: string;
    comment: string;
    created_at: string;
}

interface CommentSectionProps {
    slug: string;
    initialComments: QuestionComment[];
}

export function CommentSection({slug, initialComments}: CommentSectionProps) {
    const [comments, setComments] = useState<QuestionComment[]>(initialComments);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // The /mcq/[slug] page itself is ISR-cached (up to an hour), so the
        // server-rendered `initialComments` can be stale. Refresh once on
        // mount so newly posted comments from other visitors show up.
        let cancelled = false;

        mcqService
            .getQuestionComments(slug)
            .then((response) => {
                if (!cancelled && response?.data) {
                    setComments(response.data);
                }
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !comment.trim()) {
            toast.error('Please enter your name and a comment.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await mcqService.addQuestionComment(slug, {
                name: name.trim(),
                comment: comment.trim(),
            });
            if (response?.data) {
                setComments((prev) => [response.data, ...prev]);
            }
            setName('');
            setComment('');
            toast.success('Comment posted!');
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-8 bg-white rounded-lg border border-border p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                Comments ({comments.length})
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
                <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={255}
                    aria-label="Your name"
                />
                <Textarea
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={2000}
                    className="min-h-[90px]"
                    aria-label="Your comment"
                />
                <Button
                    type="submit"
                    disabled={submitting}
                    className="self-start bg-green-600 hover:bg-green-700 text-white"
                >
                    {submitting ? 'Posting...' : 'Post Comment'}
                </Button>
            </form>

            <div className="flex flex-col gap-4">
                {comments.length === 0 && (
                    <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                )}
                {comments.map((c) => (
                    <div key={c.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                        <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-gray-900 text-sm">{c.name}</span>
                            <span className="text-xs text-muted-foreground shrink-0">
                                {new Date(c.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{c.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
