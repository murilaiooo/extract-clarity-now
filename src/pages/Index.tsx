
import React, { useState } from 'react';
import Header from '@/components/Header';
import UploadZone from '@/components/UploadZone';
import StatementViewer from '@/components/StatementViewer';
import VoiceReader from '@/components/VoiceReader';
import ExportButton from '@/components/ExportButton';
import { FileQuestion } from 'lucide-react';
import { processStatement, processedStatement as mockStatement } from '@/utils/processStatement';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedStatement, setProcessedStatement] = useState<typeof mockStatement | undefined>(undefined);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    console.log("Iniciando processamento do arquivo:", file.name);
    try {
      const result = await processStatement(file);
      console.log("Processamento concluído com sucesso:", result);
      setProcessedStatement(result);
    } catch (error) {
      console.error('Erro ao processar extrato:', error);
      // In a real app, we would show an error message here
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-1 container py-8">
        {!processedStatement && !isProcessing ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <FileQuestion className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">Clareia</h1>
              <p className="text-xl text-muted-foreground">
                Você não precisa entender finanças. Só precisa entender seu extrato.
              </p>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Transforme extratos confusos em documentos reorganizados, explicados e visualmente acessíveis.
              </p>
            </div>
            
            <UploadZone onFileUpload={handleFileUpload} />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center">
                <span className="w-4 h-4 mr-2 rounded-full bg-primary/20 flex justify-center items-center">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </span>
                <span>Processamento seguro</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="w-4 h-4 mr-2 rounded-full bg-primary/20 flex justify-center items-center">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </span>
                <span>Explicações claras e acessíveis</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="w-4 h-4 mr-2 rounded-full bg-primary/20 flex justify-center items-center">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </span>
                <span>Leitura em voz alta</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {processedStatement && !isProcessing && (
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Seu extrato esclarecido</h2>
                <ExportButton statementData={processedStatement} />
              </div>
            )}
            
            <StatementViewer 
              statementData={processedStatement}
              isProcessing={isProcessing}
            />
            
            {processedStatement && !isProcessing && (
              <VoiceReader statementData={processedStatement} />
            )}
          </div>
        )}
      </main>
      
      <footer className="py-6 border-t border-border bg-secondary">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Clareia. Todos os direitos reservados.</p>
          <p className="mt-1">Ajudando pessoas a entenderem seus extratos.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
