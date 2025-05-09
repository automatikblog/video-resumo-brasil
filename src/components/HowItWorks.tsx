
import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Cole o link',
    description: 'Copie a URL de qualquer vídeo do YouTube e cole-a no campo de entrada.'
  },
  {
    number: '02',
    title: 'Processamento',
    description: 'Nosso sistema analisa o conteúdo do vídeo, incluindo áudio e elementos visuais importantes.'
  },
  {
    number: '03',
    title: 'Resumo gerado',
    description: 'Receba um resumo conciso com os pontos principais do vídeo em questão de segundos.'
  }
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como <span className="gradient-text">Funciona</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Nosso processo é simples e eficiente para que você possa economizar tempo rapidamente.
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
