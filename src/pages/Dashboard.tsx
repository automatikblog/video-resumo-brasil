import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getUserSummaries, resumeVideoProcessing } from '@/services/supabaseService';
import { getCurrentLang, getLangString } from '@/services/languageService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoInput from '@/components/VideoInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface VideoSummary {
  id: string;
  youtube_url: string;
  video_id?: string;
  summary?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  is_playlist?: boolean;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [summaries, setSummaries] = useState<VideoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const currentLang = getCurrentLang();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchSummaries = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const data = await getUserSummaries(user.id);
          setSummaries(data);
        } catch (error) {
          console.error('Error fetching summaries:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchSummaries();
    }

    // Set up auto-refresh every minute
    const refreshInterval = setInterval(() => {
      if (user) fetchSummaries();
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, [user]);

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

  const handleCreateNew = () => {
    navigate('/');
  };

  const handleResumeProcessing = async (id: string, url: string, isPlaylist: boolean = false) => {
    try {
      setProcessingIds(prev => [...prev, id]);
      await resumeVideoProcessing(id, url, isPlaylist);
      toast.success(getLangString('processingResumed', currentLang) || 'Processing resumed');
      
      // Refresh summaries list after a delay to see the updated status
      setTimeout(async () => {
        if (user) {
          const data = await getUserSummaries(user.id);
          setSummaries(data);
        }
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em]" role="status">
          <span className="sr-only">{getLangString('loading', currentLang)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
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
              {summaries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">{getLangString('noSummariesYet', currentLang)}</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
