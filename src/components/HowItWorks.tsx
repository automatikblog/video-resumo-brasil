
import React from 'react';
import { getCurrentLang, getLangString } from '@/services/languageService';

const HowItWorks = () => {
  const currentLang = getCurrentLang();
  
  const steps = [
    {
      number: '01',
      title: currentLang === 'en-US' ? 'Paste the link' : 
             currentLang === 'es-ES' ? 'Pegar el enlace' : 
             'Cole o link',
      description: currentLang === 'en-US' ? 'Copy the URL of any YouTube video or playlist and paste it into the input field.' : 
                   currentLang === 'es-ES' ? 'Copie la URL de cualquier video o lista de reproducción de YouTube y péguela en el campo de entrada.' : 
                   'Copie a URL de qualquer vídeo ou playlist do YouTube e cole-a no campo de entrada.'
    },
    {
      number: '02',
      title: currentLang === 'en-US' ? 'Processing' : 
             currentLang === 'es-ES' ? 'Procesamiento' : 
             'Processamento',
      description: currentLang === 'en-US' ? 'Our system analyzes the content of the video, including audio and important visual elements.' : 
                   currentLang === 'es-ES' ? 'Nuestro sistema analiza el contenido del video, incluyendo audio y elementos visuales importantes.' : 
                   'Nosso sistema analisa o conteúdo do vídeo, incluindo áudio e elementos visuais importantes.'
    },
    {
      number: '03',
      title: currentLang === 'en-US' ? 'Transcription generated' : 
             currentLang === 'es-ES' ? 'Transcripción generada' : 
             'Transcrição gerada',
      description: currentLang === 'en-US' ? 'Receive a complete transcription with all the important points of the video in a matter of seconds.' : 
                   currentLang === 'es-ES' ? 'Reciba una transcripción completa con todos los puntos importantes del video en cuestión de segundos.' : 
                   'Receba uma transcrição completa com todos os pontos importantes do vídeo em questão de segundos.'
    }
  ];

  return (
    <section id="como-funciona" className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">{getLangString('howItWorks', currentLang)}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {currentLang === 'en-US' ? 'Our process is simple and efficient so you can save time quickly.' : 
             currentLang === 'es-ES' ? 'Nuestro proceso es simple y eficiente para que pueda ahorrar tiempo rápidamente.' : 
             'Nosso processo é simples e eficiente para que você possa economizar tempo rapidamente.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full -translate-y-1/2 -translate-x-1/2 transform">
                  <svg className="w-8 h-8 text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
