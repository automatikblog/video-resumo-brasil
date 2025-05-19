import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeVideoProcessing } from '@/services/supabaseService';
import { getCurrentLang, getLangString } from '@/services/languageService';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
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

  const extractVideoId = (url: string) => {
    try {
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('v=')) {
        return url.split('v=')[1].split('&')[0];
      }
      return null;
    } catch {
      return null;
    }
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = extractVideoId(url);
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
                  {getThumbnailUrl(summary.youtube_url) && (
                    <img 
                      src={getThumbnailUrl(summary.youtube_url) || ''} 
                      alt={`Thumbnail`} 
                      className="h-12 w-20 object-cover rounded"
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(summary.status)}`}>
                  {getStatusLabel(summary.status)}
                </span>
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
