
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
  console.log('[PAYMENT-SUCCESS] ===== COMPONENTE INICIANDO =====');
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  const sessionId = searchParams.get('session_id');
  const creditsParam = searchParams.get('credits');

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs(prev => [...prev, logMessage]);
  };

  useEffect(() => {
    console.log('[PAYMENT-SUCCESS] ===== USE EFFECT PRINCIPAL =====');
    addDebugLog('=== PAYMENT SUCCESS PAGE LOADED ===');
    addDebugLog(`Current URL: ${window.location.href}`);
    addDebugLog(`URL Params: ${window.location.search}`);
    addDebugLog(`Auth loading: ${loading}`);
    addDebugLog(`User: ${user ? user.id : 'NULL'}`);
    addDebugLog(`Session ID: ${sessionId || 'NULL'}`);
    addDebugLog(`Credits Param: ${creditsParam || 'NULL'}`);
    
    // REMOVIDO O REDIRECIONAMENTO AUTOMÁTICO
    // Vamos deixar a página carregar sempre e mostrar o estado
    
    if (!sessionId) {
      addDebugLog('WARNING: No session_id found in URL');
      setError('Nenhum session_id encontrado na URL');
      setProcessing(false);
      return;
    }

    if (!user && !loading) {
      addDebugLog('WARNING: No user found and auth not loading');
      setError('Usuário não encontrado - faça login para ver os resultados do pagamento');
      setProcessing(false);
      return;
    }

    if (user) {
      addDebugLog('User found, starting payment verification...');
      verifyPayment();
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

      if (!verificationData) {
        addDebugLog('ERROR: No data returned from verify-payment function');
        throw new Error('No response from payment verification');
      }

      if (!verificationData.success) {
        addDebugLog(`ERROR: Payment verification failed: ${verificationData.error}`);
        throw new Error(verificationData.error || 'Payment verification failed');
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
        }, 2000 * (retryCount + 1)); // Exponential backoff
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

  // Debug panel (always visible)
  const DebugPanel = () => (
    <Card className="mt-4 bg-gray-50">
      <CardHeader>
        <CardTitle className="text-sm">Debug Information</CardTitle>
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
          <p>User ID: {user?.id || 'Not logged in'}</p>
          <p>Auth Loading: {loading.toString()}</p>
          <p>Session ID: {sessionId || 'None'}</p>
          <p>Credits Param: {creditsParam || 'None'}</p>
          <p>Processing: {processing.toString()}</p>
          <p>Error: {error || 'None'}</p>
          <p>Retry Count: {retryCount}</p>
          <p>Current URL: {window.location.href}</p>
          <p>Should Redirect: {shouldRedirect.toString()}</p>
        </div>
        <div className="mt-2 pt-2 border-t">
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  console.log('[PAYMENT-SUCCESS] Rendering component, user:', user?.id, 'loading:', loading);

  // Always render the page - no automatic redirects
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
                <CardTitle className="text-3xl font-bold text-yellow-600">Login Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg">You need to be logged in to view payment results.</p>
                <Button onClick={() => navigate('/auth')} className="mr-4">
                  Go to Login
                </Button>
                <Button onClick={() => navigate('/dashboard')} variant="outline">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : error && !processing ? (
            <Card className="text-center py-8 border-red-200">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <CardTitle className="text-3xl font-bold text-red-600">Payment Verification Problem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-lg font-medium text-red-700">
                    There was a problem verifying your payment
                  </p>
                  <p className="text-muted-foreground">
                    {error}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => window.location.reload()} variant="default">
                    Try Verification Again
                  </Button>
                  <Button onClick={() => navigate('/dashboard?tab=credits')} variant="outline">
                    Go to Dashboard
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    If you were charged but didn't receive credits, contact support with session ID: {sessionId}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : processing ? (
            <Card className="text-center py-8">
              <CardContent className="space-y-4">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-brand-purple" />
                <h2 className="text-2xl font-bold">Verifying your payment...</h2>
                <p className="text-muted-foreground">
                  Please wait while we confirm your payment and add credits to your account.
                </p>
                {retryCount > 0 && (
                  <p className="text-sm text-yellow-600">
                    Attempt {retryCount}/3 - This may take a few moments...
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
                <CardTitle className="text-3xl font-bold text-green-600">Payment Successful!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-lg">
                    <strong>{credits}</strong> credits have been added to your account.
                  </p>
                  <p className="text-muted-foreground">
                    Your total balance is now <strong>{totalCredits}</strong> credits.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Go to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Back to Home
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>You can now create video summaries using your credits.</p>
                  <p>Each video summary costs 1 credit.</p>
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
