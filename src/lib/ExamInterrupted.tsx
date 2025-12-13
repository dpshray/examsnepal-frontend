'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React from 'react';

interface ExamInterruptedProps {
  message?: string;
  subMessage?: string; 
}

const ExamInterrupted: React.FC<ExamInterruptedProps> = ({
  message = 'Your exam has been completed due to page refresh or interruption.',
  subMessage = 'Refreshing, closing this page, or leaving it automatically ends the exam.',
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">{message}</h2>
      <p className="text-gray-600 mb-6">{subMessage}</p>
      <Button onClick={handleGoBack} variant="green">
        Go Back
      </Button>
    </div>
  );
};

export default ExamInterrupted;
