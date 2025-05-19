import React from 'react';
import { getCurrentLang, getLangString } from '@/services/languageService';
import VideoInput from '@/components/VideoInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardTable from './DashboardTable';
import { VideoSummary } from '@/types/videoSummary';

interface DashboardContentProps {
  summaries: VideoSummary[];
  refreshSummaries: () => void;
}

const DashboardContent = ({ summaries, refreshSummaries }: DashboardContentProps) => {
  const currentLang = getCurrentLang();
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 gradient-text">{getLangString('dashboard', currentLang) || 'Dashboard'}</h1>
      
      {/* Video Input Component */}
      <VideoInput />
      
      <Card className="shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {getLangString('yourSummaries', currentLang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardTable 
            summaries={summaries} 
            refreshSummaries={refreshSummaries} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
