
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { getCurrentLang, getLangString } from '@/services/languageService';
import { useNavigate } from 'react-router-dom';
import heroVideoThumbnail from '@/assets/hero-video-thumbnail.jpg';

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Video Section */}
              <div className="relative z-10 bg-white rounded-2xl shadow-xl p-4 border border-border/50">
                <div className="aspect-video bg-muted rounded-xl overflow-hidden relative group cursor-pointer">
                  <img 
                    src={heroVideoThumbnail} 
                    alt="YouTube Video Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2">
                  <h4 className="font-semibold text-sm line-clamp-2">
                    {currentLang === 'en-US' ? '5 Productivity Hacks That Changed My Life' :
                     currentLang === 'es-ES' ? '5 Trucos de Productividad Que Cambiaron Mi Vida' :
                     '5 Truques de Produtividade Que Mudaram Minha Vida'}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">ProductivityPro • 2.4M views</p>
                </div>
                
                {/* Transcript Preview */}
                <div className="mt-3 px-2 pt-3 border-t border-border/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {currentLang === 'en-US' ? 'Transcript' :
                       currentLang === 'es-ES' ? 'Transcripción' :
                       'Transcrição'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {currentLang === 'en-US' ? 
                      '"Hey everyone! Today I\'m sharing the 5 productivity hacks that completely transformed how I work. First up is time blocking - this changed everything for me. Instead of just having a to-do list, I actually schedule specific blocks of time for each task..."' :
                     currentLang === 'es-ES' ? 
                      '"¡Hola a todos! Hoy comparto los 5 trucos de productividad que transformaron completamente cómo trabajo. Primero está el bloqueo de tiempo - esto lo cambió todo para mí. En lugar de solo tener una lista de tareas, programo bloques específicos de tiempo para cada tarea..."' :
                      '"Olá pessoal! Hoje estou compartilhando os 5 truques de produtividade que transformaram completamente como trabalho. Primeiro é o bloqueio de tempo - isso mudou tudo para mim. Em vez de apenas ter uma lista de tarefas, eu agenda blocos específicos de tempo para cada tarefa..."'}
                  </p>
                </div>
              </div>

              {/* Chat Section */}
              <div className="relative z-10 bg-white rounded-2xl shadow-xl p-4 border border-border/50 flex flex-col">
                <div className="flex items-center gap-2 pb-3 border-b border-border/30">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue animate-pulse"></div>
                  <h3 className="text-sm font-semibold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                    {currentLang === 'en-US' ? 'Chat With Transcript' : 
                     currentLang === 'es-ES' ? 'Chat con Transcripción' : 
                     'Chat com Transcrição'}
                  </h3>
                </div>
                
                <div className="flex-1 min-h-[280px] max-h-[280px] overflow-hidden py-3">
                  <div className="space-y-3 h-full flex flex-col">
                    {/* AI Initial Message */}
                    <div className="flex gap-2 animate-fade-in">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        AI
                      </div>
                      <div className="bg-muted/50 rounded-2xl rounded-tl-none px-3 py-2">
                        <p className="text-xs">
                          {currentLang === 'en-US' ? 'Hi! Ask me anything about this video.' :
                           currentLang === 'es-ES' ? '¡Hola! Pregúntame sobre este video.' :
                           'Oi! Me pergunte sobre este vídeo.'}
                        </p>
                        <span className="text-[10px] text-muted-foreground mt-1 block">11:23 PM</span>
                      </div>
                    </div>
                    
                    {/* User Message */}
                    {animationStep >= 1 && (
                      <div className="flex gap-2 justify-end animate-fade-in">
                        <div className="bg-gradient-to-r from-brand-purple to-brand-blue rounded-2xl rounded-tr-none px-3 py-2 max-w-[85%]">
                          <p className="text-xs text-white">
                            {currentLang === 'en-US' ? 'What are the 5 productivity hacks?' :
                             currentLang === 'es-ES' ? '¿Cuáles son los 5 trucos de productividad?' :
                             'Quais são os 5 truques de produtividade?'}
                          </p>
                          <span className="text-[10px] text-white/80 mt-1 block">11:23 PM</span>
                        </div>
                      </div>
                    )}
                    
                    {/* AI Response */}
                    {animationStep >= 2 && (
                      <div className="flex gap-2 animate-fade-in">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          AI
                        </div>
                        <div className="bg-muted/50 rounded-2xl rounded-tl-none px-3 py-2">
                          <p className="text-xs leading-relaxed">
                            {currentLang === 'en-US' ? 'The 5 productivity hacks are: 1) Time blocking - scheduling specific tasks in your calendar, 2) The 2-minute rule - if it takes less than 2 minutes, do it now, 3) Single-tasking instead of multitasking, 4) Morning routines to set the day right, and 5) Regular breaks using the Pomodoro technique.' :
                             currentLang === 'es-ES' ? 'Los 5 trucos son: 1) Bloqueo de tiempo, 2) Regla de 2 minutos - si toma menos de 2 minutos, hazlo ahora, 3) Monotarea en lugar de multitarea, 4) Rutinas matutinas, y 5) Descansos regulares con técnica Pomodoro.' :
                             'Os 5 truques são: 1) Bloqueio de tempo, 2) Regra dos 2 minutos - se leva menos de 2 minutos, faça agora, 3) Monotarefa ao invés de multitarefa, 4) Rotinas matinais, e 5) Pausas regulares com técnica Pomodoro.'}
                          </p>
                          <span className="text-[10px] text-muted-foreground mt-1 block">11:23 PM</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-3 border-t border-border/30 mt-auto">
                  <input 
                    type="text" 
                    placeholder={currentLang === 'en-US' ? 'Ask about the video...' :
                                 currentLang === 'es-ES' ? 'Pregunta sobre el video...' :
                                 'Pergunte sobre o vídeo...'}
                    className="flex-1 px-3 py-1.5 text-xs bg-muted/30 rounded-full border border-border/50 focus:outline-none focus:border-brand-purple/50 transition-colors"
                    disabled
                  />
                  <button className="p-1.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="absolute -z-10 -top-4 -right-4 -left-4 -bottom-4 bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 rounded-2xl blur-lg"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute -top-1/2 left-0 w-full h-full bg-gradient-radial from-brand-purple/10 to-transparent opacity-50 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
