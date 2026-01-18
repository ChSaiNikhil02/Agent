import { Wand2 } from 'lucide-react';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  placeholder?: string;
}

const suggestions = [
  "Gentle waves lapping at the shore",
  "Leaves rustling in a soft breeze",
  "Clouds drifting across the sky",
  "Flickering candlelight in a cozy room",
];

export const PromptInput = ({ prompt, onPromptChange, placeholder }: PromptInputProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-primary" />
        Describe the motion
      </label>
      
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={placeholder || "Describe how you want your image to come alive..."}
          className="w-full h-28 px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {prompt.length} / 500
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onPromptChange(suggestion)}
            className="px-3 py-1.5 text-xs rounded-full bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-border/30 transition-all duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
