
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getUserSummaries } from '@/services/supabaseService';
import { getCurrentLang, getLangString } from '@/services/languageService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

interface VideoSummary {
  id: string;
  youtube_url: string;
  video_id?: string;
  summary?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [summaries, setSummaries] = useState<VideoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold gradient-text">
              {getLangString('yourSummaries', currentLang)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{getLangString('noSummariesYet', currentLang)}</p>
                <Button 
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-opacity"
                >
                  {getLangString('createYourFirst', currentLang)}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{getLangString('videoTitle', currentLang)}</TableHead>
                      <TableHead>{getLangString('createdAt', currentLang)}</TableHead>
                      <TableHead>{getLangString('status', currentLang)}</TableHead>
                      <TableHead className="text-right">{getLangString('actions', currentLang) || 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaries.map((summary) => (
                      <TableRow key={summary.id}>
                        <TableCell>
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
                              >
                                {summary.youtube_url}
                              </a>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(summary.created_at)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(summary.status)}`}>
                            {getStatusLabel(summary.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewSummary(summary.id)}
                            disabled={summary.status !== 'completed'}
                          >
                            {getLangString('viewSummary', currentLang)}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
