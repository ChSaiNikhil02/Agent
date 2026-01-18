import { Film, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Film className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              MotionAI
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/20 text-primary uppercase tracking-wide">
                Beta
              </span>
            </h1>
            <p className="text-xs text-muted-foreground">Image to Video Generator</p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">Powered by AI</span>
        </div>
      </div>
    </header>
  );
};
