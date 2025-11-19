
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { getCurrentLang, getLangString } from '@/services/languageService';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const currentLang = getCurrentLang();
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0);
  
  useEffect(() => {
    const timings = [0, 2000, 3500, 9000]; // Initial, user message, AI response, reset
    const timer = setTimeout(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, timings[animationStep] || 2000);
    
    return () => clearTimeout(timer);
  }, [animationStep]);
  
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
            <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 border border-border/50">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-border/30">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue animate-pulse"></div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                    {currentLang === 'en-US' ? 'Chat With Transcript' : 
                     currentLang === 'es-ES' ? 'Chat con Transcripción' : 
                     'Chat com Transcrição'}
                  </h3>
                </div>
                
                <div className="space-y-3 min-h-[280px]">
                  {/* AI Initial Message */}
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      AI
                    </div>
                    <div className="bg-muted/50 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                      <p className="text-sm">
                        {currentLang === 'en-US' ? 'Hello! I can answer questions about this transcription. What would you like to know?' :
                         currentLang === 'es-ES' ? '¡Hola! Puedo responder preguntas sobre esta transcripción. ¿Qué te gustaría saber?' :
                         'Olá! Posso responder perguntas sobre esta transcrição. O que você gostaria de saber?'}
                      </p>
                      <span className="text-xs text-muted-foreground mt-1 block">11:23 PM</span>
                    </div>
                  </div>
                  
                  {/* User Message */}
                  {animationStep >= 1 && (
                    <div className="flex gap-3 justify-end animate-fade-in">
                      <div className="bg-gradient-to-r from-brand-purple to-brand-blue rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                        <p className="text-sm text-white">
                          {currentLang === 'en-US' ? 'What is this video about?' :
                           currentLang === 'es-ES' ? '¿De qué trata este video?' :
                           'Sobre o que é este vídeo?'}
                        </p>
                        <span className="text-xs text-white/80 mt-1 block">11:23 PM</span>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Response */}
                  {animationStep >= 2 && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        AI
                      </div>
                      <div className="bg-muted/50 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                        <p className="text-sm">
                          {currentLang === 'en-US' ? 'This video is about how to get anything you want in life by understanding how your brain works and structuring it in three ways to align your energy, focus, and motivation. The speaker shares his personal experience of transforming himself from someone who barely passed high school and was broke to someone with a six-pack and a nine-figure net worth, and being married to a pretty lady.' :
                           currentLang === 'es-ES' ? 'Este video trata sobre cómo conseguir cualquier cosa que quieras en la vida entendiendo cómo funciona tu cerebro y estructurándolo de tres maneras para alinear tu energía, enfoque y motivación. El orador comparte su experiencia personal de transformarse de alguien que apenas pasó la escuela secundaria y estaba en bancarrota a alguien con un six-pack y un patrimonio neto de nueve cifras, y estar casado con una mujer bonita.' :
                           'Este vídeo é sobre como conseguir qualquer coisa que você queira na vida entendendo como seu cérebro funciona e estruturando-o de três maneiras para alinhar sua energia, foco e motivação. O palestrante compartilha sua experiência pessoal de se transformar de alguém que mal passou no ensino médio e estava falido para alguém com um tanquinho e um patrimônio líquido de nove dígitos, e casado com uma mulher bonita.'}
                        </p>
                        <span className="text-xs text-muted-foreground mt-1 block">11:23 PM</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                  <input 
                    type="text" 
                    placeholder={currentLang === 'en-US' ? 'Ask a question about the transcription...' :
                                 currentLang === 'es-ES' ? 'Haz una pregunta sobre la transcripción...' :
                                 'Faça uma pergunta sobre a transcrição...'}
                    className="flex-1 px-4 py-2 text-sm bg-muted/30 rounded-full border border-border/50 focus:outline-none focus:border-brand-purple/50 transition-colors"
                    disabled
                  />
                  <button className="p-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
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
