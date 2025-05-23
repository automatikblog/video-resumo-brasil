
import React from 'react';
import { getCurrentLang, getLangString } from '@/services/languageService';
import VideoInput from '@/components/VideoInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardTable from './DashboardTable';
import { VideoSummary } from '@/types/videoSummary';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardContentProps {
  summaries: VideoSummary[];
  refreshSummaries: () => void;
  isLoading?: boolean;
}

const DashboardContent = ({ summaries, refreshSummaries, isLoading = false }: DashboardContentProps) => {
  const currentLang = getCurrentLang();
  
  // Find summaries that are currently processing
  const processingCount = summaries.filter(s => s.status === 'pending' || s.status === 'processing').length;
  const hasProcessingItems = processingCount > 0;
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 gradient-text">{getLangString('dashboard', currentLang) || 'Dashboard'}</h1>
      
      {/* Video Input Component */}
      <VideoInput onVideoSubmitted={refreshSummaries} />
      
      <Card className="shadow-lg border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {getLangString('yourSummaries', currentLang)}
            </CardTitle>
            {hasProcessingItems && (
              <div className="text-sm text-muted-foreground mt-1 flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                {processingCount} {processingCount === 1 ? 'video' : 'videos'} processing
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span className="text-sm">{getLangString('refreshing', currentLang) || 'Refreshing...'}</span>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshSummaries}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {getLangString('refresh', currentLang) || 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DashboardTable summaries={summaries} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
