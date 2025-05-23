import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeVideoProcessing } from '@/services/supabaseService';
import { getCurrentLang, getLangString } from '@/services/languageService';
import { extractVideoId } from '@/utils/youtubeUtils';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import { toast } from 'sonner';
import { VideoSummary } from '@/types/videoSummary';

interface DashboardTableProps {
  summaries: VideoSummary[];
  refreshSummaries: () => void;
}

const DashboardTable = ({ summaries, refreshSummaries }: DashboardTableProps) => {
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const currentLang = getCurrentLang();

  const getDateLocale = () => {
    switch (currentLang) {
      case 'pt-BR': return ptBR;
      case 'es-ES': return es;
      default: return enUS;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { 
        addSuffix: true,
        locale: getDateLocale()
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return getLangString('pending', currentLang) || 'Pending';
      case 'processing': return getLangString('processing', currentLang) || 'Processing';
      case 'completed': return getLangString('completed', currentLang) || 'Completed';
      case 'failed': return getLangString('failed', currentLang) || 'Failed';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThumbnailUrl = (summary: VideoSummary) => {
    // Try to get video ID from the stored video_id field first
    let videoId = summary.video_id;
    
    // If not available, extract from URL
    if (!videoId) {
      videoId = extractVideoId(summary.youtube_url);
    }
    
    // Return thumbnail URL if we have a video ID
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  const handleViewSummary = (id: string) => {
    navigate(`/summary/${id}`);
  };

  const handleResumeProcessing = async (id: string, url: string, isPlaylist: boolean = false) => {
    try {
      setProcessingIds(prev => [...prev, id]);
      await resumeVideoProcessing(id, url, isPlaylist);
      toast.success(getLangString('processingResumed', currentLang) || 'Processing resumed');
      
      // Refresh summaries list after a delay to see the updated status
      setTimeout(() => {
        refreshSummaries();
        setProcessingIds(prev => prev.filter(itemId => itemId !== id));
      }, 2000);
    } catch (error) {
      console.error('Error resuming processing:', error);
      toast.error(getLangString('resumeError', currentLang) || 'Failed to resume processing');
      setProcessingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const canBeResumed = (status: string) => {
    return status === 'failed' || status === 'pending';
  };

  // Set up auto-refresh for processing videos
  React.useEffect(() => {
    // Check if any videos are processing
    const hasProcessingVideos = summaries.some(
      summary => summary.status === 'processing' || summary.status === 'pending'
    );
    
    if (hasProcessingVideos) {
      // Set up refresh interval while videos are processing
      const intervalId = setInterval(() => {
        console.log('Auto-refreshing summaries due to processing videos');
        refreshSummaries();
      }, 10000); // Check every 10 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [summaries, refreshSummaries]);

  if (summaries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{getLangString('noSummariesYet', currentLang)}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{getLangString('videoTitle', currentLang)}</TableHead>
            <TableHead>{getLangString('createdAt', currentLang)}</TableHead>
            <TableHead>{getLangString('status', currentLang)}</TableHead>
            <TableHead>{getLangString('type', currentLang) || 'Type'}</TableHead>
            <TableHead className="text-right">{getLangString('actions', currentLang) || 'Actions'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaries.map((summary) => (
            <TableRow key={summary.id} className="cursor-pointer hover:bg-muted/70">
              <TableCell onClick={() => summary.status === 'completed' && handleViewSummary(summary.id)}>
                <div className="flex items-center space-x-3">
                  {getThumbnailUrl(summary) && (
                    <img 
                      src={getThumbnailUrl(summary) || ''} 
                      alt={`Thumbnail`} 
                      className="h-12 w-20 object-cover rounded"
                      onError={(e) => {
                        // Hide image if it fails to load (e.g., for playlists)
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="truncate max-w-[300px]">
                    <a 
                      href={summary.youtube_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {summary.youtube_url}
                    </a>
                  </div>
                </div>
              </TableCell>
              <TableCell onClick={() => summary.status === 'completed' && handleViewSummary(summary.id)}>
                {formatDate(summary.created_at)}
              </TableCell>
              <TableCell onClick={() => summary.status === 'completed' && handleViewSummary(summary.id)}>
                <div className="space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(summary.status)}`}>
                    {getStatusLabel(summary.status)}
                  </span>
                  
                  {/* Show progress bar for processing items */}
                  {(summary.status === 'processing' || processingIds.includes(summary.id)) && (
                    <Progress 
                      className="h-1.5 w-full bg-blue-100" 
                      value={70}
                      // We don't know the exact progress, so just animate it
                      style={{animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"}}
                    />
                  )}
                </div>
              </TableCell>
              <TableCell onClick={() => summary.status === 'completed' && handleViewSummary(summary.id)}>
                {summary.is_playlist ? 
                  (getLangString('playlist', currentLang) || 'Playlist') : 
                  (getLangString('video', currentLang) || 'Video')
                }
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewSummary(summary.id)}
                    disabled={summary.status !== 'completed'}
                  >
                    {getLangString('viewSummary', currentLang) || 'View'}
                  </Button>
                  
                  {canBeResumed(summary.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResumeProcessing(summary.id, summary.youtube_url, summary.is_playlist || false)}
                      disabled={processingIds.includes(summary.id)}
                      className="bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800"
                    >
                      {processingIds.includes(summary.id) ? 
                        (getLangString('resuming', currentLang) || 'Resuming...') : 
                        (getLangString('resume', currentLang) || 'Resume')
                      }
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardTable;
