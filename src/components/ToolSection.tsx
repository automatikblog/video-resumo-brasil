
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { saveYouTubeUrl, pollForVideoSummary } from '@/services/supabaseService';
import { getFingerprint, checkAnonymousUserLimit } from '@/services/fingerprintService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentLang, getLangString } from '@/services/languageService';

const ToolSection = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [canUse, setCanUse] = useState<boolean>(true);
  const [isPlaylist, setIsPlaylist] = useState(false);
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

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  };

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

  const handleSignIn = () => {
    navigate('/auth');
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="playlist-mode"
                  checked={isPlaylist}
                  onCheckedChange={setIsPlaylist}
                  disabled={isLoading || (!user && !canUse)}
                />
                <Label htmlFor="playlist-mode">
                  {getLangString('isPlaylist', currentLang)}
                </Label>
              </div>
            </form>

            {!user && !canUse && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                <p className="mb-2">{getLangString('usageLimitReachedDetail', currentLang)}</p>
                <Button 
                  variant="outline" 
                  onClick={handleSignIn}
                  className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
                >
                  {getLangString('signUpForMore', currentLang)}
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="mt-8 text-center p-8">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em]" role="status">
                  <span className="sr-only">{getLangString('loading', currentLang)}</span>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                  {isPlaylist 
                    ? getLangString('playlistProcessing', currentLang) 
                    : getLangString('processingYourVideo', currentLang)}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                <p>{error}</p>
              </div>
            )}

            {!isLoading && summary && (
              <div className="mt-8 animate-fade-in">
                <h3 className="text-xl font-semibold mb-4">{getLangString('videoSummary', currentLang)}</h3>
                <div className="bg-muted p-6 rounded-lg">
                  <p className="whitespace-pre-wrap">{summary}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ToolSection;
