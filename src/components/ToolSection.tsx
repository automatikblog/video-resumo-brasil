
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { saveYouTubeUrl, pollForVideoSummary } from '@/services/supabaseService';
import { getFingerprint, checkAnonymousUserLimit } from '@/services/fingerprintService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentLang, getLangString } from '@/services/languageService';
import { isPlaylistUrl } from '@/utils/youtubeUtils';
import YoutubeUrlForm from './tool-section/YoutubeUrlForm';
import ProcessingIndicator from './tool-section/ProcessingIndicator';
import UsageLimitNotice from './tool-section/UsageLimitNotice';
import ErrorDisplay from './tool-section/ErrorDisplay';
import SummaryDisplay from './tool-section/SummaryDisplay';

const ToolSection = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
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
        
        // Only check usage limit for non-authenticated users
        if (!user) {
          const hasRemainingUses = await checkAnonymousUserLimit(fp);
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

    // If anonymous user has reached the limit, prompt to sign up
    if (!user && !canUse) {
      toast.error(getLangString('usageLimitReached', currentLang));
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      // Automatically detect if the URL is a playlist
      const isPlaylist = isPlaylistUrl(url);
      
      // Save the URL to Supabase with correct arguments
      const record = await saveYouTubeUrl(url, user?.id || null, fingerprint, isPlaylist);
      
      // Show appropriate message based on content type
      if (isPlaylist) {
        toast.success(getLangString('videoSubmitted', currentLang));
        toast.info(getLangString('playlistProcessing', currentLang) || 'Processing playlist. This may take longer than a single video...');
      } else {
        toast.success(getLangString('videoSubmitted', currentLang));
      }
      
      // Poll for the summary
      const summaryResult = await pollForVideoSummary(record.id);
      
      if (summaryResult?.summary) {
        setSummary(summaryResult.summary);
        toast.success(getLangString('summaryGeneratedSuccess', currentLang));
        // Navigate to the summary page
        navigate(`/summary/${record.id}`);
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
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ToolSection;
