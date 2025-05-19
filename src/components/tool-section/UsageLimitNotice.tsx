
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { getCurrentLang, getLangString } from '@/services/languageService';

interface UsageLimitNoticeProps {
  isAuthenticated: boolean;
  canUse: boolean;
}

const UsageLimitNotice = ({ isAuthenticated, canUse }: UsageLimitNoticeProps) => {
  const navigate = useNavigate();
  const currentLang = getCurrentLang();

  if (isAuthenticated || canUse) return null;

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
      <p className="mb-2">{getLangString('usageLimitReachedDetail', currentLang)}</p>
      <Button 
        variant="outline" 
        onClick={() => navigate('/auth')}
        className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
      >
        {getLangString('signUpForMore', currentLang)}
      </Button>
    </div>
  );
};

export default UsageLimitNotice;
