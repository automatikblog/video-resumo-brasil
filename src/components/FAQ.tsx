
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCurrentLang, getLangString } from '@/services/languageService';

const FAQ = () => {
  const currentLang = getCurrentLang();

  const faqs = [
    {
      question: getLangString('faqQuestion1', currentLang),
      answer: getLangString('faqAnswer1', currentLang)
    },
    {
      question: getLangString('faqQuestion2', currentLang),
      answer: getLangString('faqAnswer2', currentLang)
    },
    {
      question: getLangString('faqQuestion3', currentLang),
      answer: getLangString('faqAnswer3', currentLang)
    },
    {
      question: getLangString('faqQuestion4', currentLang),
      answer: getLangString('faqAnswer4', currentLang)
    },
    {
      question: getLangString('faqQuestion5', currentLang),
      answer: getLangString('faqAnswer5', currentLang)
    },
    {
      question: getLangString('faqQuestion6', currentLang),
      answer: getLangString('faqAnswer6', currentLang)
    },
    {
      question: getLangString('faqQuestion7', currentLang),
      answer: getLangString('faqAnswer7', currentLang)
    },
    {
      question: getLangString('faqQuestion8', currentLang),
      answer: getLangString('faqAnswer8', currentLang)
    }
  ];

  return (
    <section id="faq" className="section-padding bg-accent/10">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">{getLangString('faqTitle', currentLang)}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {getLangString('faqSubtitle', currentLang)}
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-border/50 overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="px-6 py-4 hover:bg-accent/20 transition-colors text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
