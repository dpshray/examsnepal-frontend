'use client';

import {useSelector} from 'react-redux';
import {useParams, useRouter} from 'next/navigation';
import ScoreCard from "@/components/card/ScoreCard";
import {RootState} from "@/redux/Store";
import {Button} from "@/components/ui/button";


export default function ScorePage() {
    const router = useRouter();
    const {quizId} = useParams();
    const players: any = useSelector((state: RootState) => state.players.players || []);

    const sortedPlayers = [...players].sort(
        (a, b) => (b.solutions?.corrected ?? 0) - (a.solutions?.corrected ?? 0)
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-4xl font-bold mb-6">Scores for Quiz #{quizId}</h1>

            {sortedPlayers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedPlayers.map((player, index) => (
                        <ScoreCard
                            key={index}
                            name={player.name ?? 'Unknown'}
                            corrected={player.solutions?.corrected ?? 0}
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
