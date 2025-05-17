
import React from 'react';
import { getCurrentLang, getLangString } from '@/services/languageService';

const Features = () => {
  const currentLang = getCurrentLang();
  
  const features = [
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: getLangString('featureSaveTime', currentLang),
      description: getLangString('featureSaveTimeDesc', currentLang)
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: getLangString('featureFastProcessing', currentLang),
      description: getLangString('featureFastProcessingDesc', currentLang)
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: getLangString('featureHighAccuracy', currentLang),
      description: getLangString('featureHighAccuracyDesc', currentLang)
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      title: getLangString('featureCloudAccess', currentLang),
      description: getLangString('featureCloudAccessDesc', currentLang)
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      title: getLangString('featureLanguageSupport', currentLang),
      description: getLangString('featureLanguageSupportDesc', currentLang)
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: getLangString('featurePrivacy', currentLang),
      description: getLangString('featurePrivacyDesc', currentLang)
    }
  ];

  return (
    <section id="recursos" className="section-padding bg-accent/10">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {getLangString('featuresTitle', currentLang)} <span className="gradient-text">{getLangString('features', currentLang)}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {getLangString('featuresSubtitle', currentLang)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:translate-y-[-5px]"
            >
              <div className="mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
