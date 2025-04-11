
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExplanationTooltip from './ExplanationTooltip';
import { ShieldCheck, Building, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { processedStatement } from '@/utils/processStatement';

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

  // Toggle explanation visibility
  const toggleExplanation = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (isProcessing) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="h-7 bg-muted rounded w-1/3"></div>
            <div className="h-5 bg-muted rounded w-1/4"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
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
