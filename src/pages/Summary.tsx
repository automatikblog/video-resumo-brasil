
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getVideoSummary } from '@/services/supabaseService';
import { getCurrentLang, getLangString } from '@/services/languageService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoSummary {
  id: string;
  youtube_url: string;
  video_id?: string;
  summary?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

const Summary = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState<VideoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentLang = getCurrentLang();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getVideoSummary(id);
        setSummary(data);
        
        if (!data) {
          setError(getLangString('summaryNotFound', currentLang) || 'Summary not found');
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
        setError(getLangString('errorFetchingSummary', currentLang) || 'Error fetching summary');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSummary();
    }
  }, [id, user, currentLang]);

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

  const handleBackToDashboard = () => {
    navigate('/dashboard');
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-red-600">{error}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleBackToDashboard}>
                {getLangString('backToDashboard', currentLang) || 'Back to Dashboard'}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const videoId = summary?.youtube_url ? extractVideoId(summary.youtube_url) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={handleBackToDashboard} 
          className="mb-6"
        >
          &larr; {getLangString('backToDashboard', currentLang) || 'Back to Dashboard'}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-border/50 mb-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold gradient-text">
                  {getLangString('videoSummary', currentLang)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summary?.summary ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-base font-sans bg-muted p-6 rounded-lg">
                      {summary.summary}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    {getLangString('noSummaryAvailable', currentLang) || 'No summary available'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-lg border-border/50 mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {getLangString('originalVideo', currentLang) || 'Original Video'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {videoId ? (
                  <div className="rounded-lg overflow-hidden">
                    <AspectRatio ratio={16 / 9}>
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoId}`} 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </AspectRatio>
                  </div>
                ) : (
                  <a 
                    href={summary?.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center py-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    {getLangString('openVideo', currentLang) || 'Open Video'}
                  </a>
                )}

                <div className="mt-4">
                  <a 
                    href={summary?.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {summary?.youtube_url}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Summary;
