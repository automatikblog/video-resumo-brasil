
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { getCurrentLang, getLangString } from '@/services/languageService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const currentLang = getCurrentLang();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em]" role="status">
          <span className="sr-only">{getLangString('loading', currentLang)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold gradient-text">
              {getLangString('signIn', currentLang)}
            </CardTitle>
            <CardDescription>
              {getLangString('continueWithGoogle', currentLang)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full py-6 flex items-center justify-center gap-2"
            >
              <FcGoogle size={24} />
              <span>{getLangString('continueWithGoogle', currentLang)}</span>
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            {getLangString('signUpForMore', currentLang)}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
