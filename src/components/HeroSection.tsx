
import React from 'react';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-accent/20 section-padding pt-24">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter">
              <span>Economize tempo com </span>
              <span className="gradient-text">resumos de vídeos</span>
              <span> do YouTube</span>
            </h1>
            
            <p className="text-xl text-muted-foreground md:text-2xl">
              Obtenha o conteúdo essencial de qualquer vídeo em segundos, sem precisar assistir à versão completa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-opacity text-lg py-6 px-8">
                Experimente agora
              </Button>
              <Button variant="outline" className="text-lg py-6 px-8">
                Saiba mais
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white">JM</div>
                <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white">AC</div>
                <div className="w-8 h-8 rounded-full bg-brand-deepPurple flex items-center justify-center text-white">RF</div>
              </div>
              <span className="text-sm">+3.500 usuários confiam em nós</span>
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
                    <p className="text-lg font-medium">Prévia do YouTube</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -z-10 -top-4 -right-4 -left-4 -bottom-4 bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 rounded-2xl blur-lg"></div>
            
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <div className="bg-white rounded-lg shadow-lg p-4 w-40 animate-bounce-slow">
                <p className="text-xs font-semibold text-center">Resumo gerado em menos de 30 segundos!</p>
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
