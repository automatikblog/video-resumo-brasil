
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { getCurrentLang, getLangString } from '@/services/languageService';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TranscriptionChatProps {
  transcriptionId: string;
  transcriptionText: string;
}

const TranscriptionChat: React.FC<TranscriptionChatProps> = ({ transcriptionId, transcriptionText }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: getCurrentLang() === 'en-US' ? 
        'Hello! I can answer questions about this transcription. What would you like to know?' : 
        getCurrentLang() === 'es-ES' ?
        '¡Hola! Puedo responder preguntas sobre esta transcripción. ¿Qué te gustaría saber?' :
        'Olá! Posso responder perguntas sobre esta transcrição. O que você gostaria de saber?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const currentLang = getCurrentLang();

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Here we would integrate with an AI model to process the question
    // For now, we'll simulate a response
    setTimeout(() => {
      const response: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: simulateResponse(input, transcriptionText),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  // Simple function to simulate AI responses based on the question and transcription
  const simulateResponse = (question: string, transcription: string): string => {
    // This is a placeholder. In a real implementation, you would use an AI service
    // to generate responses based on the transcription content.
    const lowerQuestion = question.toLowerCase();
    const lowerTranscription = transcription.toLowerCase();
    
    if (lowerQuestion.includes('what') && lowerQuestion.includes('about')) {
      // Try to find a sentence with a keyword from the question
      const keywords = lowerQuestion.split(' ').filter(word => word.length > 4);
      for (const keyword of keywords) {
        if (lowerTranscription.includes(keyword)) {
          const sentences = transcription.split(/[.!?]+/);
          const relevantSentences = sentences.filter(sentence => 
            sentence.toLowerCase().includes(keyword)
          );
          if (relevantSentences.length > 0) {
            return relevantSentences[0].trim() + '.';
          }
        }
      }
    }

    // Default responses based on language
    if (currentLang === 'en-US') {
      return "Based on the transcription, I don't have specific information about that. Could you ask something else about the content?";
    } else if (currentLang === 'es-ES') {
      return "Según la transcripción, no tengo información específica sobre eso. ¿Podrías preguntar algo más sobre el contenido?";
    } else {
      return "Com base na transcrição, não tenho informações específicas sobre isso. Você poderia perguntar algo mais sobre o conteúdo?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-t-lg">
        <CardTitle>{getLangString('chatWithTranscription', currentLang)}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-brand-purple text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                      : 'bg-muted rounded-tl-lg rounded-tr-lg rounded-br-lg'
                  } p-4`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/ai-assistant.png" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder={getLangString('askQuestion', currentLang)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()} 
              className="bg-gradient-to-r from-brand-purple to-brand-blue text-white"
            >
              <Send className="h-4 w-4" />
              <span className="ml-2">{getLangString('send', currentLang)}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptionChat;
