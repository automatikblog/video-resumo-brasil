
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
  console.log('[PAYMENT-SUCCESS] ===== COMPONENTE CARREGADO =====');
  console.log('[PAYMENT-SUCCESS] URL atual:', window.location.href);
  
  const { user, loading } = useAuth();
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
    console.log('[PAYMENT-SUCCESS] ===== USE EFFECT EXECUTADO =====');
    addDebugLog('=== PAYMENT SUCCESS PAGE LOADED ===');
    addDebugLog(`Current URL: ${window.location.href}`);
    addDebugLog(`Auth loading: ${loading}`);
    addDebugLog(`User: ${user ? user.id : 'NULL'}`);
    addDebugLog(`Session ID: ${sessionId || 'NULL'}`);
    addDebugLog(`Credits Param: ${creditsParam || 'NULL'}`);
    
    if (!sessionId) {
      addDebugLog('WARNING: No session_id found in URL');
      setError('Nenhum session_id encontrado na URL');
      setProcessing(false);
      return;
    }

    if (user) {
      addDebugLog('User found, starting payment verification...');
      verifyPayment();
    } else if (!loading) {
      addDebugLog('WARNING: No user found and auth not loading');
      setError('Usuário não encontrado - faça login para ver os resultados do pagamento');
      setProcessing(false);
    }
  }, [user, loading, sessionId, creditsParam, retryCount]);

  const verifyPayment = async () => {
    try {
      addDebugLog(`=== STARTING PAYMENT VERIFICATION (Attempt ${retryCount + 1}) ===`);
      addDebugLog(`Calling verify-payment with session_id: ${sessionId}`);
      
      const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      addDebugLog(`Function invocation completed`);
      addDebugLog(`Verification data: ${JSON.stringify(verificationData)}`);
      addDebugLog(`Verification error: ${JSON.stringify(verificationError)}`);

      if (verificationError) {
        addDebugLog(`ERROR: Function invocation failed: ${verificationError.message}`);
        throw new Error(verificationError.message || 'Failed to verify payment');
      }

      if (!verificationData || !verificationData.success) {
        const errorMsg = verificationData?.error || 'Payment verification failed';
        addDebugLog(`ERROR: Payment verification failed: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      addDebugLog('SUCCESS: Payment verification successful');
      
      // Get updated credits from database
      addDebugLog('Fetching updated credits from database...');
      const updatedCredits = await getUserCredits(user.id);
      const creditsAdded = verificationData.credits_added || parseInt(creditsParam || '0');
      
      addDebugLog(`Credits added: ${creditsAdded}`);
      addDebugLog(`Total credits: ${updatedCredits}`);
      
      setCredits(creditsAdded);
      setTotalCredits(updatedCredits);
      setProcessing(false);
      
      if (verificationData.already_processed) {
        addDebugLog('INFO: Credits already processed for this payment');
        toast.info('Credits already added to your account for this payment.', {
          duration: 5000,
        });
      } else {
        addDebugLog('SUCCESS: New credits added successfully');
        toast.success(`${creditsAdded} credits added successfully to your account!`, {
          duration: 5000,
        });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addDebugLog(`ERROR: Payment verification failed: ${errorMessage}`);
      
      // Retry logic for potential delays
      if (retryCount < 3 && !errorMessage.includes('already processed')) {
        addDebugLog(`Retrying in ${2000 * (retryCount + 1)}ms (attempt ${retryCount + 2}/4)`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          verifyPayment();
        }, 2000 * (retryCount + 1));
        return;
      }
      
      addDebugLog('ERROR: Max retries reached or permanent error');
      setError(errorMessage);
      setProcessing(false);
      toast.error(`Payment verification error: ${errorMessage}. Contact support if your payment was processed.`, {
        duration: 8000,
      });
    }
  };

  console.log('[PAYMENT-SUCCESS] Rendering component');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Debug Panel - Always visible */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-800">🔍 DEBUG PANEL - Informações de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>URL Atual:</strong> {window.location.href}</div>
                  <div><strong>User ID:</strong> {user?.id || 'Não logado'}</div>
                  <div><strong>Auth Loading:</strong> {loading.toString()}</div>
                  <div><strong>Session ID:</strong> {sessionId || 'Nenhum'}</div>
                  <div><strong>Credits Param:</strong> {creditsParam || 'Nenhum'}</div>
                  <div><strong>Processing:</strong> {processing.toString()}</div>
                  <div><strong>Error:</strong> {error || 'Nenhum'}</div>
                  <div><strong>Retry Count:</strong> {retryCount}</div>
                </div>
                
                <div className="mt-4">
                  <strong>Logs de Debug:</strong>
                  <div className="max-h-40 overflow-y-auto bg-white p-2 rounded border text-xs font-mono">
                    {debugLogs.map((log, index) => (
                      <div key={index} className="text-gray-600 mb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => window.location.reload()}>
                    🔄 Recarregar Página
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate('/dashboard')}>
                    📊 Ir para Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          {!user && !loading ? (
            <Card className="text-center py-8 border-yellow-200">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="h-16 w-16 text-yellow-500" />
                </div>
                <CardTitle className="text-3xl font-bold text-yellow-600">Login Necessário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg">Você precisa estar logado para ver os resultados do pagamento.</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('/auth')}>
                    Fazer Login
                  </Button>
                  <Button onClick={() => navigate('/dashboard')} variant="outline">
                    Ir para Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : error && !processing ? (
            <Card className="text-center py-8 border-red-200">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <CardTitle className="text-3xl font-bold text-red-600">Problema na Verificação</CardTitle>
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
                    Tentar Novamente
                  </Button>
                  <Button onClick={() => navigate('/dashboard?tab=credits')} variant="outline">
                    Ir para Dashboard
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Se você foi cobrado mas não recebeu créditos, entre em contato com o suporte com o Session ID: {sessionId}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : processing ? (
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
