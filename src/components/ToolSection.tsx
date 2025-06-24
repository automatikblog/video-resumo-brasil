
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { saveYouTubeUrl, pollForVideoSummary, getVideoSummary } from '@/services/supabaseService';
import { getFingerprint, checkAnonymousUserLimit, incrementAnonymousUsage } from '@/services/fingerprintService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentLang, getLangString } from '@/services/languageService';
import { isPlaylistUrl, isShortsUrl } from '@/utils/youtubeUtils';
import YoutubeUrlForm from './tool-section/YoutubeUrlForm';
import ProcessingIndicator from './tool-section/ProcessingIndicator';
import UsageLimitNotice from './tool-section/UsageLimitNotice';
import ErrorDisplay from './tool-section/ErrorDisplay';
import SummaryDisplay from './tool-section/SummaryDisplay';
import TranscriptionChat from './TranscriptionChat';

const ToolSection = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [canUse, setCanUse] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentLang = getCurrentLang();

  useEffect(() => {
    const initFingerprint = async () => {
      try {
        const fp = await getFingerprint();
        setFingerprint(fp);
        
        // Only check usage limit for non-authenticated users (limit of 1 for anonymous)
        if (!user) {
          const hasRemainingUses = await checkAnonymousUserLimit(fp, 1);
          setCanUse(hasRemainingUses);
          
          if (!hasRemainingUses) {
            toast.info(getLangString('usageLimitReached', currentLang));
          }
        }
      } catch (err) {
        console.error('Error initializing fingerprint:', err);
      }
    };

    initFingerprint();
  }, [user, currentLang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error(getLangString('enterYouTubeUrl', currentLang));
      return;
    }
    
    if (!isValidYouTubeUrl(url)) {
      toast.error(getLangString('enterValidYouTubeUrl', currentLang));
      return;
    }

    // Check if it's a playlist and user is not authenticated
    if (!user && isPlaylistUrl(url)) {
      toast.error('Playlists are only available for registered users. Please sign up to process playlists.');
      return;
    }

    // If anonymous user has reached the limit, prompt to sign up
    if (!user && !canUse) {
      toast.error(getLangString('usageLimitReached', currentLang));
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);
    setTranscript(null);
    setCurrentVideoId(null);

    try {
      // Automatically detect if the URL is a playlist
      const isPlaylist = isPlaylistUrl(url);
      const isShorts = isShortsUrl(url);
      
      // Save the URL to Supabase with correct arguments
      const record = await saveYouTubeUrl(url, user?.id || null, fingerprint, isPlaylist);
      
      // Increment anonymous usage after successful submission
      if (!user && fingerprint) {
        await incrementAnonymousUsage(fingerprint);
        setCanUse(false); // Disable further usage for anonymous users
      }
      
      // Show appropriate message based on content type
      if (isPlaylist) {
        toast.success(getLangString('videoSubmitted', currentLang));
        toast.info(getLangString('playlistProcessing', currentLang) || 'Processing playlist. This may take longer than a single video...');
      } else if (isShorts) {
        toast.success('YouTube Shorts submitted successfully!');
        toast.info('Processing Shorts video...');
      } else {
        toast.success(getLangString('videoSubmitted', currentLang));
      }
      
      // Poll for the summary
      const summaryResult = await pollForVideoSummary(record.id);
      
      if (summaryResult?.summary) {
        setSummary(summaryResult.summary);
        setTranscript(summaryResult.transcript || null);
        setCurrentVideoId(record.id);
        
        toast.success(getLangString('summaryGeneratedSuccess', currentLang));
        
        // For authenticated users, navigate to summary page
        if (user) {
          navigate(`/summary/${record.id}`);
        }
      } else {
        setError(getLangString('summaryGenerationFailed', currentLang));
        toast.error(getLangString('summaryGenerationError', currentLang));
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(getLangString('summaryGenerationFailed', currentLang));
      toast.error(getLangString('summaryGenerationError', currentLang));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate YouTube URL
  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  };

  return (
    <section id="ferramenta" className="section-padding bg-gradient-to-b from-accent/20 to-white">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {getLangString('tryItNow', currentLang)} <span className="gradient-text">{getLangString('rightNow', currentLang)}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {getLangString('pasteAnyYouTubeLink', currentLang)}
          </p>
          {!user && (
            <p className="text-sm text-amber-600 mt-2">
              Free trial: 1 video transcription without account (no playlists)
            </p>
          )}
        </div>

        <Card className="shadow-lg border-border/50 max-w-3xl mx-auto">
          <CardContent className="p-6">
            <YoutubeUrlForm
              url={url}
              setUrl={setUrl}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              canUse={canUse}
              isAuthenticated={!!user}
            />

            <UsageLimitNotice isAuthenticated={!!user} canUse={canUse} />
            <ProcessingIndicator isLoading={isLoading} url={url} />
            <ErrorDisplay error={error} />
            <SummaryDisplay summary={summary} isLoading={isLoading} />
            
            {/* Show transcript and chat for anonymous users too */}
            {transcript && currentVideoId && (
              <div className="mt-8 space-y-6">
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Full Transcript</h3>
                    <div className="max-h-96 overflow-y-auto bg-muted/20 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {transcript}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <TranscriptionChat 
                  transcriptionId={currentVideoId} 
                  transcriptionText={transcript} 
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ToolSection;
