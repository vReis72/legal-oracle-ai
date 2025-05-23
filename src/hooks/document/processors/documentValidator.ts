
import { Document } from '@/types/document';
import { toast } from "sonner";

/**
 * Valida o documento e a chave API antes do processamento
 */
export const validateDocumentAndApiKey = (
  document: Document,
  apiKey: string,
  setAnalysisError: (value: string | null) => void
): boolean => {
  if (!document || !document.id) {
    toast.error("Documento inválido");
    return false;
  }
  
  if (!document.content) {
    toast.error("Documento sem conteúdo para análise");
    setAnalysisError("Documento não contém texto para análise. Verifique o arquivo.");
    return false;
  }

  if (document.content.trim().length < 50) {
    toast.error("Texto do documento é muito curto para uma análise significativa");
    setAnalysisError("Conteúdo do documento insuficiente para análise (menos de 50 caracteres).");
    return false;
  }

  if (!apiKey) {
    setAnalysisError("Chave da API OpenAI não configurada. Configure nas configurações.");
    toast.error("Chave da API OpenAI não configurada");
    return false;
  }

  return true;
};
