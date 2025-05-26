
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
  
  const creditPackages = [
    {
      name: "Starter",
      credits: 30,
      price: "$3.99",
      originalPrice: "$5.99",
      description: currentLang === 'en-US' ? "Perfect for students and casual users" : 
                   currentLang === 'es-ES' ? "Perfecto para estudiantes y usuarios ocasionales" : 
                   "Perfeito para estudantes e usuários casuais",
      features: [
        currentLang === 'en-US' ? "30 video transcriptions" : 
        currentLang === 'es-ES' ? "30 transcripciones de video" : 
        "30 transcrições de vídeo",
        
        currentLang === 'en-US' ? "AI-powered summaries" : 
        currentLang === 'es-ES' ? "Resúmenes potenciados por IA" : 
        "Resumos com IA",
        
        currentLang === 'en-US' ? "Chat with transcripts" : 
        currentLang === 'es-ES' ? "Chat con transcripciones" : 
        "Chat com transcrições",
        
        currentLang === 'en-US' ? "Export in 5 formats (TXT, JSON, CSV, SRT, VTT)" : 
        currentLang === 'es-ES' ? "Exportar en 5 formatos (TXT, JSON, CSV, SRT, VTT)" : 
        "Exportar em 5 formatos (TXT, JSON, CSV, SRT, VTT)",
        
        currentLang === 'en-US' ? "Support via email" : 
        currentLang === 'es-ES' ? "Soporte por email" : 
        "Suporte por email"
      ],
      popular: false,
      buttonText: currentLang === 'en-US' ? "Get Started" : 
                  currentLang === 'es-ES' ? "Comenzar" : 
                  "Começar",
      badge: currentLang === 'en-US' ? "Great for beginners" : 
             currentLang === 'es-ES' ? "Genial para principiantes" : 
             "Ótimo para iniciantes",
      savings: "33% OFF"
    },
    {
      name: "Most Popular",
      credits: 100,
      price: "$7.99",
      originalPrice: "$12.99",
      description: currentLang === 'en-US' ? "Best value for content creators & researchers" : 
                   currentLang === 'es-ES' ? "Mejor valor para creadores de contenido e investigadores" : 
                   "Melhor valor para criadores de conteúdo e pesquisadores",
      features: [
        currentLang === 'en-US' ? "100 video transcriptions" : 
        currentLang === 'es-ES' ? "100 transcripciones de video" : 
        "100 transcrições de vídeo",
        
        currentLang === 'en-US' ? "Advanced AI summaries" : 
        currentLang === 'es-ES' ? "Resúmenes avanzados de IA" : 
        "Resumos avançados com IA",
        
        currentLang === 'en-US' ? "Unlimited chat with transcripts" : 
        currentLang === 'es-ES' ? "Chat ilimitado con transcripciones" : 
        "Chat ilimitado com transcrições",
        
        currentLang === 'en-US' ? "Bulk processing (playlists & channels)" : 
        currentLang === 'es-ES' ? "Procesamiento en lote (listas y canales)" : 
        "Processamento em lote (playlists e canais)",
        
        currentLang === 'en-US' ? "Priority processing speed" : 
        currentLang === 'es-ES' ? "Velocidad de procesamiento prioritaria" : 
        "Velocidade de processamento prioritária",
        
        currentLang === 'en-US' ? "All export formats included" : 
        currentLang === 'es-ES' ? "Todos los formatos de exportación incluidos" : 
        "Todos os formatos de exportação incluídos"
      ],
      popular: true,
      buttonText: currentLang === 'en-US' ? "Choose Most Popular" : 
                  currentLang === 'es-ES' ? "Elegir Más Popular" : 
                  "Escolher Mais Popular",
      badge: currentLang === 'en-US' ? "BEST VALUE - Save 38%" : 
             currentLang === 'es-ES' ? "MEJOR VALOR - Ahorra 38%" : 
             "MELHOR VALOR - Economize 38%",
      savings: "38% OFF"
    },
    {
      name: "High Volume",
      credits: 300,
      price: "$19.99",
      originalPrice: "$34.99",
      description: currentLang === 'en-US' ? "For teams, agencies & power users" : 
                   currentLang === 'es-ES' ? "Para equipos, agencias y usuarios avanzados" : 
                   "Para equipes, agências e usuários avançados",
      features: [
        currentLang === 'en-US' ? "300 video transcriptions" : 
        currentLang === 'es-ES' ? "300 transcripciones de video" : 
        "300 transcrições de vídeo",
        
        currentLang === 'en-US' ? "Enterprise-grade AI summaries" : 
        currentLang === 'es-ES' ? "Resúmenes de IA de nivel empresarial" : 
        "Resumos com IA de nível empresarial",
        
        currentLang === 'en-US' ? "Advanced chat & analysis features" : 
        currentLang === 'es-ES' ? "Funciones avanzadas de chat y análisis" : 
        "Recursos avançados de chat e análise",
        
        currentLang === 'en-US' ? "Unlimited bulk processing" : 
        currentLang === 'es-ES' ? "Procesamiento en lote ilimitado" : 
        "Processamento em lote ilimitado",
        
        currentLang === 'en-US' ? "Lightning-fast processing" : 
        currentLang === 'es-ES' ? "Procesamiento ultrarrápido" : 
        "Processamento ultrarrápido",
        
        currentLang === 'en-US' ? "Priority email & Discord support" : 
        currentLang === 'es-ES' ? "Soporte prioritario por email y Discord" : 
        "Suporte prioritário por email e Discord"
      ],
      popular: false,
      buttonText: currentLang === 'en-US' ? "Go Pro" : 
                  currentLang === 'es-ES' ? "Ir Pro" : 
                  "Ir Pro",
      badge: currentLang === 'en-US' ? "Maximum value" : 
             currentLang === 'es-ES' ? "Valor máximo" : 
             "Valor máximo",
      savings: "43% OFF"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-300 rounded-full text-green-700 font-medium mb-4">
            🎉 {currentLang === 'en-US' ? 'Limited Time Offer - Up to 43% OFF' : 
                 currentLang === 'es-ES' ? 'Oferta por Tiempo Limitado - Hasta 43% de DESCUENTO' : 
                 'Oferta por Tempo Limitado - Até 43% de DESCONTO'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">
              {currentLang === 'en-US' ? 'Simple, Transparent Pricing' : 
               currentLang === 'es-ES' ? 'Precios Simples y Transparentes' : 
               'Preços Simples e Transparentes'}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {currentLang === 'en-US' ? 'No subscriptions, no hidden fees. Pay once, use forever. Start with our free tool below!' : 
             currentLang === 'es-ES' ? 'Sin suscripciones, sin tarifas ocultas. Paga una vez, usa para siempre. ¡Comienza con nuestra herramienta gratuita a continuación!' : 
             'Sem assinaturas, sem taxas ocultas. Pague uma vez, use para sempre. Comece com nossa ferramenta gratuita abaixo!'}
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
                  <Badge className="bg-red-500 hover:bg-red-600 px-4 py-2 text-sm text-white font-bold">{pkg.name}</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-bold px-3 py-1">
                    {pkg.savings}
                  </Badge>
                </div>
                
                <CardTitle className="text-2xl mb-2">{pkg.popular ? 'Most Popular' : pkg.name}</CardTitle>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg text-muted-foreground line-through">{pkg.originalPrice}</span>
                    <span className="text-4xl font-bold text-brand-purple">{pkg.price}</span>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {pkg.credits} {currentLang === 'en-US' ? 'Credits' : 
                                   currentLang === 'es-ES' ? 'Créditos' : 
                                   'Créditos'}
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
                    : pkg.name === 'High Volume' 
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
              {currentLang === 'en-US' ? '💡 Not sure which plan to choose?' : 
               currentLang === 'es-ES' ? '💡 ¿No estás seguro de qué plan elegir?' : 
               '💡 Não tem certeza de qual plano escolher?'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {currentLang === 'en-US' ? 'Try our free tool below first! No registration required.' : 
               currentLang === 'es-ES' ? '¡Prueba nuestra herramienta gratuita primero! No se requiere registro.' : 
               'Experimente nossa ferramenta gratuita primeiro! Não é necessário registro.'}
            </p>
            <div className="text-sm text-muted-foreground">
              {currentLang === 'en-US' ? '✅ Credits never expire  ✅ Secure payment via Stripe  ✅ Instant delivery' : 
               currentLang === 'es-ES' ? '✅ Los créditos nunca expiran  ✅ Pago seguro vía Stripe  ✅ Entrega instantánea' : 
               '✅ Créditos nunca expiram  ✅ Pagamento seguro via Stripe  ✅ Entrega instantânea'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
