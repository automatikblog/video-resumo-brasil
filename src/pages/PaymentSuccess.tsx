
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const sessionId = searchParams.get('session_id');
  const creditsParam = searchParams.get('credits');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!sessionId) {
      setError('Missing payment session information');
      setProcessing(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log('Starting payment verification for session:', sessionId);
        
        const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId }
        });

        console.log('Verification response:', verificationData, 'Error:', verificationError);

        if (verificationError) {
          console.error('Payment verification error:', verificationError);
          throw new Error(verificationError.message || 'Failed to verify payment');
        }

        if (!verificationData || !verificationData.success) {
          throw new Error(verificationData?.error || 'Payment verification failed');
        }

        // Get updated credits from database
        const updatedCredits = await getUserCredits(user.id);
        const creditsAdded = verificationData.credits_added || parseInt(creditsParam || '0');
        
        setCredits(creditsAdded);
        setTotalCredits(updatedCredits);
        setProcessing(false);
        
        if (verificationData.already_processed) {
          toast.info('Credits were already added to your account for this payment.', {
            duration: 5000,
          });
        } else {
          toast.success(`Successfully added ${creditsAdded} credits to your account!`, {
            duration: 5000,
          });
        }
        
        console.log(`Payment verified: ${creditsAdded} credits, total: ${updatedCredits}`);
      } catch (error) {
        console.error('Error verifying payment:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        // Retry logic for potential delays
        if (retryCount < 3 && !errorMessage.includes('already processed')) {
          console.log(`Retrying payment verification (${retryCount + 1}/3)...`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            verifyPayment();
          }, 2000 * (retryCount + 1)); // Exponential backoff
          return;
        }
        
        setError(errorMessage);
        setProcessing(false);
        toast.error(`Payment verification error: ${errorMessage}. Please contact support if your payment was processed.`, {
          duration: 8000,
        });
      }
    };

    verifyPayment();
  }, [user, sessionId, creditsParam, navigate, retryCount]);

  if (!user) {
    return null;
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
                <CardTitle className="text-3xl font-bold text-red-600">Payment Verification Issue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-lg font-medium text-red-700">
                    There was an issue verifying your payment
                  </p>
                  <p className="text-muted-foreground">
                    {error}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => window.location.reload()} variant="default">
                    Retry Verification
                  </Button>
                  <Button onClick={() => navigate('/dashboard?tab=credits')} variant="outline">
                    Go to Dashboard
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    If you were charged but didn't receive credits, please contact support with session ID: {sessionId}
                  </p>
                </div>
              </CardContent>
            </Card>
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
                <h2 className="text-2xl font-bold">Verifying your payment...</h2>
                <p className="text-muted-foreground">
                  Please wait while we confirm your payment and add credits to your account.
                </p>
                {retryCount > 0 && (
                  <p className="text-sm text-yellow-600">
                    Retry attempt {retryCount}/3 - This may take a few moments...
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
