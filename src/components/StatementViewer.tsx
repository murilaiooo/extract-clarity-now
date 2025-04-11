
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExplanationTooltip from './ExplanationTooltip';
import { ShieldCheck, Building, ShoppingBag, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { processedStatement } from '@/utils/processStatement';
import { Progress } from '@/components/ui/progress';

interface StatementViewerProps {
  statementData?: typeof processedStatement;
  isProcessing: boolean;
}

const getIconForCategory = (category: string) => {
  switch (category) {
    case 'seguro':
      return <ShieldCheck className="h-5 w-5 text-blue-500" />;
    case 'tarifa':
      return <Building className="h-5 w-5 text-amber-500" />;
    case 'compra':
      return <ShoppingBag className="h-5 w-5 text-emerald-500" />;
    default:
      return <div className="w-5 h-5 bg-gray-200 rounded-full" />;
  }
};

const StatementViewer = ({ statementData, isProcessing }: StatementViewerProps) => {
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            return prevProgress;
          }
          return prevProgress + 5;
        });
      }, 500);

      return () => {
        clearInterval(timer);
        setProgress(0);
      };
    }
  }, [isProcessing]);

  // Toggle explanation visibility
  const toggleExplanation = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (isProcessing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div>Analisando seu documento</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 relative">
              <Loader className="h-12 w-12 text-primary animate-spin" />
            </div>
            <h3 className="text-xl font-medium mb-2">Processando seu extrato</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Estamos analisando seu documento e identificando os itens para torná-los mais claros e compreensíveis.
            </p>
            <div className="w-full max-w-md">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">Por favor, aguarde alguns instantes...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!statementData) {
    return null;
  }

  return (
    <Card className="w-full mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>Extrato Esclarecido</div>
          <div className="text-sm font-normal text-muted-foreground">
            {statementData.statementDate}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {statementData.items.map((item) => (
          <div key={item.id} className="statement-item">
            <div className="mr-3 mt-1">{getIconForCategory(item.category)}</div>
            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{item.date}</span>
                    <span className="text-muted-foreground mx-2">–</span>
                    <span>{item.description}</span>
                    <ExplanationTooltip explanation={item.explanation} />
                  </div>
                  <div 
                    className={cn("explanation-text overflow-hidden transition-all", {
                      "h-0 opacity-0": !expandedItems[item.id],
                      "h-auto opacity-100 mt-2": expandedItems[item.id]
                    })}
                  >
                    {item.explanation}
                  </div>
                </div>
                <div className="font-semibold whitespace-nowrap">
                  R$ {item.amount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StatementViewer;
