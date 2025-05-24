
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Coins } from 'lucide-react';

const TokenDisplay = () => {
  const { user } = useAuth();
  const [tokens, setTokens] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserTokens();
    }
  }, [user]);

  const fetchUserTokens = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching tokens:', error);
      } else {
        setTokens(data?.credits || 0);
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
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
