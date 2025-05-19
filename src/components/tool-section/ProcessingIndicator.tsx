
import React from 'react';
import { isPlaylistUrl } from '@/utils/youtubeUtils';
import { getCurrentLang, getLangString } from '@/services/languageService';

interface ProcessingIndicatorProps {
  isLoading: boolean;
  url: string;
}

const ProcessingIndicator = ({ isLoading, url }: ProcessingIndicatorProps) => {
  const currentLang = getCurrentLang();

  if (!isLoading) return null;

  return (
    <div className="mt-8 text-center p-8">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em]" role="status">
        <span className="sr-only">{getLangString('loading', currentLang)}</span>
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        {isPlaylistUrl(url) 
          ? getLangString('playlistProcessing', currentLang) 
          : getLangString('processingYourVideo', currentLang)}
      </p>
    </div>
  );
};

export default ProcessingIndicator;
