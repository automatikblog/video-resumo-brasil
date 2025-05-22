
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { isValidYouTubeUrl, isPlaylistUrl } from '@/utils/youtubeUtils';
import { getCurrentLang, getLangString } from '@/services/languageService';

interface YoutubeUrlFormProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  canUse: boolean;
  isAuthenticated: boolean;
}

const YoutubeUrlForm = ({
  url,
  setUrl,
  onSubmit,
  isLoading,
  canUse,
  isAuthenticated
}: YoutubeUrlFormProps) => {
  const currentLang = getCurrentLang();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={getLangString('pasteYouTubeUrl', currentLang)}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-12 text-base"
            disabled={isLoading || (!isAuthenticated && !canUse)}
          />
        </div>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-opacity h-12"
          disabled={isLoading || (!isAuthenticated && !canUse)}
        >
          {isLoading ? getLangString('processingVideo', currentLang) : getLangString('summarizeVideo', currentLang)}
        </Button>
      </div>
      
      {/* Only show this in development mode for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
          <p>
            {getLangString('automaticDetection', currentLang) || 'Our system automatically detects video and playlist links.'} 
            {isPlaylistUrl(url) && (
              <span className="font-medium"> {getLangString('playlistDetected', currentLang) || 'Playlist detected!'}</span>
            )}
          </p>
        </div>
      )}
    </form>
  );
};

export default YoutubeUrlForm;
