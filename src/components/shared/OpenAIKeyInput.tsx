
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalApiKey } from '@/hooks/globalApiKey/GlobalApiKeyContext';
import { useUserSettings } from '@/hooks/userSettings';
import { Button } from "@/components/ui/button";
import { OpenAIKeyInputProps } from './types/openAIKeyInputTypes';

const OpenAIKeyInput: React.FC<OpenAIKeyInputProps> = ({ 
  onKeySubmit, 
  forceOpen = false, 
  buttonVariant = "outline", 
  buttonSize = "sm" 
}) => {
  const { isAdmin, loading: authLoading } = useAuth();
  const { hasValidGlobalKey, refreshGlobalApiKey, loading: globalLoading } = useGlobalApiKey();
  const { hasValidApiKey, isLoading: settingsLoading } = useUserSettings();

  console.log('🔑 OpenAIKeyInput: Estado atual:', {
    hasValidGlobalKey,
    hasValidUserKey: hasValidApiKey(),
    isAdmin,
    authLoading,
    globalLoading,
    settingsLoading,
    forceOpen
  });

  // Se ainda está carregando, mostrar indicador
  if (authLoading || globalLoading || settingsLoading) {
    return (
      <Alert className="mb-4">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <AlertDescription>
          Carregando configurações da chave API...
        </AlertDescription>
      </Alert>
    );
  }

  // Verifica se há alguma chave válida disponível (global ou do usuário)
  const hasAnyValidKey = hasValidGlobalKey || hasValidApiKey();

  // Se há chave válida e não é forçado, não mostrar nada
  if (hasAnyValidKey && !forceOpen) {
    return null;
  }

  // Se não há chave configurada, mostrar aviso mas PERMITIR uso
  if (!hasAnyValidKey) {
    return (
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>Sistema funcionando sem chave OpenAI configurada.</strong><br />
            {isAdmin ? (
              <>
                Como administrador, você pode configurar a chave API OpenAI global nas 
                <a href="/settings" className="text-eco-primary hover:underline ml-1">
                  configurações administrativas
                </a> para melhorar o desempenho.
              </>
            ) : (
              <>
                O administrador ainda não configurou a chave API OpenAI. 
                O sistema funcionará, mas pode ter limitações.
              </>
            )}
          </div>
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshGlobalApiKey}
              disabled={globalLoading}
            >
              {globalLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Recarregar'}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default OpenAIKeyInput;
