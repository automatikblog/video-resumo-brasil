import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TranscriptionChat from '@/components/TranscriptionChat';
import { getVideoSummary } from '@/services/supabaseService';
import { getCurrentLang, getLangString } from '@/services/languageService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ExportTranscriptButton from '@/components/ExportTranscriptButton';
import { MessageCircle, ArrowLeft, FileText, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoSummary {
  id: string;
  youtube_url: string;
  video_id?: string;
  summary?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  error_message?: string;
  is_playlist?: boolean; // Add this property to match the server data
}

const Summary = () => {
  const { id } = useParams<{ id: string }>();
  const [summaryData, setSummaryData] = useState<VideoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const currentLang = getCurrentLang();
  const [activeTab, setActiveTab] = useState<string>("summary");

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

  const extractVideoId = (url?: string): string | null => {
    if (!url) return null;
    
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

  const videoId = extractVideoId(summaryData.youtube_url);
  const videoEmbedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="outline" 
          onClick={handleGoBack} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {getLangString('backToDashboard', currentLang) || 'Back to Dashboard'}
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-border/50 mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {summaryData.is_playlist ? 'Playlist' : 'Video'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {videoEmbedUrl && !summaryData.is_playlist ? (
                  <div className="aspect-video mb-4">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={videoEmbedUrl} 
                      title="YouTube video player" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      className="rounded-md"
                    ></iframe>
                  </div>
                ) : (
                  <div className="aspect-video mb-4 bg-muted flex items-center justify-center rounded-md">
                    {summaryData.is_playlist ? (
                      <p className="text-center text-muted-foreground">
                        {getLangString('playlistSummary', currentLang) || 'Playlist Summary'}
                      </p>
                    ) : (
                      <p className="text-center text-muted-foreground">
                        {getLangString('videoPreviewNotAvailable', currentLang) || 'Video preview not available'}
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">{getLangString('source', currentLang) || 'Source'}:</p>
                  <a 
                    href={summaryData.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:underline break-words"
                  >
                    {summaryData.youtube_url}
                  </a>
                </div>
                
                {summaryData.summary && (
                  <div className="mt-6">
                    <ExportTranscriptButton 
                      transcriptId={summaryData.id} 
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" /> {getLangString('exportTranscript', currentLang) || 'Export Transcript'}
                    </ExportTranscriptButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary & Chat Section */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="summary" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" /> {getLangString('summary', currentLang) || 'Summary'}
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" /> {getLangString('chat', currentLang) || 'Chat'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <Card className="shadow-lg border-border/50 mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold gradient-text">
                      {getLangString('videoSummary', currentLang) || 'Summary'}
                    </CardTitle>
                    {summaryData.status !== 'completed' && (
                      <CardDescription>
                        {getStatusMessage(summaryData.status, summaryData.error_message)}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {summaryData?.summary ? (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap">{summaryData.summary}</div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        {getLangString('noSummaryAvailable', currentLang) || 'No summary available for this video.'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chat">
                <Card className="shadow-lg border-border/50">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold gradient-text">
                      {getLangString('chatWithContent', currentLang) || 'Chat with this Content'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {summaryData?.summary ? (
                      <TranscriptionChat
                        transcriptionId={summaryData?.id || ''}
                        transcriptionText={summaryData?.summary || ''}
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {getLangString('chatUnavailable', currentLang) || 'Chat is only available once the summary is generated.'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Helper function to get appropriate status message
function getStatusMessage(status: string, errorMessage?: string): React.ReactNode {
  switch (status) {
    case 'pending':
      return (
        <div className="flex items-center text-yellow-700">
          <div className="h-3 w-3 mr-2 bg-yellow-500 rounded-full animate-pulse"></div>
          Waiting to begin processing...
        </div>
      );
    case 'processing':
      return (
        <div className="flex items-center text-blue-700">
          <div className="h-3 w-3 mr-2 bg-blue-500 rounded-full animate-pulse"></div>
          Processing video content...
        </div>
      );
    case 'failed':
      return (
        <div className="flex items-start text-red-700">
          <div className="h-3 w-3 mt-1 mr-2 bg-red-500 rounded-full"></div>
          <div>
            Processing failed
            {errorMessage && <div className="text-xs mt-1">{errorMessage}</div>}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default Summary;
