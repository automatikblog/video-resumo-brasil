
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentLang, getLangString } from '@/services/languageService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Pricing = () => {
  const currentLang = getCurrentLang();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const creditPackages = [
    {
      name: "Starter",
      credits: 30,
      price: "$3.99",
      description: "Ideal for students or hobbyists",
      features: [
        "Access to bulk transcript extractor",
        "Extract transcripts from channels, playlists, or individual videos",
        "Multiple export formats (TXT, JSON, CSV, SRT, VTT)",
        "Combine multiple transcripts into a single file or export individually",
        "Support via Discord or email"
      ],
      popular: false,
      buttonText: "Purchase Credits",
      badge: "Try it out with minimal investment"
    },
    {
      name: "Most Popular",
      credits: 100,
      price: "$7.99",
      description: "Perfect for professionals & content creators",
      features: [
        "Access to bulk transcript extractor",
        "Extract transcripts from channels, playlists, or individual videos",
        "Multiple export formats (TXT, JSON, CSV, SRT, VTT)",
        "Combine multiple transcripts into a single file or export individually",
        "Support via Discord or email"
      ],
      popular: true,
      buttonText: "Purchase Credits",
      badge: "Best value for most users"
    },
    {
      name: "High Volume",
      credits: 300,
      price: "$19.99",
      description: "Best for powerusers, agencies & teams",
      features: [
        "Access to bulk transcript extractor",
        "Extract transcripts from channels, playlists, or individual videos",
        "Multiple export formats (TXT, JSON, CSV, SRT, VTT)",
        "Combine multiple transcripts into a single file or export individually",
        "Support via Discord or email"
      ],
      popular: false,
      buttonText: "Purchase Credits",
      badge: "For high-volume needs"
    }
  ];

  const handlePurchaseClick = (packageName: string) => {
    if (!user) {
      // Redirect to sign up if not logged in
      navigate('/auth');
    } else {
      // Redirect to dashboard credits section when logged in
      navigate('/dashboard#credits');
    }
  };

  return (
    <section id="precos" className="section-padding bg-gradient-to-b from-white to-accent/20">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Credit Packages</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Choose the perfect credit package for your video summarization needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creditPackages.map((pkg, index) => (
            <Card 
              key={index} 
              className={`border ${pkg.popular ? 'border-red-500 shadow-lg relative scale-105 z-10' : 'border-border/50'} transition-all hover:shadow-md`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm text-white">{pkg.name}</Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{pkg.popular ? 'Most Popular' : pkg.name}</CardTitle>
                  {!pkg.popular && (
                    <Badge variant="outline" className="text-xs">{pkg.badge}</Badge>
                  )}
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{pkg.credits} Credits</span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-brand-purple">{pkg.price}</span>
                </div>
                <CardDescription className="mt-2">{pkg.description}</CardDescription>
                {pkg.popular && (
                  <Badge className="bg-red-50 text-red-600 border-red-200 mt-2 w-fit">{pkg.badge}</Badge>
                )}
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${pkg.popular 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : pkg.name === 'High Volume' 
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-800 text-white'}`}
                  onClick={() => handlePurchaseClick(pkg.name)}
                >
                  {pkg.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
