
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { addCreditsToUser, getUserCredits } from '@/services/creditsService';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PaymentSuccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);
  
  const sessionId = searchParams.get('session_id');
  const creditsParam = searchParams.get('credits');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const processPayment = async () => {
      try {
        if (!sessionId || !creditsParam) {
          throw new Error('Missing payment information');
        }

        const creditsToAdd = parseInt(creditsParam);
        
        // Add credits to user account
        await addCreditsToUser(user.id, creditsToAdd);
        
        // Get updated total credits
        const updatedCredits = await getUserCredits(user.id);
        
        setCredits(creditsToAdd);
        setTotalCredits(updatedCredits);
        
        toast.success(`Successfully added ${creditsToAdd} credits to your account!`);
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('There was an issue processing your payment. Please contact support.');
      } finally {
        setProcessing(false);
      }
    };

    processPayment();
  }, [user, sessionId, creditsParam, navigate]);

  if (!user) {
    return null;
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
