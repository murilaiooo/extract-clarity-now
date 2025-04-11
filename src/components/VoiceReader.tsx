
import React, { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { processedStatement } from '@/utils/processStatement';

interface VoiceReaderProps {
  statementData: typeof processedStatement;
}

const VoiceReader = ({ statementData }: VoiceReaderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);
  
  // This would connect to a text-to-speech service in a real implementation
  const playVoiceExplanation = () => {
    if (isPlaying) {
      // Stop playback
      setIsPlaying(false);
      setCurrentItemIndex(-1);
    } else {
      // Start playback
      setIsPlaying(true);
      setCurrentItemIndex(0);
      
      // Simulate reading through items with timeouts
      let index = 0;
      const interval = setInterval(() => {
        if (index < statementData.items.length - 1) {
          index++;
          setCurrentItemIndex(index);
        } else {
          clearInterval(interval);
          setIsPlaying(false);
          setCurrentItemIndex(-1);
        }
      }, 5000); // 5 seconds per item for demo
    }
  };
  
  return (
    <div className="bg-white border rounded-lg p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            onClick={playVoiceExplanation}
            className="h-8 w-8 p-0"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <span className="font-medium text-sm">
            {isPlaying ? "Pausar leitura" : "Ler extrato"}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 w-1/3">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={10}
            className="w-full"
          />
        </div>
      </div>
      
      {isPlaying && currentItemIndex >= 0 && (
        <div className="px-3 py-2 bg-primary/10 rounded text-sm animate-pulse border-l-4 border-primary">
          Lendo: {statementData.items[currentItemIndex].description}
        </div>
      )}
    </div>
  );
};

export default VoiceReader;
