
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { getCurrentLang, getLangString } from '@/services/languageService';
import { supabase } from "@/integrations/supabase/client";

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
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const currentLang = getCurrentLang();
  
  // We'll fetch the API key from Supabase rather than hardcoding it
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
    setErrorDetails(null); // Clear any previous error details
    
    try {
      console.log("Transcript text length:", transcriptionText?.length || 0);
      console.log("First 50 chars of transcript:", transcriptionText?.substring(0, 50));
      
      // Check if we have enough content
      if (!transcriptionText || transcriptionText.trim().length < 10) {
        console.error('Insufficient transcript content:', transcriptionText);
        throw new Error('Not enough content to analyze');
      }
      
      // Fetch the OpenAI API key from Supabase Edge Function
      // This way we don't expose the API key in the client code
      const { data: apiKeyData, error: apiKeyError } = await supabase.functions.invoke('get-openai-key', {
        body: { action: 'fetch' }
      });
      
      if (apiKeyError || !apiKeyData || !apiKeyData.key) {
        console.error('Error fetching OpenAI API key:', apiKeyError || 'No key returned');
        throw new Error(`Failed to get API key: ${apiKeyError?.message || 'No key returned'}`);
      }
      
      const openAiApiKey = apiKeyData.key;
      console.log("Got API key (first 5 chars):", openAiApiKey.substring(0, 5) + "...");
      
      // Prepare a shorter transcript excerpt for logging
      const transcriptExcerpt = 
        transcriptionText.substring(0, 100) + "..." + 
        (transcriptionText.length > 200 ? transcriptionText.substring(transcriptionText.length - 100) : "");
      
      console.log("Sending request to OpenAI API with transcript excerpt:", transcriptExcerpt);
      console.log("Using model: gpt-4o-mini");
      
      // Prepare message history for context
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
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
            ...messageHistory,
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      // Log detailed response information for debugging
      console.log("OpenAI API response status:", response.status);
      console.log("OpenAI API response status text:", response.statusText);
      
      const responseText = await response.text();
      console.log("OpenAI API response body (first 200 chars):", responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""));
      
      if (!response.ok) {
        const errorMessage = `API request failed with status: ${response.status}. Response: ${responseText.substring(0, 300)}...`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error(`Error parsing API response: ${parseError.message}. Raw response: ${responseText.substring(0, 100)}...`);
      }
      
      console.log('API parsed response:', data);
      
      // Check if the response has the expected structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid API response structure:', data);
        throw new Error(`Invalid API response structure: ${JSON.stringify(data).substring(0, 100)}...`);
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
      
      // Set detailed error information
      const errorMessage = `${error.message || 'Unknown error'}. Please check the console for more details.`;
      setErrorDetails(errorMessage);
      
      toast.error(
        `Error: ${errorMessage.substring(0, 100)}${errorMessage.length > 100 ? '...' : ''}`, 
        { duration: 5000 }
      );
      
      const errorResponseMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `${getLangString('errorProcessingRequest', currentLang)}\n\nTechnical details: ${error.message || 'Unknown error'}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponseMessage]);
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

  // Debug display at the top of the component
  const debugInfo = (
    <div className="mb-2 text-xs text-gray-500 p-2 bg-gray-100 rounded-md">
      <div><strong>Transcript ID:</strong> {transcriptionId}</div>
      <div><strong>Transcript Length:</strong> {transcriptionText?.length || 0} chars</div>
      <div><strong>Messages count:</strong> {messages.length}</div>
      {errorDetails && <div className="text-red-500 mt-1"><strong>Last Error:</strong> {errorDetails}</div>}
    </div>
  );

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-t-lg">
        <CardTitle>{getLangString('chatWithTranscription', currentLang)}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Debug information */}
        {debugInfo}
        
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
