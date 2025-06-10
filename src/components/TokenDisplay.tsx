
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserCredits } from '@/services/creditsService';
import { Coins } from 'lucide-react';

const TokenDisplay = () => {
  const { user } = useAuth();
  const [tokens, setTokens] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserTokens();
      
      // Set up interval to refresh tokens every 30 seconds
      const interval = setInterval(fetchUserTokens, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Listen for focus events to refresh credits when user returns to tab
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchUserTokens();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const fetchUserTokens = async () => {
    if (!user) return;
    
    try {
      const credits = await getUserCredits(user.id);
      setTokens(credits);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      setTokens(0);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 rounded-full border border-brand-purple/20">
      <Coins className="h-4 w-4 text-brand-purple" />
      <span className="text-sm font-medium text-brand-purple">{tokens} credits</span>
    </div>
  );
};

export default TokenDisplay;
