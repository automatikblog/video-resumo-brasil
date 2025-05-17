
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentLang, getLangString } from '@/services/languageService';

const Testimonials = () => {
  const currentLang = getCurrentLang();
  
  const testimonials = [
    {
      content: getLangString('testimonial1Content', currentLang),
      author: getLangString('testimonial1Author', currentLang),
      title: getLangString('testimonial1Title', currentLang),
      avatar: '👩‍⚕️'
    },
    {
      content: getLangString('testimonial2Content', currentLang),
      author: getLangString('testimonial2Author', currentLang),
      title: getLangString('testimonial2Title', currentLang),
      avatar: '👨‍💼'
    },
    {
      content: getLangString('testimonial3Content', currentLang),
      author: getLangString('testimonial3Author', currentLang),
      title: getLangString('testimonial3Title', currentLang),
      avatar: '👩‍💻'
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {getLangString('testimonialTitle', currentLang)} <span className="gradient-text">{getLangString('testimonialTitleHighlight', currentLang)}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {getLangString('testimonialSubtitle', currentLang)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="italic text-muted-foreground mb-6">"{testimonial.content}"</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
