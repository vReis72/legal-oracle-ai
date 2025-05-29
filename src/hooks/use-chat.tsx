
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, sendChatMessage } from '@/services/chatService';
import { useApiKey } from '@/hooks/useApiKey';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Olá! Sou o Legal Oracle IA, assistente especializado em direito. 

🔑 **IMPORTANTE**: Para usar o chat, você precisa configurar uma chave OpenAI válida.

📝 **Como obter uma chave**:
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova chave API
3. Configure no arquivo src/constants/apiKeys.ts

Como posso ajudar você hoje?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { isConfigured } = useApiKey();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Iniciando envio...');
      
      const conversationHistory: ChatMessage[] = [
        {
          id: 'system',
          role: 'system',
          content: 'Você é um assistente especializado em direito brasileiro. Forneça respostas precisas e concisas sobre legislação, jurisprudência e consultas relacionadas ao direito. Cite leis, decisões judiciais e documentos pertinentes quando possível.',
          timestamp: new Date()
        },
        ...messages.slice(-6),
        userMessage
      ];
      
      const assistantResponse = await sendChatMessage(conversationHistory);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError((error as Error).message || 'Erro ao processar sua pergunta');
      
      toast({
        variant: "destructive",
        title: "Erro no Chat",
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    messagesEndRef,
    handleSendMessage,
    handleRetry,
    isKeyConfigured: isConfigured
  };
};
