
import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
}

const UploadZone = ({ onFileUpload }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Formato não suportado",
        description: "Por favor, envie um arquivo PDF, JPG ou PNG.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    toast({
      title: "Arquivo selecionado",
      description: `${file.name} foi selecionado.`
    });
  };
  
  const removeFile = () => {
    setSelectedFile(null);
  };
  
  const processFile = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors text-center ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <>
                <div className="flex justify-center mb-4">
                  <Upload className="h-10 w-10 text-primary/70" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Arraste e solte seu extrato aqui
                </h3>
                <p className="text-muted-foreground mb-4">
                  Suportamos PDF, JPG ou PNG (máximo 10MB)
                </p>
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button>
                      Selecionar arquivo
                    </Button>
                    <input 
                      id="file-upload" 
                      type="file"
                      className="sr-only"
                      onChange={handleFileInput}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
              </>
            ) : (
              <div className="py-2">
                <div className="flex items-center justify-between p-3 border rounded-lg mb-4 bg-secondary/30">
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm font-medium truncate max-w-[230px]">
                      {selectedFile.name}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={removeFile} 
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={processFile} className="w-full">
                  Esclarecer extrato
                </Button>
              </div>
            )}
          </div>
          {!selectedFile && (
            <div className="mt-4">
              <p className="text-xs text-center text-muted-foreground">
                Seus arquivos são processados e excluídos automaticamente.
                <br />Não armazenamos nenhuma informação financeira.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadZone;
