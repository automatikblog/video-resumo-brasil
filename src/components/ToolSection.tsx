
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { saveYouTubeUrl, pollForVideoSummary } from '@/services/supabaseService';

const ToolSection = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Por favor, insira uma URL do YouTube');
      return;
    }
    
    if (!isValidYouTubeUrl(url)) {
      toast.error('Por favor, insira uma URL válida do YouTube');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      // Save the URL to Supabase and get the record
      const record = await saveYouTubeUrl(url);
      toast.success('Vídeo enviado para processamento');
      
      // Poll for the summary
      const summaryResult = await pollForVideoSummary(record.id);
      
      if (summaryResult?.summary) {
        setSummary(summaryResult.summary);
        toast.success('Resumo gerado com sucesso!');
      } else {
        setError('Não foi possível gerar o resumo. Por favor, tente novamente.');
        toast.error('Erro ao gerar resumo. Tente novamente.');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Não foi possível gerar o resumo. Por favor, tente novamente.');
      toast.error('Erro ao gerar resumo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ferramenta" className="section-padding bg-gradient-to-b from-accent/20 to-white">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experimente <span className="gradient-text">agora mesmo</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Cole o link de qualquer vídeo do YouTube e receba um resumo inteligente em segundos.
          </p>
        </div>

        <Card className="shadow-lg border-border/50 max-w-3xl mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Cole a URL do YouTube aqui..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full h-12 text-base"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-opacity h-12"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Resumir Vídeo'}
                </Button>
              </div>
            </form>

            {isLoading && (
              <div className="mt-8 text-center p-8">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em]" role="status">
                  <span className="sr-only">Carregando...</span>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                  Processando seu vídeo. Isso pode levar alguns segundos...
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
                <h3 className="text-xl font-semibold mb-4">Resumo do Vídeo</h3>
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
