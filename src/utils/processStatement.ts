
// This is a mock implementation for the MVP
// In a real implementation, this would connect to an OCR service and AI processing

export interface StatementItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  explanation: string;
}

export interface ProcessedStatement {
  statementDate: string;
  totalAmount: number;
  items: StatementItem[];
}

// Sample processed statement for demo purposes
export const processedStatement: ProcessedStatement = {
  statementDate: "Março 2023",
  totalAmount: 120.40,
  items: [
    {
      id: "1",
      date: "04/03",
      description: "Débito automático: Seguro pessoal",
      amount: 29.90,
      category: "seguro",
      explanation: "Cobrança recorrente do seguro opcional contratado no banco. Você pode cancelar."
    },
    {
      id: "2",
      date: "05/03",
      description: "Tarifa bancária mensal",
      amount: 12.00,
      category: "tarifa",
      explanation: "Taxa de manutenção da sua conta corrente. Confirme com seu banco se você tem direito a isenção desta tarifa."
    },
    {
      id: "3",
      date: "06/03",
      description: "Compra no Market ABC",
      amount: 78.50,
      category: "compra",
      explanation: "Transação de débito feita no supermercado localizado em São Paulo."
    }
  ]
};

// This function would normally process the file using OCR and AI
export const processStatement = async (file: File): Promise<ProcessedStatement> => {
  // In a real implementation, this would:
  // 1. Upload the file to a server for OCR processing
  // 2. Process the extracted text with AI to identify transactions
  // 3. Generate explanations for each transaction
  // 4. Return a structured statement
  
  // For the MVP, we'll simulate a delay and return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(processedStatement);
    }, 2000);
  });
};
