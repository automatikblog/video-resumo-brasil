
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentLang, getLangString } from '@/services/languageService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Pricing = () => {
  const currentLang = getCurrentLang();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const commonFeatures = [
    currentLang === 'en-US' ? "Transcribe any YouTube video" : 
    currentLang === 'es-ES' ? "Transcribir cualquier video de YouTube" : 
    "Transcrever qualquer vídeo do YouTube",
    
    currentLang === 'en-US' ? "Automatic AI summary" : 
    currentLang === 'es-ES' ? "Resumen automático con IA" : 
    "Resumo automático com IA",
    
    currentLang === 'en-US' ? "Full transcript viewer" : 
    currentLang === 'es-ES' ? "Visor de transcripción completa" : 
    "Visualizador de transcrição completa",
    
    currentLang === 'en-US' ? '"Chat with the video" — ask AI questions based on the transcript' : 
    currentLang === 'es-ES' ? '"Chat con el video" — haz preguntas a la IA basadas en la transcripción' : 
    '"Chat com o vídeo" — faça perguntas à IA baseadas na transcrição',
    
    currentLang === 'en-US' ? "Export Summary (TXT, Markdown, JSON, HTML)" : 
    currentLang === 'es-ES' ? "Exportar Resumen (TXT, Markdown, JSON, HTML)" : 
    "Exportar Resumo (TXT, Markdown, JSON, HTML)",
    
    currentLang === 'en-US' ? "Export Full Transcript (TXT, Markdown, JSON, HTML)" : 
    currentLang === 'es-ES' ? "Exportar Transcripción Completa (TXT, Markdown, JSON, HTML)" : 
    "Exportar Transcrição Completa (TXT, Markdown, JSON, HTML)",
    
    currentLang === 'en-US' ? "Store & access all past transcriptions in your dashboard" : 
    currentLang === 'es-ES' ? "Almacena y accede a todas tus transcripciones pasadas en tu panel" : 
    "Armazene e acesse todas as transcrições passadas no seu painel",
    
    currentLang === 'en-US' ? "Clean, simple interface for fast learning" : 
    currentLang === 'es-ES' ? "Interfaz limpia y simple para aprendizaje rápido" : 
    "Interface limpa e simples para aprendizado rápido"
  ];

  const creditPackages = [
    {
      name: currentLang === 'en-US' ? "Student Plan" : 
            currentLang === 'es-ES' ? "Plan Estudiante" : 
            "Plano Estudante",
      videos: 10,
      price: "$9",
      pricePerMonth: currentLang === 'en-US' ? "/ month" : 
                     currentLang === 'es-ES' ? "/ mes" : 
                     "/ mês",
      description: currentLang === 'en-US' ? "Perfect for students and casual learners" : 
                   currentLang === 'es-ES' ? "Perfecto para estudiantes y aprendices ocasionales" : 
                   "Perfeito para estudantes e aprendizes casuais",
      features: commonFeatures,
      popular: false,
      buttonText: currentLang === 'en-US' ? "Get Started" : 
                  currentLang === 'es-ES' ? "Comenzar" : 
                  "Começar",
      badge: currentLang === 'en-US' ? "Great for beginners" : 
             currentLang === 'es-ES' ? "Genial para principiantes" : 
             "Ótimo para iniciantes"
    },
    {
      name: currentLang === 'en-US' ? "Pro Plan" : 
            currentLang === 'es-ES' ? "Plan Pro" : 
            "Plano Pro",
      videos: 40,
      price: "$19",
      pricePerMonth: currentLang === 'en-US' ? "/ month" : 
                     currentLang === 'es-ES' ? "/ mes" : 
                     "/ mês",
      description: currentLang === 'en-US' ? "Best value for content creators & researchers" : 
                   currentLang === 'es-ES' ? "Mejor valor para creadores de contenido e investigadores" : 
                   "Melhor valor para criadores de conteúdo e pesquisadores",
      features: commonFeatures,
      popular: true,
      buttonText: currentLang === 'en-US' ? "Choose Pro" : 
                  currentLang === 'es-ES' ? "Elegir Pro" : 
                  "Escolher Pro",
      badge: currentLang === 'en-US' ? "BEST VALUE" : 
             currentLang === 'es-ES' ? "MEJOR VALOR" : 
             "MELHOR VALOR"
    },
    {
      name: currentLang === 'en-US' ? "Master Plan" : 
            currentLang === 'es-ES' ? "Plan Master" : 
            "Plano Master",
      videos: 150,
      price: "$39",
      pricePerMonth: currentLang === 'en-US' ? "/ month" : 
                     currentLang === 'es-ES' ? "/ mes" : 
                     "/ mês",
      description: currentLang === 'en-US' ? "For teams, agencies & power users" : 
                   currentLang === 'es-ES' ? "Para equipos, agencias y usuarios avanzados" : 
                   "Para equipes, agências e usuários avançados",
      features: commonFeatures,
      popular: false,
      buttonText: currentLang === 'en-US' ? "Go Master" : 
                  currentLang === 'es-ES' ? "Ir Master" : 
                  "Ir Master",
      badge: currentLang === 'en-US' ? "Maximum value" : 
             currentLang === 'es-ES' ? "Valor máximo" : 
             "Valor máximo"
    }
  ];

  const handlePurchaseClick = (packageName: string) => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/dashboard#credits');
    }
  };

  return (
    <section id="precos" className="section-padding bg-gradient-to-b from-white to-accent/20">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">
              {currentLang === 'en-US' ? 'Simple, Transparent Pricing' : 
               currentLang === 'es-ES' ? 'Precios Simples y Transparentes' : 
               'Preços Simples e Transparentes'}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {currentLang === 'en-US' ? 'All plans include the same features. Choose based on how many videos you need per month.' : 
             currentLang === 'es-ES' ? 'Todos los planes incluyen las mismas funciones. Elige según cuántos videos necesites por mes.' : 
             'Todos os planos incluem os mesmos recursos. Escolha com base em quantos vídeos você precisa por mês.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creditPackages.map((pkg, index) => (
            <Card 
              key={index} 
              className={`border ${pkg.popular ? 'border-red-500 shadow-xl relative scale-105 z-10' : 'border-border/50'} transition-all hover:shadow-lg`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-red-500 hover:bg-red-600 px-4 py-2 text-sm text-white font-bold">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-bold text-brand-purple">{pkg.price}</span>
                    <span className="text-lg text-muted-foreground">{pkg.pricePerMonth}</span>
                  </div>
                  <div className="text-xl font-semibold text-foreground">
                    {currentLang === 'en-US' ? `Up to ${pkg.videos} videos per month` : 
                     currentLang === 'es-ES' ? `Hasta ${pkg.videos} videos por mes` : 
                     `Até ${pkg.videos} vídeos por mês`}
                  </div>
                </div>
                
                <CardDescription className="mt-3 text-base">{pkg.description}</CardDescription>
                
                {!pkg.popular && (
                  <Badge variant="outline" className="mt-2 w-fit mx-auto text-xs">{pkg.badge}</Badge>
                )}
              </CardHeader>
              
              <CardContent className="pt-2">
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-2">
                <Button 
                  className={`w-full text-white font-semibold py-3 ${pkg.popular 
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg' 
                    : pkg.name === 'Enterprise' 
                      ? 'bg-purple-500 hover:bg-purple-600'
                      : 'bg-gray-700 hover:bg-gray-800'}`}
                  onClick={() => handlePurchaseClick(pkg.name)}
                >
                  {pkg.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="font-bold text-lg mb-2">
              {currentLang === 'en-US' ? '💡 All plans include the same features!' : 
               currentLang === 'es-ES' ? '💡 ¡Todos los planes incluyen las mismas funciones!' : 
               '💡 Todos os planos incluem os mesmos recursos!'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {currentLang === 'en-US' ? 'The only difference is the number of videos you can transcribe per month. Try our free tool above first!' : 
               currentLang === 'es-ES' ? 'La única diferencia es el número de videos que puedes transcribir por mes. ¡Prueba nuestra herramienta gratuita arriba primero!' : 
               'A única diferença é o número de vídeos que você pode transcrever por mês. Experimente nossa ferramenta gratuita acima primeiro!'}
            </p>
            <Button 
              onClick={() => document.getElementById('ferramenta')?.scrollIntoView({ behavior: 'smooth' })}
              className="mb-4"
            >
              {currentLang === 'en-US' ? 'Try Free Tool' : 
               currentLang === 'es-ES' ? 'Probar Herramienta Gratuita' : 
               'Experimentar Ferramenta Gratuita'}
            </Button>
            <div className="text-sm text-muted-foreground">
              {currentLang === 'en-US' ? '✅ Monthly subscription  ✅ Secure payment via Stripe  ✅ Cancel anytime' : 
               currentLang === 'es-ES' ? '✅ Suscripción mensual  ✅ Pago seguro vía Stripe  ✅ Cancela en cualquier momento' : 
               '✅ Assinatura mensal  ✅ Pagamento seguro via Stripe  ✅ Cancele a qualquer momento'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
