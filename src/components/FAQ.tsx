
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: 'Quais idiomas são suportados?',
    answer: 'Atualmente, nossa ferramenta suporta vídeos em Português (Brasil), Inglês, Espanhol e Francês. Estamos trabalhando para adicionar mais idiomas em breve.'
  },
  {
    question: 'Existe limite de duração para os vídeos?',
    answer: 'O plano gratuito permite resumir vídeos de até 10 minutos. Os planos pagos permitem resumir vídeos de até 3 horas, dependendo do plano assinado.'
  },
  {
    question: 'Como meus dados são protegidos?',
    answer: 'Valorizamos sua privacidade. Não armazenamos o conteúdo dos vídeos processados e todos os resumos gerados são excluídos após 7 dias. Para mais detalhes, consulte nossa Política de Privacidade.'
  },
  {
    question: 'Posso usar a ferramenta em dispositivos móveis?',
    answer: 'Sim! Nossa ferramenta é totalmente responsiva e funciona em qualquer dispositivo com acesso à internet, incluindo smartphones e tablets.'
  },
  {
    question: 'Os resumos são gerados por IA?',
    answer: 'Sim, utilizamos tecnologia avançada de Inteligência Artificial para analisar o conteúdo dos vídeos e gerar resumos concisos e precisos.'
  },
  {
    question: 'É possível salvar os resumos gerados?',
    answer: 'Sim, os usuários cadastrados podem salvar e acessar seus resumos a qualquer momento na área de usuário. Os resumos ficam disponíveis por 30 dias nos planos gratuitos e permanentemente nos planos premium.'
  },
  {
    question: 'Quantos resumos posso gerar por dia?',
    answer: 'O plano gratuito permite gerar até 3 resumos por dia. Os planos pagos oferecem entre 30 e resumos ilimitados por dia, dependendo do plano escolhido.'
  },
  {
    question: 'Funciona com vídeos privados ou não listados?',
    answer: 'No momento, nossa ferramenta funciona apenas com vídeos públicos do YouTube. Não é possível processar vídeos privados ou que exijam login para visualização.'
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="section-padding bg-accent/10">
      <div className="container-width">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Encontre respostas para as dúvidas mais comuns sobre nossa ferramenta.
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
