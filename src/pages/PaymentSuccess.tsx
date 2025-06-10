
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getUserCredits } from '@/services/creditsService';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, CreditCard, XCircle, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  console.log('[PAYMENT-SUCCESS] Component loading...');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  
  const sessionId = searchParams.get('session_id');
  const creditsParam = searchParams.get('credits');

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs(prev => [...prev, logMessage]);
  };

  useEffect(() => {
    console.log('[PAYMENT-SUCCESS] Component mounted');
    addDebugLog('=== PÁGINA PAYMENT SUCCESS CARREGADA ===');
    addDebugLog(`URL atual: ${window.location.href}`);
    addDebugLog(`Parâmetros da URL: ${window.location.search}`);
    addDebugLog(`User: ${user ? user.id : 'NULL'}`);
    addDebugLog(`Session ID: ${sessionId || 'NULL'}`);
    addDebugLog(`Credits Param: ${creditsParam || 'NULL'}`);
    
    // Log all URL parameters
    const allParams = Array.from(searchParams.entries());
    addDebugLog(`Todos os parâmetros: ${JSON.stringify(allParams)}`);
    
    if (!user) {
      addDebugLog('ERRO: Usuário não encontrado, redirecionando para auth');
      navigate('/auth');
      return;
    }

    if (!sessionId) {
      addDebugLog('ERRO: Parâmetro session_id não encontrado na URL');
      setError('Informações de sessão de pagamento não encontradas');
      setProcessing(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        addDebugLog(`=== INICIANDO VERIFICAÇÃO DE PAGAMENTO (Tentativa ${retryCount + 1}) ===`);
        addDebugLog(`Chamando função verify-payment com session_id: ${sessionId}`);
        
        const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId }
        });

        addDebugLog(`Invocação da função concluída`);
        addDebugLog(`Dados de verificação: ${JSON.stringify(verificationData)}`);
        addDebugLog(`Erro de verificação: ${JSON.stringify(verificationError)}`);

        if (verificationError) {
          addDebugLog(`ERRO: Falha na invocação da função: ${verificationError.message}`);
          throw new Error(verificationError.message || 'Falha ao verificar pagamento');
        }

        if (!verificationData) {
          addDebugLog('ERRO: Nenhum dado retornado da função verify-payment');
          throw new Error('Nenhuma resposta da verificação de pagamento');
        }

        if (!verificationData.success) {
          addDebugLog(`ERRO: Verificação de pagamento falhou: ${verificationData.error}`);
          throw new Error(verificationData.error || 'Verificação de pagamento falhou');
        }

        addDebugLog('SUCESSO: Verificação de pagamento bem-sucedida');
        
        // Get updated credits from database
        addDebugLog('Buscando créditos atualizados do banco de dados...');
        const updatedCredits = await getUserCredits(user.id);
        const creditsAdded = verificationData.credits_added || parseInt(creditsParam || '0');
        
        addDebugLog(`Créditos adicionados: ${creditsAdded}`);
        addDebugLog(`Total de créditos: ${updatedCredits}`);
        
        setCredits(creditsAdded);
        setTotalCredits(updatedCredits);
        setProcessing(false);
        
        if (verificationData.already_processed) {
          addDebugLog('INFO: Créditos já foram processados para este pagamento');
          toast.info('Os créditos já foram adicionados à sua conta para este pagamento.', {
            duration: 5000,
          });
        } else {
          addDebugLog('SUCESSO: Novos créditos adicionados com sucesso');
          toast.success(`${creditsAdded} créditos adicionados com sucesso à sua conta!`, {
            duration: 5000,
          });
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        addDebugLog(`ERRO: Verificação de pagamento falhou: ${errorMessage}`);
        
        // Retry logic for potential delays
        if (retryCount < 3 && !errorMessage.includes('already processed')) {
          addDebugLog(`Tentando novamente em ${2000 * (retryCount + 1)}ms (tentativa ${retryCount + 2}/4)`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            verifyPayment();
          }, 2000 * (retryCount + 1)); // Exponential backoff
          return;
        }
        
        addDebugLog('ERRO: Máximo de tentativas atingido ou erro permanente');
        setError(errorMessage);
        setProcessing(false);
        toast.error(`Erro na verificação de pagamento: ${errorMessage}. Entre em contato com o suporte se seu pagamento foi processado.`, {
          duration: 8000,
        });
      }
    };

    addDebugLog('Iniciando processo de verificação de pagamento...');
    verifyPayment();
  }, [user, sessionId, creditsParam, navigate, retryCount]);

  // Debug panel (always visible for now)
  const DebugPanel = () => (
    <Card className="mt-4 bg-gray-50">
      <CardHeader>
        <CardTitle className="text-sm">Informações de Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs space-y-1 max-h-60 overflow-y-auto">
          {debugLogs.map((log, index) => (
            <div key={index} className="font-mono text-gray-600">
              {log}
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t text-xs text-gray-500">
          <p>User ID: {user?.id}</p>
          <p>Session ID: {sessionId}</p>
          <p>Credits Param: {creditsParam}</p>
          <p>Processing: {processing.toString()}</p>
          <p>Error: {error || 'Nenhum'}</p>
          <p>Retry Count: {retryCount}</p>
          <p>URL: {window.location.href}</p>
        </div>
      </CardContent>
    </Card>
  );

  console.log('[PAYMENT-SUCCESS] Rendering component');

  // Simple test render first
  if (!user) {
    console.log('[PAYMENT-SUCCESS] No user, rendering null');
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-8">
              <CardContent>
                <p>Usuário não encontrado. Redirecionando...</p>
              </CardContent>
            </Card>
            <DebugPanel />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error && !processing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-8 border-red-200">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <CardTitle className="text-3xl font-bold text-red-600">Problema na Verificação do Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-lg font-medium text-red-700">
                    Houve um problema ao verificar seu pagamento
                  </p>
                  <p className="text-muted-foreground">
                    {error}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => window.location.reload()} variant="default">
                    Tentar Verificação Novamente
                  </Button>
                  <Button onClick={() => navigate('/dashboard?tab=credits')} variant="outline">
                    Ir para Dashboard
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Se você foi cobrado mas não recebeu créditos, entre em contato com o suporte com o session ID: {sessionId}
                  </p>
                </div>
              </CardContent>
            </Card>
            <DebugPanel />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {processing ? (
            <Card className="text-center py-8">
              <CardContent className="space-y-4">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-brand-purple" />
                <h2 className="text-2xl font-bold">Verificando seu pagamento...</h2>
                <p className="text-muted-foreground">
                  Aguarde enquanto confirmamos seu pagamento e adicionamos créditos à sua conta.
                </p>
                {retryCount > 0 && (
                  <p className="text-sm text-yellow-600">
                    Tentativa {retryCount}/3 - Isso pode levar alguns momentos...
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-600">Pagamento Realizado com Sucesso!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-lg">
                    <strong>{credits}</strong> créditos foram adicionados à sua conta.
                  </p>
                  <p className="text-muted-foreground">
                    Seu saldo total agora é de <strong>{totalCredits}</strong> créditos.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Ir para Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Voltar ao Início
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Agora você pode criar resumos de vídeo usando seus créditos.</p>
                  <p>Cada resumo de vídeo custa 1 crédito.</p>
                </div>
              </CardContent>
            </Card>
          )}
          <DebugPanel />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
