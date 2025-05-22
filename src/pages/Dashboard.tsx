import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getUserSummaries } from '@/services/supabaseService';
import { getCurrentLang, getLangString } from '@/services/languageService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { VideoSummary } from '@/types/videoSummary';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [summaries, setSummaries] = useState<VideoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const currentLang = getCurrentLang();

  // Check if there are any pending or processing summaries
  const hasProcessingItems = summaries.some(s => s.status === 'pending' || s.status === 'processing');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const fetchSummaries = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const data = await getUserSummaries(user.id);
        setSummaries(data);
      } catch (error) {
        console.error('Error fetching summaries:', error);
        toast.error(getLangString('errorFetchingSummaries', currentLang) || 'Error fetching summaries');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchSummaries();
    }

    // Set up refresh interval based on processing status
    // If there are processing items, refresh more frequently (every 5 seconds)
    // Otherwise, refresh less frequently (every 30 seconds)
    const refreshInterval = setInterval(() => {
      if (user) fetchSummaries();
    }, hasProcessingItems ? 5000 : 30000);

    return () => clearInterval(refreshInterval);
  }, [user, hasProcessingItems]);

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
      <main className="flex-grow container mx-auto px-4 py-8">
        <DashboardContent 
          summaries={summaries} 
          refreshSummaries={fetchSummaries}
          isLoading={isLoading} 
        />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
