
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { addCreditsToUser, getUserCredits } from '@/services/creditsService';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, CreditCard, XCircle, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PaymentSuccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const sessionId = searchParams.get('session_id');
  const creditsParam = searchParams.get('credits');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const processPayment = async () => {
      try {
        if (!sessionId) {
          throw new Error('Missing payment session information');
        }

        if (!creditsParam) {
          throw new Error('Missing credits information');
        }

        const creditsToAdd = parseInt(creditsParam);
        
        if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
          throw new Error('Invalid credits amount');
        }

        console.log(`Processing payment: adding ${creditsToAdd} credits to user ${user.id}`);
        
        // Add credits to user account
        await addCreditsToUser(user.id, creditsToAdd);
        
        // Get updated total credits
        const updatedCredits = await getUserCredits(user.id);
        
        setCredits(creditsToAdd);
        setTotalCredits(updatedCredits);
        
        toast.success(`Successfully added ${creditsToAdd} credits to your account!`, {
          duration: 5000,
        });
        
        console.log(`Successfully processed payment: ${creditsToAdd} credits added, total: ${updatedCredits}`);
      } catch (error) {
        console.error('Error processing payment:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        toast.error(`Payment processing error: ${errorMessage}. Please contact support if this persists.`, {
          duration: 8000,
        });
      } finally {
        setProcessing(false);
      }
    };

    processPayment();
  }, [user, sessionId, creditsParam, navigate]);

  // Handle case where user navigates here without session_id (payment was cancelled)
  useEffect(() => {
    if (!sessionId && !processing) {
      setError('Payment was cancelled or session expired');
      setProcessing(false);
    }
  }, [sessionId, processing]);

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
                <CardTitle className="text-3xl font-bold text-red-600">Payment Failed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-lg font-medium text-red-700">
                    There was an issue processing your payment
                  </p>
                  <p className="text-muted-foreground">
                    {error}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/dashboard?tab=credits')} variant="default">
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Back to Home
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    If you were charged but didn't receive credits, please contact support.
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
                <h2 className="text-2xl font-bold">Processing your payment...</h2>
                <p className="text-muted-foreground">Please wait while we add credits to your account.</p>
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
