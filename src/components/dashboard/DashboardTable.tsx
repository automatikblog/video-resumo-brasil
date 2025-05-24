
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, Loader2, Hourglass, ExternalLink, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { VideoSummary } from '@/types/videoSummary';
import { getYoutubeVideoId, getYoutubeThumbnailUrl } from '@/utils/youtubeUtils';
import ExportTranscriptButton from '@/components/ExportTranscriptButton';
import { resumeVideoProcessing } from '@/services/supabaseService';

interface DashboardTableProps {
  summaries: VideoSummary[];
}

const DashboardTable: React.FC<DashboardTableProps> = ({ summaries }) => {
  const handleRetryProcessing = async (id: string, url: string, isPlaylist: boolean) => {
    try {
      await resumeVideoProcessing(id, url, isPlaylist);
    } catch (error) {
      console.error('Error retrying video processing:', error);
    }
  };

  // Parse the error message from JSON if available
  const parseErrorMessage = (errorMessage: string | null) => {
    if (!errorMessage) return 'Unknown error';
    
    try {
      const errorObj = JSON.parse(errorMessage);
      return errorObj.message || errorMessage;
    } catch (e) {
      return errorMessage;
    }
  };

  // Enhanced function to get video ID for both regular videos and playlists
  const getVideoIdForThumbnail = (summary: VideoSummary): string | null => {
    // First try to use the stored video_id
    if (summary.video_id) {
      return summary.video_id;
    }
    
    // For playlists, try to extract video ID from URL if it contains one
    if (summary.is_playlist && summary.youtube_url.includes('v=')) {
      const videoId = getYoutubeVideoId(summary.youtube_url);
      if (videoId) {
        return videoId;
      }
    }
    
    // For regular videos, extract from URL
    if (!summary.is_playlist) {
      return getYoutubeVideoId(summary.youtube_url);
    }
    
    return null;
  };

  // Format status badge with improved error tooltip
  const getStatusBadge = (status: VideoSummary['status'], errorMessage: string | null) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-50">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Processing</span>
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        );
      case 'failed':
        const errorText = parseErrorMessage(errorMessage);
        
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1 bg-red-50 cursor-help">
                  <XCircle className="h-3 w-3" />
                  <span>Failed</span>
                  <Info className="h-3 w-3 ml-1" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent 
                className="max-w-sm break-words bg-white p-3 rounded-md border shadow-lg z-50"
                side="top"
                align="center"
              >
                <div className="space-y-2">
                  <p className="font-medium text-sm text-destructive">Error Details:</p>
                  <p className="text-xs leading-relaxed">{errorText}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return (
          <Badge variant="outline">Unknown</Badge>
        );
    }
  };

  if (summaries.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No summaries found. Generate your first one above.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Video</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaries.map((summary) => {
            const videoId = getVideoIdForThumbnail(summary);
            const isPlaylist = summary.is_playlist || false;
            
            return (
              <TableRow key={summary.id}>
                <TableCell className="p-0 pl-4">
                  {videoId ? (
                    <div className="w-[100px] h-[56px] relative rounded-md overflow-hidden">
                      <img 
                        src={getYoutubeThumbnailUrl(videoId)} 
                        alt="Video thumbnail" 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          // Fallback if thumbnail fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {isPlaylist && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Playlist</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-[100px] h-[56px] bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500 text-xs">
                        {isPlaylist ? 'Playlist' : 'No Preview'}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium truncate max-w-[200px]">
                  <a 
                    href={summary.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center"
                  >
                    <span className="truncate block">{summary.youtube_url}</span>
                    <ExternalLink className="ml-1 h-3 w-3 inline" />
                  </a>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {formatDistanceToNow(new Date(summary.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {getStatusBadge(summary.status, summary.error_message)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {summary.status === 'failed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRetryProcessing(
                          summary.id, 
                          summary.youtube_url,
                          summary.is_playlist || false
                        )}
                        className="h-8"
                      >
                        <Hourglass className="h-4 w-4 mr-1" />
                        <span>Retry</span>
                      </Button>
                    )}
                    
                    {summary.status === 'completed' && (
                      <>
                        <ExportTranscriptButton 
                          transcriptId={summary.id}
                          className="h-8"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-8",
                            !summary.summary && "opacity-50 cursor-not-allowed"
                          )}
                          asChild
                          disabled={!summary.summary}
                        >
                          <Link to={`/summary/${summary.id}`}>
                            View
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardTable;
