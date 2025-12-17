'use client';

import {useSelector} from 'react-redux';
import {useParams, useRouter} from 'next/navigation';
import ScoreCard from "@/components/card/ScoreCard";
import {RootState} from "@/redux/Store";
import {Button} from "@/components/ui/button";
import { useEffect, useState } from 'react';
import examService from '@/services/ExamService/ExamService';

type PlayerScore = {
    id: number;
    name: string;
    corrected: number;
};


export default function ScorePage() {
    const router = useRouter();
    const {quizId} = useParams();

    const [players, setPlayers] = useState<PlayerScore[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!quizId) return;

        const fetchScores = async () => {
            try {
                setLoading(true);
                const data = await examService.getScore(Number(quizId));
                setPlayers(data?.data?.players || []);
            } catch (error) {
                console.error(error);
                setPlayers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, [quizId]);

    const sortedPlayers = [...players].sort((a, b) => b.corrected - a.corrected);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-4xl font-bold mb-6">Scores for Quiz #{quizId}</h1>

            {loading ? (
                <p className="text-gray-500">Loading scores...</p>
            ) : sortedPlayers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedPlayers.map((player) => (
                        <ScoreCard
                            key={player.id}
                            name={player.name}
                            corrected={player.corrected}
                        />
                    ))}
                </div>
            ) : (
                <div className={'flex flex-col items-center justify-center gap-4'}>
                    <p className="text-lg text-gray-500">No scores available for this quiz.</p>
                    <Button
                        className={'primary-btn'}
                        onClick={() => router.back()}
                    >
                        Go Back
                    </Button>
                </div>

            )}
        </div>
    );
}
