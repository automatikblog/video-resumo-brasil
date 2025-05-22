
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { saveYouTubeUrl, resumeVideoProcessing } from '@/services/supabaseService';
import { getFingerprint, checkAnonymousUserLimit } from '@/services/fingerprintService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentLang, getLangString } from '@/services/languageService';
import { isValidYouTubeUrl, isPlaylistUrl } from '@/utils/youtubeUtils';

const VideoInput = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [canUse, setCanUse] = useState<boolean>(true);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentLang = getCurrentLang();

  React.useEffect(() => {
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
    setDebugInfo(null);

    try {
      // Automatically detect if the URL is a playlist
      const isPlaylistDetected = isPlaylistUrl(url);
      
      // Debug info
      console.log(`Processing URL: ${url}`, {
        isPlaylist: isPlaylistDetected,
        userId: user?.id || 'anonymous',
        fingerprint: fingerprint || 'unknown'
      });
      
      // Save the URL to Supabase with correct arguments
      const record = await saveYouTubeUrl(url, user?.id || null, fingerprint, isPlaylistDetected);
      
      // Show appropriate message based on content type
      if (isPlaylistDetected) {
        toast.success(getLangString('videoSubmitted', currentLang));
        toast.info(getLangString('playlistProcessing', currentLang) || 'Processing playlist. This may take longer than a single video...');
      } else {
        toast.success(getLangString('videoSubmitted', currentLang));
      }
      
      // Refresh dashboard without navigation
      toast.success(getLangString('summaryGenerating', currentLang) || 'Summary generating in the background. Check back soon!');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      setError(getLangString('summaryGenerationFailed', currentLang));
      setDebugInfo(`Error details: ${errorMessage}`);
      toast.error(getLangString('summaryGenerationError', currentLang));
    } finally {
      setIsLoading(false);
      setUrl('');
    }
  };

  return (
    <Card className="shadow-lg border-border/50 mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={getLangString('pasteYouTubeUrl', currentLang)}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full h-12 text-base"
                disabled={isLoading || (!user && !canUse)}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-opacity h-12"
              disabled={isLoading || (!user && !canUse)}
            >
              {isLoading ? getLangString('processingVideo', currentLang) : getLangString('summarizeVideo', currentLang)}
            </Button>
          </div>
          
          {/* This info box should only be shown during development or when debugging */}
          {process.env.NODE_ENV === 'development' && isPlaylistUrl(url) && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
              <p className="text-sm font-medium">
                {getLangString('playlistDetected', currentLang) || 'Playlist detected!'}
              </p>
            </div>
          )}
        </form>

        {!user && !canUse && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <p className="mb-2">{getLangString('usageLimitReachedDetail', currentLang)}</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
            >
              {getLangString('signUpForMore', currentLang)}
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 text-center p-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em]" role="status">
              <span className="sr-only">{getLangString('loading', currentLang)}</span>
            </div>
            <p className="mt-2 text-muted-foreground">
              {isPlaylistUrl(url) 
                ? getLangString('playlistProcessing', currentLang) 
                : getLangString('processingYourVideo', currentLang)}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p>{error}</p>
            {debugInfo && (
              <div className="mt-2 p-2 bg-red-100 rounded text-sm font-mono overflow-auto">
                {debugInfo}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoInput;
