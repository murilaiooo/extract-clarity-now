
// This file contains the logic to process statements using Google's Gemini API

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

// Sample processed statement for testing purposes
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

// Extract text from PDF or image file
const extractTextFromFile = async (file: File): Promise<string> => {
  // For PDF files
  if (file.type === 'application/pdf') {
    // In a real implementation, you would use a PDF parsing library
    // This is a simplified version that just returns the file name for demo
    return `Extrato bancário do mês (PDF): ${file.name}`;
  } 
  
  // For image files
  else if (file.type.startsWith('image/')) {
    // In a real implementation, you would use OCR here
    return `Extrato bancário do mês (Imagem): ${file.name}`;
  }
  
  // For text files or other formats
  else {
    const text = await file.text();
    return text || `Extrato bancário: ${file.name}`;
  }
};

// This function processes the uploaded statement file with Gemini API
export const processStatement = async (file: File): Promise<ProcessedStatement> => {
  console.log("Processando arquivo:", file.name);
  
  try {
    // Extract text from the file
    const extractedText = await extractTextFromFile(file);
    console.log("Texto extraído do documento:", extractedText);
    
    // Process the extracted text with Gemini API - no simulations
    const processedData = await processWithGeminiAPI(extractedText);
    console.log("Dados processados pelo Gemini API:", processedData);
    
    return processedData;
  } catch (error) {
    console.error("Erro ao processar arquivo:", error);
    throw error; // Propagate error up so UI can handle it
  }
};

// Implementation of Gemini API processing
const processWithGeminiAPI = async (text: string): Promise<ProcessedStatement> => {
  try {
    const apiKey = "AIzaSyDUfcEQL1J_wCxRqBPJR2wVwcxSn_wRegU";
    console.log("Conectando à API Gemini com a chave:", apiKey);
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analise o seguinte extrato financeiro e transforme-o em um formato estruturado. 
                   Para cada transação, identifique: a data, a descrição original, o valor, uma categoria 
                   apropriada, e forneça uma explicação clara e simplificada do que significa esta transação. 
                   Caso identifique tarifas bancárias ou cobranças que poderiam ser evitadas, destaque isso 
                   na explicação. Retorne os dados no seguinte formato JSON:
                   {
                     "statementDate": "Mês e Ano do Extrato",
                     "totalAmount": valor total,
                     "items": [
                       {
                         "id": "1",
                         "date": "data no formato DD/MM",
                         "description": "descrição clara",
                         "amount": valor numérico,
                         "category": "categoria",
                         "explanation": "explicação simples e didática"
                       },
                       ...
                     ]
                   }
                   
                   Extrato para análise:
                   ${text}`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API Gemini: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Resposta completa da API Gemini:", data);
    
    // Parse the response text to extract the JSON
    const responseText = data.candidates[0].content.parts[0].text;
    console.log("Texto da resposta:", responseText);
    
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/\{[\s\S]*\}/);
                     
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[0];
      console.log("JSON extraído:", jsonString);
      
      const parsedData = JSON.parse(jsonString);
      return parsedData as ProcessedStatement;
    }
    
    throw new Error('Não foi possível extrair dados estruturados da resposta da API');
  } catch (error) {
    console.error('Erro ao processar com a API Gemini:', error);
    throw error;
  }
};
