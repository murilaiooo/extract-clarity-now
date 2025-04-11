
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ExportButton = () => {
  const { toast } = useToast();
  
  const handleExport = () => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: "Exportando PDF",
      description: "Seu extrato esclarecido será baixado em breve."
    });
    
    // Simulate download delay for the demo
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: "Extrato esclarecido exportado com sucesso!"
      });
    }, 2000);
  };
  
  return (
    <Button 
      onClick={handleExport}
      className="flex items-center space-x-2"
    >
      <Download className="h-4 w-4" />
      <span>Exportar PDF esclarecido</span>
    </Button>
  );
};

export default ExportButton;
