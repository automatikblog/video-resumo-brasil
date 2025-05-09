
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const useCases = [
  {
    title: 'Estudantes',
    description: 'Economize tempo nos estudos resumindo vídeo-aulas e palestras, potencializando seu aprendizado.',
    icon: (
      <svg className="w-20 h-20 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
      </svg>
    ),
    examples: [
      'Resumos de vídeo-aulas',
      'Preparação para exames',
      'Pesquisa acadêmica'
    ]
  },
  {
    title: 'Profissionais',
    description: 'Mantenha-se atualizado em sua área, resumindo webinars, conferências e treinamentos profissionais.',
    icon: (
      <svg className="w-20 h-20 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    examples: [
      'Análise de webinars',
      'Conferências do setor',
      'Treinamentos corporativos'
    ]
  },
  {
    title: 'Criadores de Conteúdo',
    description: 'Analise vídeos concorrentes, extraia ideias e mantenha-se informado sobre tendências do mercado.',
    icon: (
      <svg className="w-20 h-20 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    examples: [
      'Pesquisa de tendências',
      'Análise de concorrentes',
      'Desenvolvimento de conteúdo'
    ]
  }
];

const UseCases = () => {
  return (
    <section id="casos" className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Casos de Uso</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubra como diferentes públicos estão economizando tempo com nossa ferramenta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Card key={index} className="border border-border/50 overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="bg-accent/20 p-8 flex items-center justify-center">
                  {useCase.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-6">{useCase.description}</p>
                  
                  <h4 className="font-semibold text-lg mb-3">Ideal para:</h4>
                  <ul className="space-y-2">
                    {useCase.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-brand-purple" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
