
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, ArrowRight } from 'lucide-react';
import { getCurrentLang, getLangString } from '@/services/languageService';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentLang = getCurrentLang();

  useEffect(() => {
    // Here you could verify the payment with Stripe if needed
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-green-200">
          <CardHeader className="text-center">
            {loading ? (
              <div className="h-20 w-20 mx-auto rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
            ) : (
              <div className="h-20 w-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-600" />
              </div>
            )}
            <CardTitle className="text-2xl mt-6">
              {loading ? 
                (currentLang === 'en-US' ? 'Processing payment...' : 
                 currentLang === 'es-ES' ? 'Procesando pago...' : 
                 'Processando pagamento...') : 
                (currentLang === 'en-US' ? 'Payment Successful!' : 
                 currentLang === 'es-ES' ? '¡Pago Exitoso!' : 
                 'Pagamento Bem-Sucedido!')}
            </CardTitle>
            <CardDescription className="text-base">
              {loading ? 
                (currentLang === 'en-US' ? 'Please wait while we confirm your payment...' : 
                 currentLang === 'es-ES' ? 'Por favor espere mientras confirmamos su pago...' : 
                 'Por favor, aguarde enquanto confirmamos seu pagamento...') : 
                (currentLang === 'en-US' ? 'Thank you for your purchase! Your account has been upgraded.' :
                 currentLang === 'es-ES' ? '¡Gracias por su compra! Su cuenta ha sido mejorada.' : 
                 'Obrigado por sua compra! Sua conta foi atualizada.')}
            </CardDescription>
          </CardHeader>
          <CardContent className={loading ? 'hidden' : ''}>
            <p className="text-center text-muted-foreground">
              {currentLang === 'en-US' ? 'Your transaction has been processed successfully. You now have access to all premium features.' :
               currentLang === 'es-ES' ? 'Su transacción ha sido procesada con éxito. Ahora tiene acceso a todas las funciones premium.' : 
               'Sua transação foi processada com sucesso. Agora você tem acesso a todos os recursos premium.'}
            </p>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                {currentLang === 'en-US' ? 'Order confirmation has been sent to your email address.' : 
                 currentLang === 'es-ES' ? 'La confirmación del pedido ha sido enviada a su dirección de correo electrónico.' : 
                 'A confirmação do pedido foi enviada para o seu endereço de e-mail.'}
              </p>
            </div>
          </CardContent>
          <CardFooter className={`justify-end ${loading ? 'hidden' : ''}`}>
            <Button onClick={handleGoToDashboard} className="bg-gradient-to-r from-brand-purple to-brand-blue text-white">
              <span>
                {currentLang === 'en-US' ? 'Go to Dashboard' : 
                 currentLang === 'es-ES' ? 'Ir al Panel' : 
                 'Ir para o Painel'}
              </span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
