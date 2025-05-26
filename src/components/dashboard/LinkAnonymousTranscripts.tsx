
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { linkAnonymousTranscripts } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Link2, Loader2 } from 'lucide-react';
import { getCurrentLang, getLangString } from '@/services/languageService';

interface LinkAnonymousTranscriptsProps {
  onTranscriptsLinked?: () => void;
}

const LinkAnonymousTranscripts = ({ onTranscriptsLinked }: LinkAnonymousTranscriptsProps) => {
  const { user } = useAuth();
  const [isLinking, setIsLinking] = useState(false);
  const currentLang = getCurrentLang();

  const handleLinkTranscripts = async () => {
    if (!user) {
      toast.error('You must be signed in to link transcripts');
      return;
    }

    setIsLinking(true);
    try {
      await linkAnonymousTranscripts(user.id);
      toast.success(
        currentLang === 'en-US' ? 'Anonymous transcripts linked successfully!' :
        currentLang === 'es-ES' ? '¡Transcripciones anónimas vinculadas exitosamente!' :
        'Transcrições anônimas vinculadas com sucesso!'
      );
      
      // Refresh the transcripts list
      if (onTranscriptsLinked) {
        onTranscriptsLinked();
      }
    } catch (error) {
      console.error('Error linking transcripts:', error);
      toast.error(
        currentLang === 'en-US' ? 'Failed to link anonymous transcripts' :
        currentLang === 'es-ES' ? 'Error al vincular transcripciones anónimas' :
        'Falha ao vincular transcrições anônimas'
      );
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          {currentLang === 'en-US' ? 'Link Previous Transcripts' :
           currentLang === 'es-ES' ? 'Vincular Transcripciones Anteriores' :
           'Vincular Transcrições Anteriores'}
        </CardTitle>
        <CardDescription>
          {currentLang === 'en-US' ? 'Did you create transcripts before signing up? Link them to your account now.' :
           currentLang === 'es-ES' ? '¿Creaste transcripciones antes de registrarte? Vincúlalas a tu cuenta ahora.' :
           'Você criou transcrições antes de se registrar? Vincule-as à sua conta agora.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleLinkTranscripts}
          disabled={isLinking}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLinking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {currentLang === 'en-US' ? 'Linking...' :
               currentLang === 'es-ES' ? 'Vinculando...' :
               'Vinculando...'}
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4 mr-2" />
              {currentLang === 'en-US' ? 'Link Transcripts' :
               currentLang === 'es-ES' ? 'Vincular Transcripciones' :
               'Vincular Transcrições'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LinkAnonymousTranscripts;
