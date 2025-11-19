
import React from 'react';
import { getCurrentLang, getLangString } from '@/services/languageService';

const Features = () => {
  const currentLang = getCurrentLang();
  
  const features = [
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: currentLang === 'en-US' ? 'Accurate Transcriptions' : 
             currentLang === 'es-ES' ? 'Transcripciones Precisas' : 
             'Transcrições Precisas',
      description: currentLang === 'en-US' ? 'Get clean transcripts based on YouTube\'s captions (original or auto-generated). Supports any language available in the video.' : 
                   currentLang === 'es-ES' ? 'Obtén transcripciones limpias basadas en los subtítulos de YouTube (originales o generados automáticamente). Compatible con cualquier idioma disponible en el video.' : 
                   'Obtenha transcrições limpas baseadas nas legendas do YouTube (originais ou geradas automaticamente). Suporta qualquer idioma disponível no vídeo.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: currentLang === 'en-US' ? 'Lightning Fast Processing' : 
             currentLang === 'es-ES' ? 'Procesamiento Ultrarrápido' : 
             'Processamento Ultrarrápido',
      description: currentLang === 'en-US' ? 'Process hours of content in seconds. Our optimized AI pipeline handles videos of any length without compromising quality or speed.' : 
                   currentLang === 'es-ES' ? 'Procesa horas de contenido en segundos. Nuestro pipeline de IA optimizado maneja videos de cualquier duración sin comprometer calidad o velocidad.' : 
                   'Processe horas de conteúdo em segundos. Nosso pipeline de IA otimizado lida com vídeos de qualquer duração sem comprometer qualidade ou velocidade.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: currentLang === 'en-US' ? 'AI-Powered Chat' : 
             currentLang === 'es-ES' ? 'Chat Potenciado por IA' : 
             'Chat com IA',
      description: currentLang === 'en-US' ? 'Ask questions, get summaries, and interact with video content using our intelligent chat assistant. Perfect for research and learning.' : 
                   currentLang === 'es-ES' ? 'Haz preguntas, obtén resúmenes e interactúa con el contenido del video usando nuestro asistente de chat inteligente. Perfecto para investigación y aprendizaje.' : 
                   'Faça perguntas, obtenha resumos e interaja com o conteúdo do vídeo usando nosso assistente de chat inteligente. Perfeito para pesquisa e aprendizado.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      title: currentLang === 'en-US' ? 'Multiple Export Formats' : 
             currentLang === 'es-ES' ? 'Múltiples Formatos de Exportación' : 
             'Múltiplos Formatos de Exportação',
      description: currentLang === 'en-US' ? 'Download transcripts in TXT, Markdown (MD), JSON, or HTML formats. Perfect for documentation, analysis, or integration with other tools.' : 
                   currentLang === 'es-ES' ? 'Descarga transcripciones en formatos TXT, Markdown (MD), JSON o HTML. Perfecto para documentación, análisis o integración con otras herramientas.' : 
                   'Baixe transcrições em formatos TXT, Markdown (MD), JSON ou HTML. Perfeito para documentação, análise ou integração com outras ferramentas.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: currentLang === 'en-US' ? 'Bulk Processing' : 
             currentLang === 'es-ES' ? 'Procesamiento en Lote' : 
             'Processamento em Lote',
      description: currentLang === 'en-US' ? 'Process entire playlists and channels at once. Extract transcripts from hundreds of videos with a single click.' : 
                   currentLang === 'es-ES' ? 'Procesa listas de reproducción y canales completos de una vez. Extrae transcripciones de cientos de videos con un solo clic.' : 
                   'Processe playlists e canais inteiros de uma vez. Extraia transcrições de centenas de vídeos com um único clique.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: currentLang === 'en-US' ? 'No Registration Required' : 
             currentLang === 'es-ES' ? 'Sin Registro Requerido' : 
             'Sem Registro Necessário',
      description: currentLang === 'en-US' ? 'Start using our service immediately without creating an account. Quick, simple, and hassle-free experience for everyone.' : 
                   currentLang === 'es-ES' ? 'Comienza a usar nuestro servicio inmediatamente sin crear una cuenta. Experiencia rápida, simple y sin complicaciones para todos.' : 
                   'Comece a usar nosso serviço imediatamente sem criar uma conta. Experiência rápida, simples e sem complicações para todos.'
    }
  ];

  return (
    <section id="recursos" className="section-padding bg-accent/10">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {currentLang === 'en-US' ? 'Powerful ' : 
             currentLang === 'es-ES' ? 'Características ' : 
             'Recursos '}
            <span className="gradient-text">
              {currentLang === 'en-US' ? 'Features' : 
               currentLang === 'es-ES' ? 'Potentes' : 
               'Poderosos'}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {currentLang === 'en-US' ? 'Everything you need to extract maximum value from YouTube content' : 
             currentLang === 'es-ES' ? 'Todo lo que necesitas para extraer el máximo valor del contenido de YouTube' : 
             'Tudo que você precisa para extrair o máximo valor do conteúdo do YouTube'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:translate-y-[-5px] group"
            >
              <div className="mb-5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 font-medium">
            ✨ {currentLang === 'en-US' ? 'All features included in every plan' : 
                 currentLang === 'es-ES' ? 'Todas las características incluidas en cada plan' : 
                 'Todos os recursos incluídos em todos os planos'}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
