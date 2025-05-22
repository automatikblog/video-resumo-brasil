
import React from 'react';
import { getCurrentLang, getLangString } from '@/services/languageService';
import VideoInput from '@/components/VideoInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardTable from './DashboardTable';
import { VideoSummary } from '@/types/videoSummary';
import { Loader2 } from 'lucide-react';

interface DashboardContentProps {
  summaries: VideoSummary[];
  refreshSummaries: () => void;
  isLoading?: boolean;
}

const DashboardContent = ({ summaries, refreshSummaries, isLoading = false }: DashboardContentProps) => {
  const currentLang = getCurrentLang();
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 gradient-text">{getLangString('dashboard', currentLang) || 'Dashboard'}</h1>
      
      {/* Video Input Component */}
      <VideoInput onVideoSubmitted={refreshSummaries} />
      
      <Card className="shadow-lg border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {getLangString('yourSummaries', currentLang)}
          </CardTitle>
          {isLoading && (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span className="text-sm">{getLangString('refreshing', currentLang) || 'Refreshing...'}</span>
            </div>
          )}
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
