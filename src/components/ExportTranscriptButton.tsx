
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentLang, getLangString } from '@/services/languageService';

interface ExportTranscriptButtonProps {
  transcriptId: string;
  className?: string;
  children?: React.ReactNode;
}

type ExportFormat = 'txt' | 'markdown' | 'json' | 'html';
type ContentType = 'summary' | 'transcript';

const ExportTranscriptButton = ({ transcriptId, className = '', children }: ExportTranscriptButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const currentLang = getCurrentLang();

  const exportContent = async (format: ExportFormat, contentType: ContentType) => {
    setIsExporting(true);
    
    try {
      const response = await supabase.functions.invoke('export-transcript', {
        body: { id: transcriptId, format, contentType },
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data;
      
      if (!data || data.error) {
        throw new Error(data?.error || 'Failed to export content');
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
      console.error('Error exporting content:', error);
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
          {children ? children : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 
                getLangString('exporting', currentLang) : 
                getLangString('export', currentLang)
              }
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Summary</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => exportContent('txt', 'summary')}>
          Text (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportContent('markdown', 'summary')}>
          Markdown (.md)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportContent('json', 'summary')}>
          JSON (.json)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportContent('html', 'summary')}>
          HTML (.html)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Export Full Transcript</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => exportContent('txt', 'transcript')}>
          Text (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportContent('markdown', 'transcript')}>
          Markdown (.md)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportContent('json', 'transcript')}>
          JSON (.json)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportContent('html', 'transcript')}>
          HTML (.html)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportTranscriptButton;
