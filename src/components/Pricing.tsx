
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentLang, getLangString } from '@/services/languageService';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const currentLang = getCurrentLang();
  
  const plans = [
    {
      name: getLangString('freePlan', currentLang),
      price: getLangString('freePrice', currentLang),
      billing: getLangString('forever', currentLang),
      description: getLangString('freeDesc', currentLang),
      features: [
        getLangString('feature3SummariesPerDay', currentLang),
        getLangString('featureVideosUpTo10Min', currentLang),
        getLangString('featureBasicTranscriptions', currentLang),
        getLangString('featureEmailSupport', currentLang)
      ],
      popular: false,
      buttonText: getLangString('startFree', currentLang)
    },
    {
      name: getLangString('proPlan', currentLang),
      price: getLangString('proPrice', currentLang),
      billing: getLangString('perMonth', currentLang),
      description: getLangString('proDesc', currentLang),
      features: [
        getLangString('feature30SummariesPerDay', currentLang),
        getLangString('featureVideosUpTo1Hour', currentLang),
        getLangString('featureDetailedTranscriptions', currentLang),
        getLangString('featureSaveTranscriptions', currentLang),
        getLangString('featurePrioritySupport', currentLang)
      ],
      popular: true,
      buttonText: getLangString('buyNow', currentLang)
    },
    {
      name: getLangString('businessPlan', currentLang),
      price: getLangString('businessPrice', currentLang),
      billing: getLangString('perMonth', currentLang),
      description: getLangString('businessDesc', currentLang),
      features: [
        getLangString('featureUnlimitedSummaries', currentLang),
        getLangString('featureVideosUpTo3Hours', currentLang),
        getLangString('featureAdvancedTranscriptions', currentLang),
        getLangString('featureUnlimitedLibrary', currentLang),
        getLangString('featureAPIIntegration', currentLang),
        getLangString('featureDedicatedSupport', currentLang)
      ],
      popular: false,
      buttonText: getLangString('contactUs', currentLang)
    }
  ];

  return (
    <section id="precos" className="section-padding bg-gradient-to-b from-white to-accent/20">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">{getLangString('pricingTitle', currentLang)}</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {getLangString('pricingSubtitle', currentLang)}
          </p>
          
          <div className="flex items-center justify-center mb-8">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'outline'}
              className={`rounded-r-none ${billingCycle === 'monthly' ? 'bg-brand-purple hover:bg-brand-deepPurple' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              {getLangString('monthly', currentLang)}
            </Button>
            <Button
              variant={billingCycle === 'yearly' ? 'default' : 'outline'}
              className={`rounded-l-none ${billingCycle === 'yearly' ? 'bg-brand-purple hover:bg-brand-deepPurple' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              {getLangString('yearly', currentLang)} <Badge className="ml-2 bg-green-500 text-white">{getLangString('discount', currentLang)}</Badge>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border ${plan.popular ? 'border-brand-purple shadow-lg relative scale-105 z-10' : 'border-border/50'} transition-all hover:shadow-md`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-brand-purple hover:bg-brand-deepPurple px-3 py-1 text-sm">{getLangString('mostPopular', currentLang)}</Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.billing}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-brand-purple flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${plan.popular 
                    ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90' 
                    : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => plan.name !== getLangString('freePlan', currentLang) && handleSubscribe(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  function handleSubscribe(planName: string) {
    // This will be connected to Stripe checkout later
    console.log(`Subscribing to ${planName} plan`);
    // We'll implement the Stripe checkout here
  }
};

export default Pricing;
