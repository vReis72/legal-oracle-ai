
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatInputFormProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  isKeyConfigured: boolean;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({
  input,
  setInput,
  handleSendMessage,
  isLoading,
  isKeyConfigured
}) => {
  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
      <div className="flex gap-2 items-end">
        <div className="relative flex-1">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida sobre Direito e clique no ícone de envio ao lado..."
            className="resize-none"
            rows={2}
          />
        </div>
        <Button 
          type="submit" 
          variant="ghost"
          disabled={isLoading || !input.trim() || !isKeyConfigured} 
          className="p-2 hover:bg-transparent flex-shrink-0 transition-all duration-300"
        >
          <Send 
            className={`h-12 w-12 ${isKeyConfigured ? 'text-eco-primary' : 'text-gray-400'} hover:scale-110 transition-transform duration-300 ease-in-out`} 
            strokeWidth={2.5} 
          />
        </Button>
      </div>
      
      {!isKeyConfigured && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            A chave API OpenAI não foi configurada pelo administrador do sistema. Entre em contato com o suporte para configurar o sistema.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default ChatInputForm;
