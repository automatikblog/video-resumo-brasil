
import React from 'react';
import { getCurrentLang, getLangString } from '@/services/languageService';

interface SummaryDisplayProps {
  summary: string | null;
  isLoading: boolean;
}

const SummaryDisplay = ({ summary, isLoading }: SummaryDisplayProps) => {
  const currentLang = getCurrentLang();

  if (isLoading || !summary) return null;

  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">{getLangString('videoSummary', currentLang)}</h3>
      <div className="bg-muted p-6 rounded-lg">
        <p className="whitespace-pre-wrap">{summary}</p>
      </div>
    </div>
  );
};

export default SummaryDisplay;
