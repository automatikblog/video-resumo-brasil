
import React from 'react';
import { getCurrentLang, getLangString } from '@/services/languageService';

const HowItWorks = () => {
  const currentLang = getCurrentLang();
  
  const steps = [
    {
      number: '01',
      title: currentLang === 'en-US' ? 'Paste YouTube URL' : 
             currentLang === 'es-ES' ? 'Pegar URL de YouTube' : 
             'Cole a URL do YouTube',
      description: currentLang === 'en-US' ? 'Simply copy and paste any YouTube video URL into our tool. Works with individual videos, playlists, and channel content.' : 
                   currentLang === 'es-ES' ? 'Simplemente copia y pega cualquier URL de video de YouTube en nuestra herramienta. Funciona con videos individuales, listas de reproducción y contenido de canal.' : 
                   'Simplesmente copie e cole qualquer URL de vídeo do YouTube em nossa ferramenta. Funciona com vídeos individuais, playlists e conteúdo de canal.',
      icon: '📋'
    },
    {
      number: '02',
      title: currentLang === 'en-US' ? 'AI Processing' : 
             currentLang === 'es-ES' ? 'Procesamiento con IA' : 
             'Processamento com IA',
      description: currentLang === 'en-US' ? 'Our advanced AI extracts the audio, processes the speech, and generates accurate transcriptions with timestamps and speaker identification.' : 
                   currentLang === 'es-ES' ? 'Nuestra IA avanzada extrae el audio, procesa el habla y genera transcripciones precisas con marcas de tiempo e identificación de hablantes.' : 
                   'Nossa IA avançada extrai o áudio, processa a fala e gera transcrições precisas com timestamps e identificação de falantes.',
      icon: '🤖'
    },
    {
      number: '03',
      title: currentLang === 'en-US' ? 'Get Results Instantly' : 
             currentLang === 'es-ES' ? 'Obtener Resultados Instantáneamente' : 
             'Obtenha Resultados Instantaneamente',
      description: currentLang === 'en-US' ? 'Download transcripts in multiple formats (TXT, Markdown (MD), JSON, HTML), get AI-powered summaries, and chat with the content using our AI assistant.' : 
                   currentLang === 'es-ES' ? 'Descarga transcripciones en múltiples formatos (TXT, Markdown (MD), JSON, HTML), obtén resúmenes con IA y chatea con el contenido usando nuestro asistente de IA.' : 
                   'Baixe transcrições em múltiplos formatos (TXT, Markdown (MD), JSON, HTML), obtenha resumos com IA e converse com o conteúdo usando nosso assistente de IA.',
      icon: '⚡'
    }
  ];

  return (
    <section id="como-funciona" className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">
              {currentLang === 'en-US' ? 'How It Works' : 
               currentLang === 'es-ES' ? 'Cómo Funciona' : 
               'Como Funciona'}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {currentLang === 'en-US' ? 'Transform any YouTube video into searchable, actionable content in three simple steps.' : 
             currentLang === 'es-ES' ? 'Transforma cualquier video de YouTube en contenido buscable y procesable en tres simples pasos.' : 
             'Transforme qualquer vídeo do YouTube em conteúdo pesquisável e acionável em três passos simples.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-6 mx-auto">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground flex-grow">{step.description}</p>
              
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

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-full">
            <span className="text-green-600 font-semibold">
              {currentLang === 'en-US' ? '⏱️ Average processing time: 30 seconds' : 
               currentLang === 'es-ES' ? '⏱️ Tiempo promedio de procesamiento: 30 segundos' : 
               '⏱️ Tempo médio de processamento: 30 segundos'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
