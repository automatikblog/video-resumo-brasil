
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
  },
  
  // Features Section
  featuresTitle: {
    'pt-BR': 'Nossos',
    'en-US': 'Our',
    'es-ES': 'Nuestras'
  },
  features: {
    'pt-BR': 'Recursos',
    'en-US': 'Features',
    'es-ES': 'Características'
  },
  featuresSubtitle: {
    'pt-BR': 'Descubra os benefícios que tornam nossa ferramenta indispensável para otimizar seu tempo.',
    'en-US': 'Discover the benefits that make our tool indispensable for optimizing your time.',
    'es-ES': 'Descubra los beneficios que hacen que nuestra herramienta sea indispensable para optimizar su tiempo.'
  },
  featureSaveTime: {
    'pt-BR': 'Economize Tempo',
    'en-US': 'Save Time',
    'es-ES': 'Ahorre Tiempo'
  },
  featureSaveTimeDesc: {
    'pt-BR': 'Obtenha o conteúdo essencial de vídeos longos em apenas segundos, sem precisar assistir à versão completa.',
    'en-US': 'Get the essential content of long videos in just seconds, without having to watch the full version.',
    'es-ES': 'Obtenga el contenido esencial de videos largos en solo segundos, sin tener que ver la versión completa.'
  },
  featureFastProcessing: {
    'pt-BR': 'Processamento Rápido',
    'en-US': 'Fast Processing',
    'es-ES': 'Procesamiento Rápido'
  },
  featureFastProcessingDesc: {
    'pt-BR': 'Nossa tecnologia avançada processa vídeos rapidamente, proporcionando resultados quase instantâneos.',
    'en-US': 'Our advanced technology processes videos quickly, providing almost instantaneous results.',
    'es-ES': 'Nuestra tecnología avanzada procesa videos rápidamente, proporcionando resultados casi instantáneos.'
  },
  featureHighAccuracy: {
    'pt-BR': 'Alta Precisão',
    'en-US': 'High Accuracy',
    'es-ES': 'Alta Precisión'
  },
  featureHighAccuracyDesc: {
    'pt-BR': 'Resumos precisos que destacam os pontos-chave e mantêm a essência do conteúdo original.',
    'en-US': 'Accurate summaries that highlight key points and maintain the essence of the original content.',
    'es-ES': 'Resúmenes precisos que destacan los puntos clave y mantienen la esencia del contenido original.'
  },
  featureCloudAccess: {
    'pt-BR': 'Acessível na Nuvem',
    'en-US': 'Cloud Access',
    'es-ES': 'Accesible en la Nube'
  },
  featureCloudAccessDesc: {
    'pt-BR': 'Acesse seus resumos de qualquer lugar e em qualquer dispositivo, sem necessidade de instalação.',
    'en-US': 'Access your summaries from anywhere and on any device, no installation required.',
    'es-ES': 'Acceda a sus resúmenes desde cualquier lugar y en cualquier dispositivo, sin necesidad de instalación.'
  },
  featureLanguageSupport: {
    'pt-BR': 'Suporte a Múltiplos Idiomas',
    'en-US': 'Multiple Language Support',
    'es-ES': 'Soporte para Múltiples Idiomas'
  },
  featureLanguageSupportDesc: {
    'pt-BR': 'Totalmente otimizado para conteúdo em diversos idiomas, capturando nuances e expressões locais.',
    'en-US': 'Fully optimized for content in various languages, capturing nuances and local expressions.',
    'es-ES': 'Totalmente optimizado para contenido en varios idiomas, capturando matices y expresiones locales.'
  },
  featurePrivacy: {
    'pt-BR': 'Privacidade Garantida',
    'en-US': 'Privacy Guaranteed',
    'es-ES': 'Privacidad Garantizada'
  },
  featurePrivacyDesc: {
    'pt-BR': 'Seus dados e histórico de buscas são protegidos e nunca compartilhados com terceiros.',
    'en-US': 'Your data and search history are protected and never shared with third parties.',
    'es-ES': 'Sus datos e historial de búsqueda están protegidos y nunca se comparten con terceros.'
  },
  
  // Use Cases Section
  useCasesTitle: {
    'pt-BR': 'Casos de Uso',
    'en-US': 'Use Cases',
    'es-ES': 'Casos de Uso'
  },
  useCasesSubtitle: {
    'pt-BR': 'Descubra como diferentes públicos estão economizando tempo com nossa ferramenta.',
    'en-US': 'Discover how different audiences are saving time with our tool.',
    'es-ES': 'Descubra cómo diferentes audiencias están ahorrando tiempo con nuestra herramienta.'
  },
  idealFor: {
    'pt-BR': 'Ideal para',
    'en-US': 'Ideal for',
    'es-ES': 'Ideal para'
  },
  useCaseStudents: {
    'pt-BR': 'Estudantes',
    'en-US': 'Students',
    'es-ES': 'Estudiantes'
  },
  useCaseStudentsDesc: {
    'pt-BR': 'Economize tempo nos estudos resumindo vídeo-aulas e palestras, potencializando seu aprendizado.',
    'en-US': 'Save time in your studies by summarizing video lessons and lectures, enhancing your learning.',
    'es-ES': 'Ahorre tiempo en sus estudios resumiendo video lecciones y conferencias, mejorando su aprendizaje.'
  },
  useCaseStudentsExample1: {
    'pt-BR': 'Resumos de vídeo-aulas',
    'en-US': 'Video lesson summaries',
    'es-ES': 'Resúmenes de video lecciones'
  },
  useCaseStudentsExample2: {
    'pt-BR': 'Preparação para exames',
    'en-US': 'Exam preparation',
    'es-ES': 'Preparación para exámenes'
  },
  useCaseStudentsExample3: {
    'pt-BR': 'Pesquisa acadêmica',
    'en-US': 'Academic research',
    'es-ES': 'Investigación académica'
  },
  useCaseProfessionals: {
    'pt-BR': 'Profissionais',
    'en-US': 'Professionals',
    'es-ES': 'Profesionales'
  },
  useCaseProfessionalsDesc: {
    'pt-BR': 'Mantenha-se atualizado em sua área, resumindo webinars, conferências e treinamentos profissionais.',
    'en-US': 'Stay updated in your field by summarizing webinars, conferences, and professional training.',
    'es-ES': 'Manténgase actualizado en su campo resumiendo webinars, conferencias y capacitaciones profesionales.'
  },
  useCaseProfessionalsExample1: {
    'pt-BR': 'Análise de webinars',
    'en-US': 'Webinar analysis',
    'es-ES': 'Análisis de webinars'
  },
  useCaseProfessionalsExample2: {
    'pt-BR': 'Conferências do setor',
    'en-US': 'Industry conferences',
    'es-ES': 'Conferencias de la industria'
  },
  useCaseProfessionalsExample3: {
    'pt-BR': 'Treinamentos corporativos',
    'en-US': 'Corporate training',
    'es-ES': 'Capacitación corporativa'
  },
  useCaseCreators: {
    'pt-BR': 'Criadores de Conteúdo',
    'en-US': 'Content Creators',
    'es-ES': 'Creadores de Contenido'
  },
  useCaseCreatorsDesc: {
    'pt-BR': 'Analise vídeos concorrentes, extraia ideias e mantenha-se informado sobre tendências do mercado.',
    'en-US': 'Analyze competitor videos, extract ideas, and stay informed about market trends.',
    'es-ES': 'Analice videos de la competencia, extraiga ideas y manténgase informado sobre las tendencias del mercado.'
  },
  useCaseCreatorsExample1: {
    'pt-BR': 'Pesquisa de tendências',
    'en-US': 'Trend research',
    'es-ES': 'Investigación de tendencias'
  },
  useCaseCreatorsExample2: {
    'pt-BR': 'Análise de concorrentes',
    'en-US': 'Competitor analysis',
    'es-ES': 'Análisis de competidores'
  },
  useCaseCreatorsExample3: {
    'pt-BR': 'Desenvolvimento de conteúdo',
    'en-US': 'Content development',
    'es-ES': 'Desarrollo de contenido'
  },
  
  // Testimonials Section
  testimonialTitle: {
    'pt-BR': 'O que nossos',
    'en-US': 'What our',
    'es-ES': 'Lo que dicen nuestros'
  },
  testimonialTitleHighlight: {
    'pt-BR': 'usuários dizem',
    'en-US': 'users say',
    'es-ES': 'usuarios'
  },
  testimonialSubtitle: {
    'pt-BR': 'Veja como nossa ferramenta tem ajudado pessoas de diferentes áreas a economizar tempo.',
    'en-US': 'See how our tool has been helping people from different areas save time.',
    'es-ES': 'Vea cómo nuestra herramienta ha estado ayudando a personas de diferentes áreas a ahorrar tiempo.'
  },
  testimonial1Content: {
    'pt-BR': 'Esta ferramenta revolucionou meus estudos! Consigo assimilar o conteúdo de horas de aulas em apenas alguns minutos de leitura.',
    'en-US': 'This tool revolutionized my studies! I can assimilate the content of hours of classes in just a few minutes of reading.',
    'es-ES': '¡Esta herramienta revolucionó mis estudios! Puedo asimilar el contenido de horas de clases en solo unos minutos de lectura.'
  },
  testimonial1Author: {
    'pt-BR': 'Mariana Silva',
    'en-US': 'Mariana Silva',
    'es-ES': 'Mariana Silva'
  },
  testimonial1Title: {
    'pt-BR': 'Estudante de Medicina',
    'en-US': 'Medical Student',
    'es-ES': 'Estudiante de Medicina'
  },
  testimonial2Content: {
    'pt-BR': 'Como profissional ocupado, não tenho tempo para assistir webinars de 2 horas. Com o VideoSumário, consigo extrair os pontos principais em segundos.',
    'en-US': 'As a busy professional, I don\'t have time to watch 2-hour webinars. With VideoSummary, I can extract the main points in seconds.',
    'es-ES': 'Como profesional ocupado, no tengo tiempo para ver webinars de 2 horas. Con VideoSumario, puedo extraer los puntos principales en segundos.'
  },
  testimonial2Author: {
    'pt-BR': 'Ricardo Oliveira',
    'en-US': 'Richard Oliver',
    'es-ES': 'Ricardo Oliveira'
  },
  testimonial2Title: {
    'pt-BR': 'Gerente de Projetos',
    'en-US': 'Project Manager',
    'es-ES': 'Gerente de Proyectos'
  },
  testimonial3Content: {
    'pt-BR': 'Uso para analisar conteúdos da concorrência e economizo horas de trabalho. A precisão dos resumos é impressionante!',
    'en-US': 'I use it to analyze competitor content and save hours of work. The precision of the summaries is impressive!',
    'es-ES': 'Lo uso para analizar el contenido de la competencia y ahorrar horas de trabajo. ¡La precisión de los resúmenes es impresionante!'
  },
  testimonial3Author: {
    'pt-BR': 'Camila Santos',
    'en-US': 'Camila Santos',
    'es-ES': 'Camila Santos'
  },
  testimonial3Title: {
    'pt-BR': 'Criadora de Conteúdo',
    'en-US': 'Content Creator',
    'es-ES': 'Creadora de Contenido'
  },
  
  // FAQ Section
  faqTitle: {
    'pt-BR': 'Perguntas Frequentes',
    'en-US': 'Frequently Asked Questions',
    'es-ES': 'Preguntas Frecuentes'
  },
  faqSubtitle: {
    'pt-BR': 'Encontre respostas para as dúvidas mais comuns sobre nossa ferramenta.',
    'en-US': 'Find answers to the most common questions about our tool.',
    'es-ES': 'Encuentre respuestas a las preguntas más comunes sobre nuestra herramienta.'
  },
  faqQuestion1: {
    'pt-BR': 'Quais idiomas são suportados?',
    'en-US': 'Which languages are supported?',
    'es-ES': '¿Qué idiomas son compatibles?'
  },
  faqAnswer1: {
    'pt-BR': 'Atualmente, nossa ferramenta suporta vídeos em Português (Brasil), Inglês, Espanhol e Francês. Estamos trabalhando para adicionar mais idiomas em breve.',
    'en-US': 'Currently, our tool supports videos in Portuguese (Brazil), English, Spanish, and French. We are working to add more languages soon.',
    'es-ES': 'Actualmente, nuestra herramienta admite videos en portugués (Brasil), inglés, español y francés. Estamos trabajando para agregar más idiomas pronto.'
  },
  faqQuestion2: {
    'pt-BR': 'Existe limite de duração para os vídeos?',
    'en-US': 'Is there a duration limit for videos?',
    'es-ES': '¿Hay un límite de duración para los videos?'
  },
  faqAnswer2: {
    'pt-BR': 'O plano gratuito permite resumir vídeos de até 10 minutos. Os planos pagos permitem resumir vídeos de até 3 horas, dependendo do plano assinado.',
    'en-US': 'The free plan allows you to summarize videos up to 10 minutes. Paid plans allow you to summarize videos up to 3 hours, depending on the plan subscribed.',
    'es-ES': 'El plan gratuito le permite resumir videos de hasta 10 minutos. Los planes pagos le permiten resumir videos de hasta 3 horas, dependiendo del plan suscrito.'
  },
  faqQuestion3: {
    'pt-BR': 'Como meus dados são protegidos?',
    'en-US': 'How is my data protected?',
    'es-ES': '¿Cómo se protegen mis datos?'
  },
  faqAnswer3: {
    'pt-BR': 'Valorizamos sua privacidade. Não armazenamos o conteúdo dos vídeos processados e todos os resumos gerados são excluídos após 7 dias. Para mais detalhes, consulte nossa Política de Privacidade.',
    'en-US': 'We value your privacy. We do not store the content of processed videos and all generated summaries are deleted after 7 days. For more details, see our Privacy Policy.',
    'es-ES': 'Valoramos su privacidad. No almacenamos el contenido de los videos procesados y todos los resúmenes generados se eliminan después de 7 días. Para más detalles, consulte nuestra Política de Privacidad.'
  },
  faqQuestion4: {
    'pt-BR': 'Posso usar a ferramenta em dispositivos móveis?',
    'en-US': 'Can I use the tool on mobile devices?',
    'es-ES': '¿Puedo usar la herramienta en dispositivos móviles?'
  },
  faqAnswer4: {
    'pt-BR': 'Sim! Nossa ferramenta é totalmente responsiva e funciona em qualquer dispositivo com acesso à internet, incluindo smartphones e tablets.',
    'en-US': 'Yes! Our tool is fully responsive and works on any device with internet access, including smartphones and tablets.',
    'es-ES': '¡Sí! Nuestra herramienta es completamente responsiva y funciona en cualquier dispositivo con acceso a Internet, incluidos teléfonos inteligentes y tabletas.'
  },
  faqQuestion5: {
    'pt-BR': 'Os resumos são gerados por IA?',
    'en-US': 'Are the summaries generated by AI?',
    'es-ES': '¿Los resúmenes son generados por IA?'
  },
  faqAnswer5: {
    'pt-BR': 'Sim, utilizamos tecnologia avançada de Inteligência Artificial para analisar o conteúdo dos vídeos e gerar resumos concisos e precisos.',
    'en-US': 'Yes, we use advanced Artificial Intelligence technology to analyze video content and generate concise and accurate summaries.',
    'es-ES': 'Sí, utilizamos tecnología avanzada de Inteligencia Artificial para analizar el contenido del video y generar resúmenes concisos y precisos.'
  },
  faqQuestion6: {
    'pt-BR': 'É possível salvar os resumos gerados?',
    'en-US': 'Is it possible to save the generated summaries?',
    'es-ES': '¿Es posible guardar los resúmenes generados?'
  },
  faqAnswer6: {
    'pt-BR': 'Sim, os usuários cadastrados podem salvar e acessar seus resumos a qualquer momento na área de usuário. Os resumos ficam disponíveis por 30 dias nos planos gratuitos e permanentemente nos planos premium.',
    'en-US': 'Yes, registered users can save and access their summaries at any time in the user area. Summaries are available for 30 days on free plans and permanently on premium plans.',
    'es-ES': 'Sí, los usuarios registrados pueden guardar y acceder a sus resúmenes en cualquier momento en el área de usuario. Los resúmenes están disponibles por 30 días en los planes gratuitos y permanentemente en los planes premium.'
  },
  faqQuestion7: {
    'pt-BR': 'Quantos resumos posso gerar por dia?',
    'en-US': 'How many summaries can I generate per day?',
    'es-ES': '¿Cuántos resúmenes puedo generar por día?'
  },
  faqAnswer7: {
    'pt-BR': 'O plano gratuito permite gerar até 3 resumos por dia. Os planos pagos oferecem entre 30 e resumos ilimitados por dia, dependendo do plano escolhido.',
    'en-US': 'The free plan allows you to generate up to 3 summaries per day. Paid plans offer between 30 and unlimited summaries per day, depending on the chosen plan.',
    'es-ES': 'El plan gratuito le permite generar hasta 3 resúmenes por día. Los planes pagos ofrecen entre 30 y resúmenes ilimitados por día, dependiendo del plan elegido.'
  },
  faqQuestion8: {
    'pt-BR': 'Funciona com vídeos privados ou não listados?',
    'en-US': 'Does it work with private or unlisted videos?',
    'es-ES': '¿Funciona con videos privados o no listados?'
  },
  faqAnswer8: {
    'pt-BR': 'No momento, nossa ferramenta funciona apenas com vídeos públicos do YouTube. Não é possível processar vídeos privados ou que exijam login para visualização.',
    'en-US': 'At the moment, our tool only works with public YouTube videos. It is not possible to process private videos or videos that require login to view.',
    'es-ES': 'Por el momento, nuestra herramienta solo funciona con videos públicos de YouTube. No es posible procesar videos privados o videos que requieran inicio de sesión para ver.'
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
