
import React from 'react';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-width flex h-16 items-center justify-between">
        <div className="flex items-center">
          <a href="#" className="text-xl font-bold gradient-text">VideoSumário</a>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">Como Funciona</a>
          <a href="#recursos" className="text-sm font-medium hover:text-primary transition-colors">Recursos</a>
          <a href="#casos" className="text-sm font-medium hover:text-primary transition-colors">Casos de Uso</a>
          <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</a>
          <a href="#precos" className="text-sm font-medium hover:text-primary transition-colors">Preços</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Entrar
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-opacity">
            Cadastre-se
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
