
import React, { useEffect, useState, useRef } from 'react';
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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to prevent multiple executions
  const hasVerified = useRef(false);
  
  const sessionId = searchParams.get('session_id');
  const creditsParam = searchParams.get('credits');

  useEffect(() => {
    console.log('[PAYMENT-SUCCESS] Page loaded, session_id:', sessionId);
    
    if (!sessionId) {
      setError('Nenhum session_id encontrado na URL');
      setProcessing(false);
      return;
    }

    // Prevent multiple executions
    if (hasVerified.current) {
      return;
    }

    if (user && !loading) {
      hasVerified.current = true;
      verifyPayment();
    } else if (!loading) {
      setError('Usuário não encontrado - faça login para ver os resultados do pagamento');
      setProcessing(false);
    }
  }, [user, loading, sessionId, creditsParam]);

  const verifyPayment = async () => {
    try {
      console.log('[PAYMENT-SUCCESS] Starting payment verification');
      
      const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      if (verificationError) {
        throw new Error(verificationError.message || 'Failed to verify payment');
      }

      if (!verificationData || !verificationData.success) {
        const errorMsg = verificationData?.error || 'Payment verification failed';
        throw new Error(errorMsg);
      }

      // Get updated credits from database
      const updatedCredits = await getUserCredits(user.id);
      const creditsAdded = verificationData.credits_added || parseInt(creditsParam || '0');
      
      setCredits(creditsAdded);
      setTotalCredits(updatedCredits);
      setProcessing(false);
      
      if (verificationData.already_processed) {
        toast.info('Credits already added to your account for this payment.', {
          duration: 5000,
        });
      } else {
        toast.success(`${creditsAdded} credits added successfully to your account!`, {
          duration: 5000,
        });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      setProcessing(false);
      toast.error(`Payment verification error: ${errorMessage}. Contact support if your payment was processed.`, {
        duration: 8000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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
