
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentLang, getLangString } from '@/services/languageService';

interface ExportTranscriptButtonProps {
  transcriptId: string;
  className?: string;
}

type ExportFormat = 'txt' | 'markdown' | 'json' | 'html';

const ExportTranscriptButton = ({ transcriptId, className = '' }: ExportTranscriptButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const currentLang = getCurrentLang();

  const exportTranscript = async (format: ExportFormat) => {
    setIsExporting(true);
    
    try {
      const response = await supabase.functions.invoke('export-transcript', {
        body: { id: transcriptId, format },
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data;
      
      if (!data || data.error) {
        throw new Error(data?.error || 'Failed to export transcript');
      }
      
      // Create a download link
      const blob = new Blob([data.content], { type: data.contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: getLangString('exportSuccess', currentLang),
        variant: "default",
      });
    } catch (error) {
      console.error('Error exporting transcript:', error);
      toast({
        title: getLangString('exportFailed', currentLang),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={className}
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 
            getLangString('exportingTranscript', currentLang) : 
            getLangString('exportTranscript', currentLang)
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportTranscript('txt')}>
          Text (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportTranscript('markdown')}>
          Markdown (.md)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportTranscript('json')}>
          JSON (.json)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportTranscript('html')}>
          HTML (.html)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportTranscriptButton;
