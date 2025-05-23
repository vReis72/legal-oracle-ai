
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimpleSearchForm from './SimpleSearchForm';
import AdvancedSearchForm from './AdvancedSearchForm';
import SearchResults from './SearchResults';
import ErrorMessage from './ErrorMessage';
import OpenAIKeyInput from '@/components/shared/OpenAIKeyInput';
import { useJurisprudencia } from '@/hooks/use-jurisprudencia';

const JurisprudenciaSearch: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    advancedQuery,
    setAdvancedQuery,
    isLoading,
    results,
    hasSearched,
    error,
    isKeyConfigured,
    handleSimpleSearch,
    handleAdvancedSearch,
    handleSortByRelevance,
    handleSortByDate,
    setApiKey
  } = useJurisprudencia();

  return (
    <div className="flex flex-col h-full">
      <OpenAIKeyInput 
        onKeySubmit={setApiKey}
        forceOpen={!isKeyConfigured}
      />
      
      <Tabs defaultValue="simples" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simples">Busca Simples</TabsTrigger>
          <TabsTrigger value="avancada">Busca Avançada</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simples">
          <SimpleSearchForm 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSimpleSearch={handleSimpleSearch}
            isLoading={isLoading}
            isKeyConfigured={isKeyConfigured}
          />
        </TabsContent>
        
        <TabsContent value="avancada">
          <AdvancedSearchForm 
            advancedQuery={advancedQuery}
            setAdvancedQuery={setAdvancedQuery}
            handleAdvancedSearch={handleAdvancedSearch}
            isLoading={isLoading}
            isKeyConfigured={isKeyConfigured}
          />
        </TabsContent>
      </Tabs>

      <ErrorMessage error={error} />

      {hasSearched && (
        <SearchResults 
          results={results}
          hasSearched={hasSearched}
          sortByRelevance={handleSortByRelevance}
          sortByDate={handleSortByDate}
        />
      )}
    </div>
  );
};

export default JurisprudenciaSearch;
