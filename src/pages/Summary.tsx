import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TranscriptionChat from '@/components/TranscriptionChat';
import { getYouTubeUrl, getVideoSummary } from '@/services/supabaseService';
import { getCurrentLang, getLangString } from '@/services/languageService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  const [summaryData, setSummaryData] = useState<VideoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const currentLang = getCurrentLang();

  useEffect(() => {
    const fetchSummary = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const data = await getVideoSummary(id);
          setSummaryData(data);
        } catch (error) {
          console.error('Error fetching summary:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSummary();
  }, [id]);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em]" role="status">
          <span className="sr-only">{getLangString('loading', currentLang)}</span>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold gradient-text">
                {getLangString('summaryNotFound', currentLang) || 'Summary Not Found'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {getLangString('summaryNotFoundDescription', currentLang) || 'The summary you are looking for does not exist.'}
              </p>
              <Button onClick={handleGoBack} className="mt-4">
                {getLangString('goBackToDashboard', currentLang) || 'Go Back to Dashboard'}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
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
              {getLangString('videoSummary', currentLang)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryData.summary ? (
              <div className="whitespace-pre-wrap">{summaryData.summary}</div>
            ) : (
              <p>{getLangString('noSummaryAvailable', currentLang) || 'No summary available for this video.'}</p>
            )}
          </CardContent>
        </Card>
        <TranscriptionChat
          transcriptionId={summaryData.id}
          transcriptionText={summaryData.summary || ''}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Summary;
