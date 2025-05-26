
import React from 'react';
import { Button } from "@/components/ui/button";
import { getCurrentLang, getLangString } from '@/services/languageService';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const currentLang = getCurrentLang();
  const navigate = useNavigate();
  
  const handleTryNow = () => {
    document.getElementById('ferramenta')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleLearnMore = () => {
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderHeroTitle = () => {
    switch(currentLang) {
      case 'en-US':
        return (
          <>
            <span>Transform YouTube videos into </span>
            <span className="gradient-text">searchable transcripts</span>
            <span> in seconds</span>
          </>
        );
      case 'es-ES':
        return (
          <>
            <span>Transforma videos de YouTube en </span>
            <span className="gradient-text">transcripciones buscables</span>
            <span> en segundos</span>
          </>
        );
      default: // Portuguese
        return (
          <>
            <span>Transforme vídeos do YouTube em </span>
            <span className="gradient-text">transcrições pesquisáveis</span>
            <span> em segundos</span>
          </>
        );
    }
  };

  const renderHeroDescription = () => {
    switch(currentLang) {
      case 'en-US':
        return 'Extract accurate transcripts from any YouTube video, create AI-powered summaries, and chat with the content. Perfect for researchers, students, and content creators.';
      case 'es-ES':
        return 'Extrae transcripciones precisas de cualquier video de YouTube, crea resúmenes con IA y chatea con el contenido. Perfecto para investigadores, estudiantes y creadores de contenido.';
      default: // Portuguese
        return 'Extraia transcrições precisas de qualquer vídeo do YouTube, crie resumos com IA e converse com o conteúdo. Perfeito para pesquisadores, estudantes e criadores de conteúdo.';
    }
  };

  const renderUserCount = () => {
    switch(currentLang) {
      case 'en-US':
        return 'Trusted by 3,500+ users worldwide';
      case 'es-ES':
        return 'Confiado por más de 3,500 usuarios en todo el mundo';
      default: // Portuguese
        return 'Confiado por mais de 3,500 usuários em todo o mundo';
    }
  };

  const renderFeatureBadges = () => {
    const features = {
      'en-US': ['✓ Instant transcripts', '✓ AI summaries', '✓ Multiple export formats'],
      'es-ES': ['✓ Transcripciones instantáneas', '✓ Resúmenes de IA', '✓ Múltiples formatos de exportación'],
      'pt-BR': ['✓ Transcrições instantâneas', '✓ Resumos com IA', '✓ Múltiplos formatos de exportação']
    };

    return features[currentLang] || features['pt-BR'];
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-accent/20 section-padding pt-24">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-full text-sm text-brand-purple font-medium mb-4">
              {currentLang === 'en-US' ? '🚀 No registration required to try' : 
               currentLang === 'es-ES' ? '🚀 No se requiere registro para probar' : 
               '🚀 Não é necessário registro para testar'}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter">
              {renderHeroTitle()}
            </h1>
            
            <p className="text-xl text-muted-foreground md:text-2xl">
              {renderHeroDescription()}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {renderFeatureBadges().map((feature, index) => (
                <span key={index} className="flex items-center gap-1">
                  {feature}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-opacity text-lg py-6 px-8"
                onClick={handleTryNow}
              >
                {currentLang === 'en-US' ? 'Try Free Now' : 
                 currentLang === 'es-ES' ? 'Probar Gratis Ahora' : 
                 'Testar Grátis Agora'}
              </Button>
              <Button 
                variant="outline" 
                className="text-lg py-6 px-8"
                onClick={handleLearnMore}
              >
                {getLangString('learnMore', currentLang)}
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white text-xs">JM</div>
                <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs">AC</div>
                <div className="w-8 h-8 rounded-full bg-brand-deepPurple flex items-center justify-center text-white text-xs">RF</div>
              </div>
              <span className="text-sm">
                {renderUserCount()}
              </span>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="relative z-10 bg-white rounded-2xl shadow-xl p-3 border border-border/50">
              <div className="aspect-video bg-muted rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <svg className="w-20 h-20 mx-auto mb-4 text-brand-purple" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 9.71a8.5 8.5 0 0 0-.91-4.13 2.92 2.92 0 0 0-1.72-1A78.36 78.36 0 0 0 12 4.27a78.45 78.45 0 0 0-8.34.3 2.87 2.87 0 0 0-1.46.74c-.9.83-1 2.25-1.1 3.45a48.29 48.29 0 0 0 0 6.48 9.55 9.55 0 0 0 .3 2 3.14 3.14 0 0 0 .71 1.36 2.86 2.86 0 0 0 1.49.78 45.18 45.18 0 0 0 6.5.33c3.5.05 6.57 0 10.2-.28a2.88 2.88 0 0 0 1.53-.78 2.49 2.49 0 0 0 .61-1 10.58 10.58 0 0 0 .52-3.4c.04-.56.04-3.94.04-4.54ZM9.74 14.85V8.66l5.92 3.11c-1.66.92-3.85 1.96-5.92 3.08Z"/>
                    </svg>
                    <p className="text-lg font-medium">
                      {currentLang === 'en-US' ? 'YouTube Video' : 
                       currentLang === 'es-ES' ? 'Video de YouTube' : 
                       'Vídeo do YouTube'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -z-10 -top-4 -right-4 -left-4 -bottom-4 bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 rounded-2xl blur-lg"></div>
            
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <div className="bg-white rounded-lg shadow-lg p-4 w-40 animate-bounce-slow">
                <p className="text-xs font-semibold text-center">
                  {currentLang === 'en-US' ? 
                    'Complete transcript + AI summary ready!' : 
                    currentLang === 'es-ES' ? 
                      '¡Transcripción completa + resumen de IA listo!' : 
                      'Transcrição completa + resumo IA pronto!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute -top-1/2 left-0 w-full h-full bg-gradient-radial from-brand-purple/10 to-transparent opacity-50 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
