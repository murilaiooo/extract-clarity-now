import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ProcessedStatement } from '@/utils/processStatement';
import jsPDF from 'jspdf';
// Import and register the autotable plugin
import 'jspdf-autotable';

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

    toast({
      title: "Exportando PDF",
      description: "Seu extrato esclarecido será baixado em breve."
    });
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(`EXTRATO ESCLARECIDO - ${statementData.statementDate}`, 14, 20);
      
      // Add subtitle with date
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
      
      // Prepare data for table
      const tableData = statementData.items.map(item => [
        item.date,
        item.description,
        `R$ ${item.amount.toFixed(2)}`,
        item.explanation
      ]);
      
      // Add table with statement data using autoTable plugin
      doc.autoTable({
        startY: 40,
        head: [['Data', 'Descrição', 'Valor', 'Explicação']],
        body: tableData,
        theme: 'striped',
        headStyles: { 
          fillColor: [155, 135, 245],
          textColor: [255, 255, 255],
          fontSize: 12
        },
        alternateRowStyles: {
          fillColor: [240, 240, 250]
        },
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 50 },
          2: { cellWidth: 25 },
          3: { cellWidth: 95 }
        }
      });
      
      // Get the final Y position after the table
      const finalY = doc.lastAutoTable.finalY;
      
      // Add total at the bottom
      doc.setFont("helvetica", "bold");
      doc.text(
        `Total: R$ ${statementData.totalAmount.toFixed(2)}`,
        14, finalY + 15
      );
      
      // Add footer with app information
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text(
        "Documento gerado por Clareia - Entenda seu extrato com simplicidade",
        14, doc.internal.pageSize.height - 10
      );
      
      // Save the PDF with a proper name
      doc.save(`extrato-esclarecido-${statementData.statementDate.replace(/\s/g, '-').toLowerCase()}.pdf`);
      
      toast({
        title: "Exportação concluída",
        description: "Extrato esclarecido exportado com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um problema ao gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    }
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
