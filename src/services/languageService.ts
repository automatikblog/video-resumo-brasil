
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
    'pt-BR': 'Cadastre-se para mais resumos',
    'en-US': 'Sign up for more summaries',
    'es-ES': 'Regístrese para más resúmenes'
  },
  signOut: {
    'pt-BR': 'Sair',
    'en-US': 'Sign Out',
    'es-ES': 'Cerrar Sesión'
  },
  continueWithGoogle: {
    'pt-BR': 'Continuar com Google',
    'en-US': 'Continue with Google',
    'es-ES': 'Continuar con Google'
  },
  
  // Tool section
  tryItNow: {
    'pt-BR': 'Experimente',
    'en-US': 'Try it',
    'es-ES': 'Pruébelo'
  },
  rightNow: {
    'pt-BR': 'agora mesmo',
    'en-US': 'right now',
    'es-ES': 'ahora mismo'
  },
  pasteAnyYouTubeLink: {
    'pt-BR': 'Cole o link de qualquer vídeo do YouTube e receba um resumo inteligente em segundos.',
    'en-US': 'Paste any YouTube video link and receive an intelligent summary in seconds.',
    'es-ES': 'Pegue cualquier enlace de video de YouTube y reciba un resumen inteligente en segundos.'
  },
  pasteYouTubeUrl: {
    'pt-BR': 'Cole a URL do YouTube aqui...',
    'en-US': 'Paste YouTube URL here...',
    'es-ES': 'Pegue la URL de YouTube aquí...'
  },
  summarizeVideo: {
    'pt-BR': 'Resumir Vídeo',
    'en-US': 'Summarize Video',
    'es-ES': 'Resumir Video'
  },
  processing: {
    'pt-BR': 'Processando...',
    'en-US': 'Processing...',
    'es-ES': 'Procesando...'
  },
  videoSummary: {
    'pt-BR': 'Resumo do Vídeo',
    'en-US': 'Video Summary',
    'es-ES': 'Resumen del Video'
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
    'pt-BR': 'Você atingiu o limite de resumos gratuitos. Cadastre-se para continuar usando o serviço.',
    'en-US': 'You have reached the limit of free summaries. Sign up to continue using the service.',
    'es-ES': 'Ha alcanzado el límite de resúmenes gratuitos. Regístrese para seguir utilizando el servicio.'
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
    'pt-BR': 'Resumo gerado com sucesso!',
    'en-US': 'Summary generated successfully!',
    'es-ES': '¡Resumen generado con éxito!'
  },
  summaryGenerationFailed: {
    'pt-BR': 'Não foi possível gerar o resumo. Por favor, tente novamente.',
    'en-US': 'Failed to generate summary. Please try again.',
    'es-ES': 'No se pudo generar el resumen. Por favor, inténtelo de nuevo.'
  },
  summaryGenerationError: {
    'pt-BR': 'Erro ao gerar resumo. Tente novamente.',
    'en-US': 'Error generating summary. Try again.',
    'es-ES': 'Error al generar el resumen. Inténtelo de nuevo.'
  },
  
  // Dashboard
  dashboard: {
    'pt-BR': 'Painel',
    'en-US': 'Dashboard',
    'es-ES': 'Panel'
  },
  yourSummaries: {
    'pt-BR': 'Seus Resumos',
    'en-US': 'Your Summaries',
    'es-ES': 'Sus Resúmenes'
  },
  noSummariesYet: {
    'pt-BR': 'Você ainda não tem resumos.',
    'en-US': 'You don\'t have any summaries yet.',
    'es-ES': 'Aún no tiene resúmenes.'
  },
  createYourFirst: {
    'pt-BR': 'Crie seu primeiro resumo',
    'en-US': 'Create your first summary',
    'es-ES': 'Cree su primer resumen'
  },
  viewSummary: {
    'pt-BR': 'Ver Resumo',
    'en-US': 'View Summary',
    'es-ES': 'Ver Resumen'
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
  }
};

// Current language stored in localStorage
let currentLanguage: Language = 'pt-BR';

// Initialize language based on browser or localStorage
export const initializeLanguage = () => {
  const savedLang = localStorage.getItem('appLanguage') as Language;
  if (savedLang && isValidLanguage(savedLang)) {
    currentLanguage = savedLang;
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
