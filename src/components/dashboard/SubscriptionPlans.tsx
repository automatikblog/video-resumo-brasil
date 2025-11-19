import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Loader2, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentLang, getLangString } from '@/services/languageService';

const subscriptionPlans = [
  {
    id: 'student',
    name: 'Student',
    videos: 10,
    price: '$9',
    pricePerMonth: '/ month',
    description: 'Perfect for students and casual learners',
    popular: false,
    badge: 'Great for beginners',
    icon: Sparkles,
    color: 'blue'
  },
  {
    id: 'pro',
    name: 'Pro',
    videos: 40,
    price: '$19',
    pricePerMonth: '/ month',
    description: 'Best value for content creators & researchers',
    popular: true,
    badge: 'BEST VALUE',
    icon: Zap,
    color: 'purple'
  },
  {
    id: 'master',
    name: 'Master',
    videos: 150,
    price: '$39',
    pricePerMonth: '/ month',
    description: 'For teams, agencies & power users',
    popular: false,
    badge: 'Maximum value',
    icon: Crown,
    color: 'gold'
  }
];

const features = [
  'Transcribe any YouTube video',
  'Automatic AI summary',
  'Full transcript viewer',
  '"Chat with the video"',
  'Export Summary (TXT, Markdown, JSON, HTML)',
  'Export Full Transcript',
  'Store & access all past transcriptions',
  'Clean, simple interface for fast learning'
];

const SubscriptionPlans = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [videosUsed, setVideosUsed] = useState<number>(0);
  const [videosLimit, setVideosLimit] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const currentLang = getCurrentLang();

  useEffect(() => {
    fetchSubscriptionInfo();
    
    // Check for success parameter in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscription') === 'success') {
      toast.success('Subscription activated successfully! Your plan is now active.');
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard#subscription');
    }
  }, [user]);

  const fetchSubscriptionInfo = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_status, monthly_videos_used, monthly_videos_limit')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setCurrentPlan(data.subscription_plan || 'free');
        setSubscriptionStatus(data.subscription_status || 'inactive');
        setVideosUsed(data.monthly_videos_used || 0);
        setVideosLimit(data.monthly_videos_limit || 0);
      }
    } catch (error) {
      console.error('Error fetching subscription info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      toast.error('Please log in to subscribe to a plan');
      return;
    }

    setProcessingPlan(planId);

    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { planType: planId }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating subscription checkout:', error);
      toast.error('Failed to start checkout process. Please try again.');
      setProcessingPlan(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return currentPlan === planId && subscriptionStatus === 'active';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 gradient-text">Choose Your Subscription Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get unlimited access with monthly video limits. All plans include the full feature set.
        </p>
      </div>

      {/* Current Plan Status */}
      {subscriptionStatus === 'active' && currentPlan !== 'free' && (
        <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan Active
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  {videosUsed} / {videosLimit} videos used this month
                </p>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {currentPlan === 'free' && subscriptionStatus === 'inactive' && (
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Free Plan:</strong> You can purchase credits anytime to transcribe videos. 
              Or upgrade to a subscription plan for better value and consistent monthly access!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Subscription Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {subscriptionPlans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = isCurrentPlan(plan.id);
          const isProcessing = processingPlan === plan.id;

          return (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${isCurrent ? 'border-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">{plan.badge}</Badge>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500">Current Plan</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-full bg-${plan.color}-100 dark:bg-${plan.color}-950/20`}>
                    <Icon className={`h-6 w-6 text-${plan.color}-600 dark:text-${plan.color}-400`} />
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.pricePerMonth}</span>
                </div>
                <p className="text-sm font-semibold mt-2 text-primary">
                  {plan.videos} videos / month
                </p>
              </CardHeader>

              <CardContent>
                <Button
                  className="w-full mb-4"
                  variant={isCurrent ? 'outline' : plan.popular ? 'default' : 'outline'}
                  disabled={isCurrent || isProcessing}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    `Select ${plan.name}`
                  )}
                </Button>

                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="grid md:grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
        <div>
          <p className="font-semibold mb-1">Monthly Billing</p>
          <p>Cancel anytime, no commitments</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Secure Payments</p>
          <p>Powered by Stripe</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Need Help?</p>
          <p>Contact support@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
