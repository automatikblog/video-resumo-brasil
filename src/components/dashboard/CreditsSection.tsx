
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Zap, Star } from 'lucide-react';

const CreditsSection = () => {
  const creditPackages = [
    {
      name: "Starter",
      credits: 30,
      price: "$3.99",
      description: "Perfect for trying out our service",
      icon: <Coins className="h-6 w-6 text-gray-600" />,
      color: "border-gray-200",
      buttonColor: "bg-gray-700 hover:bg-gray-800",
      popular: false
    },
    {
      name: "Most Popular",
      credits: 100,
      price: "$7.99",
      description: "Best value for regular users",
      icon: <Star className="h-6 w-6 text-red-600" />,
      color: "border-red-500",
      buttonColor: "bg-red-500 hover:bg-red-600",
      popular: true
    },
    {
      name: "High Volume",
      credits: 300,
      price: "$19.99",
      description: "For power users and teams",
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      color: "border-purple-500",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      popular: false
    }
  ];

  const handlePurchase = (packageName: string, credits: number, price: string) => {
    console.log(`Purchasing ${packageName}: ${credits} credits for ${price}`);
    // This will be connected to Stripe later
  };

  return (
    <div className="space-y-6" id="credits">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 gradient-text">Purchase Credits</h2>
        <p className="text-muted-foreground mb-8">
          Buy credits to use our video summarization service. Each video summary costs 1 credit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creditPackages.map((pkg, index) => (
          <Card 
            key={index} 
            className={`${pkg.color} ${pkg.popular ? 'relative scale-105 shadow-lg' : ''} transition-all hover:shadow-md`}
          >
            {pkg.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm text-white">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {pkg.icon}
              </div>
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">{pkg.credits}</span>
                <span className="text-muted-foreground ml-1">credits</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-brand-purple">{pkg.price}</span>
              </div>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="text-center text-sm text-muted-foreground">
                <p>• Instant delivery</p>
                <p>• No expiration</p>
                <p>• Full video summaries</p>
                <p>• Export transcripts</p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className={`w-full text-white ${pkg.buttonColor}`}
                onClick={() => handlePurchase(pkg.name, pkg.credits, pkg.price)}
              >
                Purchase {pkg.credits} Credits
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Credits never expire and can be used anytime. Secure payment powered by Stripe.</p>
      </div>
    </div>
  );
};

export default CreditsSection;
