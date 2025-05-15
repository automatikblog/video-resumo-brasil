
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/services/authService';
import { 
  getCurrentLang, 
  getAvailableLanguages, 
  setLanguage, 
  getLangString,
  Language
} from '@/services/languageService';
import { Globe, User, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

const Header = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentLang = getCurrentLang();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(getLangString('signedOut', currentLang) || 'Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(getLangString('errorSigningOut', currentLang) || 'Error signing out');
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Force page refresh to apply language change
    window.location.reload();
  };

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
      case 'pt-BR': return 'Português';
      case 'en-US': return 'English';
      case 'es-ES': return 'Español';
      default: return lang;
    }
  };

  const getCurrentLanguageLabel = () => {
    return getLanguageLabel(currentLang);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-width flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold gradient-text">VideoSumário</Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">
            {getLangString('howItWorks', currentLang)}
          </Link>
          <Link to="/#recursos" className="text-sm font-medium hover:text-primary transition-colors">
            {getLangString('features', currentLang)}
          </Link>
          <Link to="/#casos" className="text-sm font-medium hover:text-primary transition-colors">
            {getLangString('useCases', currentLang)}
          </Link>
          <Link to="/#faq" className="text-sm font-medium hover:text-primary transition-colors">
            {getLangString('faq', currentLang)}
          </Link>
          <Link to="/#precos" className="text-sm font-medium hover:text-primary transition-colors">
            {getLangString('pricing', currentLang)}
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {getAvailableLanguages().map((lang) => (
                <DropdownMenuItem 
                  key={lang} 
                  onClick={() => handleLanguageChange(lang)}
                  className={lang === currentLang ? "font-bold" : ""}
                >
                  {getLanguageLabel(lang)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu or Auth Buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.email?.split('@')[0] || getLangString('account', currentLang)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">{getLangString('dashboard', currentLang)}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  {getLangString('signOut', currentLang)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  {getLangString('signIn', currentLang)}
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-opacity">
                  {getLangString('signUp', currentLang)}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 bg-background border-t border-border/40">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/#como-funciona" 
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {getLangString('howItWorks', currentLang)}
            </Link>
            <Link 
              to="/#recursos" 
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {getLangString('features', currentLang)}
            </Link>
            <Link 
              to="/#casos" 
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {getLangString('useCases', currentLang)}
            </Link>
            <Link 
              to="/#faq" 
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {getLangString('faq', currentLang)}
            </Link>
            <Link 
              to="/#precos" 
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {getLangString('pricing', currentLang)}
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {getLangString('dashboard', currentLang)}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
