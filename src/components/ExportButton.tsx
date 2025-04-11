
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ProcessedStatement } from '@/utils/processStatement';

interface ExportButtonProps {
  statementData: ProcessedStatement | undefined;
}

const ExportButton = ({ statementData }: ExportButtonProps) => {
  const { toast } = useToast();
  
  const handleExport = () => {
    if (!statementData) {
      toast({
        title: "Erro de exportação",
        description: "Nenhum dado disponível para exportar.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would generate and download a PDF
    toast({
      title: "Exportando PDF",
      description: "Seu extrato esclarecido será baixado em breve."
    });
    
    // Generate PDF content (in a real app, we would use a PDF library)
    const content = `
      EXTRATO ESCLARECIDO - ${statementData.statementDate}
      
      ${statementData.items.map(item => 
        `${item.date} - ${item.description} - R$ ${item.amount.toFixed(2)}
         Explicação: ${item.explanation}
        `
      ).join('\n\n')}
      
      Total: R$ ${statementData.totalAmount.toFixed(2)}
    `;
    
    // Create a blob and download it
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extrato-esclarecido-${statementData.statementDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Extrato esclarecido exportado com sucesso!"
    });
  };
  
  return (
    <Button 
      onClick={handleExport}
      className="flex items-center space-x-2"
      disabled={!statementData}
    >
      <Download className="h-4 w-4" />
      <span>Exportar PDF esclarecido</span>
    </Button>
  );
};

export default ExportButton;
