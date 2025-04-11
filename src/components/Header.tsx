
import React from 'react';
import { FileQuestion, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header = ({ toggleTheme, isDarkMode }: HeaderProps) => {
  const { toast } = useToast();
  
  const showComingSoon = () => {
    toast({
      title: "Em breve!",
      description: "Esta funcionalidade estará disponível em breve.",
    });
  };

  return (
    <header className="w-full py-4 px-6 bg-background border-b border-border flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <FileQuestion className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-semibold">
          <span className="text-primary">Clareia</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button onClick={showComingSoon} variant="ghost" size="sm">
          Como funciona
        </Button>
        <Button onClick={showComingSoon} variant="ghost" size="sm">
          Preços
        </Button>
        <Button onClick={toggleTheme} variant="ghost" size="icon">
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
