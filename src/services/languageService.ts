
// Available languages
export type Language = 'pt-BR' | 'en-US' | 'es-ES';

// Translations object
const translations: Record<string, Record<Language, string>> = {
  // Navigation
  home: {
    'pt-BR': 'Início',
    'en-US': 'Home',
    'es-ES': 'Inicio'
  },
  howItWorks: {
    'pt-BR': 'Como Funciona',
    'en-US': 'How It Works',
    'es-ES': 'Cómo Funciona'
  },
  features: {
    'pt-BR': 'Recursos',
    'en-US': 'Features',
    'es-ES': 'Características'
  },
  useCases: {
    'pt-BR': 'Casos de Uso',
    'en-US': 'Use Cases',
    'es-ES': 'Casos de Uso'
  },
  faq: {
    'pt-BR': 'Perguntas',
    'en-US': 'FAQ',
    'es-ES': 'Preguntas'
  },
  pricing: {
    'pt-BR': 'Preços',
    'en-US': 'Pricing',
    'es-ES': 'Precios'
  },
  
  // Auth
  signIn: {
    'pt-BR': 'Entrar',
    'en-US': 'Sign In',
    'es-ES': 'Iniciar Sesión'
  },
  signUp: {
    'pt-BR': 'Cadastre-se',
    'en-US': 'Sign Up',
    'es-ES': 'Registrarse'
  },
  signUpForMore: {
    'pt-BR': 'Cadastre-se para mais transcrições',
    'en-US': 'Sign up for more transcriptions',
    'es-ES': 'Regístrese para más transcripciones'
  },
  signOut: {
    'pt-BR': 'Sair',
    'en-US': 'Sign Out',
    'es-ES': 'Cerrar Sesión'
  },
  signedOut: {
    'pt-BR': 'Desconectado com sucesso',
    'en-US': 'Signed out successfully',
    'es-ES': 'Sesión cerrada con éxito'
  },
  errorSigningOut: {
    'pt-BR': 'Erro ao sair',
    'en-US': 'Error signing out',
    'es-ES': 'Error al cerrar sesión'
  },
  continueWithGoogle: {
    'pt-BR': 'Continuar com Google',
    'en-US': 'Continue with Google',
    'es-ES': 'Continuar con Google'
  },
  
  // Tool section
  tryItNow: {
    'pt-BR': 'Experimente agora',
    'en-US': 'Try it now',
    'es-ES': 'Pruébelo ahora'
  },
  rightNow: {
    'pt-BR': 'agora mesmo',
    'en-US': 'right now',
    'es-ES': 'ahora mismo'
  },
  learnMore: {
    'pt-BR': 'Saiba mais',
    'en-US': 'Learn more',
    'es-ES': 'Más información'
  },
  pasteAnyYouTubeLink: {
    'pt-BR': 'Cole o link de qualquer vídeo ou playlist do YouTube e receba uma transcrição completa em segundos.',
    'en-US': 'Paste any YouTube video or playlist link and receive a complete transcription in seconds.',
    'es-ES': 'Pegue cualquier enlace de video o lista de reproducción de YouTube y reciba una transcripción completa en segundos.'
  },
  pasteYouTubeUrl: {
    'pt-BR': 'Cole a URL do YouTube aqui...',
    'en-US': 'Paste YouTube URL here...',
    'es-ES': 'Pegue la URL de YouTube aquí...'
  },
  summarizeVideo: {
    'pt-BR': 'Transcrever Vídeo',
    'en-US': 'Transcribe Video',
    'es-ES': 'Transcribir Video'
  },
  // Fixed duplicate key
  processingVideo: {
    'pt-BR': 'Processando...',
    'en-US': 'Processing...',
    'es-ES': 'Procesando...'
  },
  videoSummary: {
    'pt-BR': 'Transcrição do Vídeo',
    'en-US': 'Video Transcription',
    'es-ES': 'Transcripción del Video'
  },
  loading: {
    'pt-BR': 'Carregando...',
    'en-US': 'Loading...',
    'es-ES': 'Cargando...'
  },
  processingYourVideo: {
    'pt-BR': 'Processando seu vídeo. Isso pode levar alguns segundos...',
    'en-US': 'Processing your video. This may take a few seconds...',
    'es-ES': 'Procesando su video. Esto puede tomar unos segundos...'
  },

  // Usage limit
  usageLimitReached: {
    'pt-BR': 'Limite de uso atingido',
    'en-US': 'Usage limit reached',
    'es-ES': 'Límite de uso alcanzado'
  },
  usageLimitReachedDetail: {
    'pt-BR': 'Você atingiu o limite de transcrições gratuitas. Cadastre-se para continuar usando o serviço.',
    'en-US': 'You have reached the limit of free transcriptions. Sign up to continue using the service.',
    'es-ES': 'Ha alcanzado el límite de transcripciones gratuitas. Regístrese para seguir utilizando el servicio.'
  },
  
  // Messages
  enterYouTubeUrl: {
    'pt-BR': 'Por favor, insira uma URL do YouTube',
    'en-US': 'Please enter a YouTube URL',
    'es-ES': 'Por favor, introduzca una URL de YouTube'
  },
  enterValidYouTubeUrl: {
    'pt-BR': 'Por favor, insira uma URL válida do YouTube',
    'en-US': 'Please enter a valid YouTube URL',
    'es-ES': 'Por favor, introduzca una URL válida de YouTube'
  },
  videoSubmitted: {
    'pt-BR': 'Vídeo enviado para processamento',
    'en-US': 'Video submitted for processing',
    'es-ES': 'Video enviado para procesamiento'
  },
  summaryGeneratedSuccess: {
    'pt-BR': 'Transcrição gerada com sucesso!',
    'en-US': 'Transcription generated successfully!',
    'es-ES': '¡Transcripción generada con éxito!'
  },
  summaryGenerationFailed: {
    'pt-BR': 'Não foi possível gerar a transcrição. Por favor, tente novamente.',
    'en-US': 'Failed to generate transcription. Please try again.',
    'es-ES': 'No se pudo generar la transcripción. Por favor, inténtelo de nuevo.'
  },
  summaryGenerationError: {
    'pt-BR': 'Erro ao gerar transcrição. Tente novamente.',
    'en-US': 'Error generating transcription. Try again.',
    'es-ES': 'Error al generar la transcripción. Inténtelo de nuevo.'
  },
  
  // Dashboard
  dashboard: {
    'pt-BR': 'Painel',
    'en-US': 'Dashboard',
    'es-ES': 'Panel'
  },
  yourSummaries: {
    'pt-BR': 'Suas Transcrições',
    'en-US': 'Your Transcriptions',
    'es-ES': 'Sus Transcripciones'
  },
  noSummariesYet: {
    'pt-BR': 'Você ainda não tem transcrições.',
    'en-US': 'You don\'t have any transcriptions yet.',
    'es-ES': 'Aún no tiene transcripciones.'
  },
  createYourFirst: {
    'pt-BR': 'Crie sua primeira transcrição',
    'en-US': 'Create your first transcription',
    'es-ES': 'Cree su primera transcripción'
  },
  viewSummary: {
    'pt-BR': 'Ver Transcrição',
    'en-US': 'View Transcription',
    'es-ES': 'Ver Transcripción'
  },
  videoTitle: {
    'pt-BR': 'Título do Vídeo',
    'en-US': 'Video Title',
    'es-ES': 'Título del Video'
  },
  createdAt: {
    'pt-BR': 'Criado em',
    'en-US': 'Created at',
    'es-ES': 'Creado el'
  },
  status: {
    'pt-BR': 'Status',
    'en-US': 'Status',
    'es-ES': 'Estado'
  },
  actions: {
    'pt-BR': 'Ações',
    'en-US': 'Actions',
    'es-ES': 'Acciones'
  },
  account: {
    'pt-BR': 'Conta',
    'en-US': 'Account',
    'es-ES': 'Cuenta'
  },
  pending: {
    'pt-BR': 'Pendente',
    'en-US': 'Pending',
    'es-ES': 'Pendiente'
  },
  // Fixed duplicate key
  processingStatus: {
    'pt-BR': 'Processando',
    'en-US': 'Processing',
    'es-ES': 'Procesando'
  },
  completed: {
    'pt-BR': 'Concluído',
    'en-US': 'Completed',
    'es-ES': 'Completado'
  },
  failed: {
    'pt-BR': 'Falhou',
    'en-US': 'Failed',
    'es-ES': 'Fallido'
  },
  
  // New AI Chat Feature
  chatWithTranscription: {
    'pt-BR': 'Converse com a Transcrição',
    'en-US': 'Chat with Transcription',
    'es-ES': 'Chatear con la Transcripción'
  },
  askQuestion: {
    'pt-BR': 'Faça uma pergunta sobre a transcrição...',
    'en-US': 'Ask a question about the transcription...',
    'es-ES': 'Haga una pregunta sobre la transcripción...'
  },
  send: {
    'pt-BR': 'Enviar',
    'en-US': 'Send',
    'es-ES': 'Enviar'
  },
  
  // AI Chat responses
  errorProcessingRequest: {
    'pt-BR': 'Desculpe, tive problemas ao processar sua solicitação. Por favor, tente novamente mais tarde.',
    'en-US': 'Sorry, I had trouble processing your request. Please try again later.',
    'es-ES': 'Lo siento, tuve problemas al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.'
  },
  noTranscriptionText: {
    'pt-BR': 'Não há texto de transcrição disponível para analisar.',
    'en-US': 'There is no transcription text available to analyze.',
    'es-ES': 'No hay texto de transcripción disponible para analizar.'
  },
  
  // New playlist features
  isPlaylist: {
    'pt-BR': 'Isto é uma playlist',
    'en-US': 'This is a playlist',
    'es-ES': 'Esto es una lista de reproducción'
  },
  playlistProcessing: {
    'pt-BR': 'Processando playlist. Isso pode levar mais tempo que um único vídeo...',
    'en-US': 'Processing playlist. This may take longer than a single video...',
    'es-ES': 'Procesando lista de reproducción. Esto puede tomar más tiempo que un solo video...'
  },
  
  // Pricing Plans
  pricingTitle: {
    'pt-BR': 'Planos e Preços',
    'en-US': 'Plans and Pricing',
    'es-ES': 'Planes y Precios'
  },
  pricingSubtitle: {
    'pt-BR': 'Escolha o plano que melhor atende às suas necessidades.',
    'en-US': 'Choose the plan that best suits your needs.',
    'es-ES': 'Elija el plan que mejor se adapte a sus necesidades.'
  },
  monthly: {
    'pt-BR': 'Mensal',
    'en-US': 'Monthly',
    'es-ES': 'Mensual'
  },
  yearly: {
    'pt-BR': 'Anual',
    'en-US': 'Yearly',
    'es-ES': 'Anual'
  },
  discount: {
    'pt-BR': '20% OFF',
    'en-US': '20% OFF',
    'es-ES': '20% DE DESCUENTO'
  },
  mostPopular: {
    'pt-BR': 'Mais popular',
    'en-US': 'Most popular',
    'es-ES': 'Más popular'
  },
  
  // Plan Names
  freePlan: {
    'pt-BR': 'Gratuito',
    'en-US': 'Free',
    'es-ES': 'Gratis'
  },
  proPlan: {
    'pt-BR': 'Pro',
    'en-US': 'Pro',
    'es-ES': 'Pro'
  },
  businessPlan: {
    'pt-BR': 'Empresarial',
    'en-US': 'Business',
    'es-ES': 'Empresarial'
  },
  
  // Plan Prices
  freePrice: {
    'pt-BR': 'R$ 0',
    'en-US': '$0',
    'es-ES': '€0'
  },
  proPrice: {
    'pt-BR': 'R$ 19,90',
    'en-US': '$9.99',
    'es-ES': '€9.99'
  },
  businessPrice: {
    'pt-BR': 'R$ 49,90',
    'en-US': '$24.99',
    'es-ES': '€24.99'
  },
  
  // Plan Descriptions
  freeDesc: {
    'pt-BR': 'Ideal para uso ocasional',
    'en-US': 'Ideal for occasional use',
    'es-ES': 'Ideal para uso ocasional'
  },
  proDesc: {
    'pt-BR': 'Perfeito para uso regular',
    'en-US': 'Perfect for regular use',
    'es-ES': 'Perfecto para uso regular'
  },
  businessDesc: {
    'pt-BR': 'Para equipes e uso intenso',
    'en-US': 'For teams and heavy use',
    'es-ES': 'Para equipos y uso intenso'
  },
  
  // Plan Features
  perMonth: {
    'pt-BR': 'por mês',
    'en-US': 'per month',
    'es-ES': 'por mes'
  },
  forever: {
    'pt-BR': 'para sempre',
    'en-US': 'forever',
    'es-ES': 'para siempre'
  },
  startFree: {
    'pt-BR': 'Começar grátis',
    'en-US': 'Start free',
    'es-ES': 'Comenzar gratis'
  },
  buyNow: {
    'pt-BR': 'Compre agora!',
    'en-US': 'Buy now!',
    'es-ES': '¡Compre ahora!'
  },
  contactUs: {
    'pt-BR': 'Contate-nos',
    'en-US': 'Contact us',
    'es-ES': 'Contáctenos'
  },
  
  // Feature descriptions
  feature3SummariesPerDay: {
    'pt-BR': '3 transcrições por dia',
    'en-US': '3 transcriptions per day',
    'es-ES': '3 transcripciones por día'
  },
  featureVideosUpTo10Min: {
    'pt-BR': 'Vídeos de até 10 minutos',
    'en-US': 'Videos up to 10 minutes',
    'es-ES': 'Videos de hasta 10 minutos'
  },
  featureBasicTranscriptions: {
    'pt-BR': 'Transcrições básicas',
    'en-US': 'Basic transcriptions',
    'es-ES': 'Transcripciones básicas'
  },
  featureEmailSupport: {
    'pt-BR': 'Suporte por email',
    'en-US': 'Email support',
    'es-ES': 'Soporte por correo electrónico'
  },
  feature30SummariesPerDay: {
    'pt-BR': '30 transcrições por dia',
    'en-US': '30 transcriptions per day',
    'es-ES': '30 transcripciones por día'
  },
  featureVideosUpTo1Hour: {
    'pt-BR': 'Vídeos de até 1 hora',
    'en-US': 'Videos up to 1 hour',
    'es-ES': 'Videos de hasta 1 hora'
  },
  featureDetailedTranscriptions: {
    'pt-BR': 'Transcrições detalhadas',
    'en-US': 'Detailed transcriptions',
    'es-ES': 'Transcripciones detalladas'
  },
  featureSaveTranscriptions: {
    'pt-BR': 'Salvamento de transcrições',
    'en-US': 'Save transcriptions',
    'es-ES': 'Guardar transcripciones'
  },
  featurePrioritySupport: {
    'pt-BR': 'Suporte prioritário',
    'en-US': 'Priority support',
    'es-ES': 'Soporte prioritario'
  },
  featureUnlimitedSummaries: {
    'pt-BR': 'Transcrições ilimitadas',
    'en-US': 'Unlimited transcriptions',
    'es-ES': 'Transcripciones ilimitadas'
  },
  featureVideosUpTo3Hours: {
    'pt-BR': 'Vídeos de até 3 horas',
    'en-US': 'Videos up to 3 hours',
    'es-ES': 'Videos de hasta 3 horas'
  },
  featureAdvancedTranscriptions: {
    'pt-BR': 'Transcrições avançadas',
    'en-US': 'Advanced transcriptions',
    'es-ES': 'Transcripciones avanzadas'
  },
  featureUnlimitedLibrary: {
    'pt-BR': 'Biblioteca de transcrições ilimitada',
    'en-US': 'Unlimited transcriptions library',
    'es-ES': 'Biblioteca de transcripciones ilimitada'
  },
  featureAPIIntegration: {
    'pt-BR': 'API de integração',
    'en-US': 'API integration',
    'es-ES': 'Integración de API'
  },
  featureDedicatedSupport: {
    'pt-BR': 'Suporte dedicado 24/7',
    'en-US': 'Dedicated 24/7 support',
    'es-ES': 'Soporte dedicado 24/7'
  },
  featureAIChat: {
    'pt-BR': 'Chat com IA para consulta de transcrições',
    'en-US': 'AI chat for transcription queries',
    'es-ES': 'Chat con IA para consultas de transcripciones'
  },
  featurePlaylistSupport: {
    'pt-BR': 'Suporte a playlists',
    'en-US': 'Playlist support',
    'es-ES': 'Soporte para listas de reproducción'
  },
  noSummaryAvailable: {
    'pt-BR': 'Nenhuma transcrição disponível para este vídeo.',
    'en-US': 'No transcription available for this video.',
    'es-ES': 'No hay transcripción disponible para este video.'
  },
  summaryNotFound: {
    'pt-BR': 'Transcrição Não Encontrada',
    'en-US': 'Transcription Not Found',
    'es-ES': 'Transcripción No Encontrada'
  },
  summaryNotFoundDescription: {
    'pt-BR': 'A transcrição que você está procurando não existe.',
    'en-US': 'The transcription you are looking for does not exist.',
    'es-ES': 'La transcripción que está buscando no existe.'
  },
  goBackToDashboard: {
    'pt-BR': 'Voltar para o Painel',
    'en-US': 'Go Back to Dashboard',
    'es-ES': 'Volver al Panel'
  }
};

// Current language stored in localStorage
let currentLanguage: Language = 'pt-BR';

// Initialize language based on browser or localStorage
export const initializeLanguage = () => {
  const savedLang = localStorage.getItem('appLanguage') as Language;
  if (savedLang && isValidLanguage(savedLang)) {
    currentLanguage = savedLang;
    document.documentElement.lang = savedLang.split('-')[0]; // Set html lang attribute
    return;
  }
  
  // Detect browser language
  const browserLang = navigator.language;
  if (browserLang.startsWith('pt')) {
    currentLanguage = 'pt-BR';
  } else if (browserLang.startsWith('es')) {
    currentLanguage = 'es-ES';
  } else {
    currentLanguage = 'en-US';
  }
  
  localStorage.setItem('appLanguage', currentLanguage);
  document.documentElement.lang = currentLanguage.split('-')[0];
};

// Check if language is valid
const isValidLanguage = (lang: string): lang is Language => {
  return ['pt-BR', 'en-US', 'es-ES'].includes(lang);
};

// Set current language
export const setLanguage = (lang: Language) => {
  if (isValidLanguage(lang)) {
    currentLanguage = lang;
    localStorage.setItem('appLanguage', lang);
    document.documentElement.lang = lang.split('-')[0];
  }
};

// Get current language
export const getCurrentLang = (): Language => {
  if (!currentLanguage) {
    initializeLanguage();
  }
  return currentLanguage;
};

// Get string in current language
export const getLangString = (key: string, lang?: Language): string => {
  const targetLang = lang || getCurrentLang();
  return translations[key]?.[targetLang] || key;
};

// Get all available languages
export const getAvailableLanguages = (): Language[] => {
  return ['pt-BR', 'en-US', 'es-ES'];
};

// Initialize language on app load
initializeLanguage();
