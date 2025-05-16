
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
  
  // API key for OpenAI
  const openAiApiKey = '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';

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
    
    try {
      // Check if we have enough content
      if (!transcriptionText || transcriptionText.trim().length < 10) {
        throw new Error('Not enough content to analyze');
      }
      
      // Call OpenAI API to process the question
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an assistant that answers questions based on the following transcription. 
              Be helpful, concise and provide specific information from the transcription when possible.
              
              TRANSCRIPTION:
              ${transcriptionText}`
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed with status: ' + response.status);
      }

      const data = await response.json();
      
      // Check if the response has the expected structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response structure');
      }
      
      const aiResponse = data.choices[0].message.content || 
        getLangString('errorProcessingRequest', currentLang);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: getLangString('errorProcessingRequest', currentLang) || 
          "Sorry, I had trouble processing your request. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
