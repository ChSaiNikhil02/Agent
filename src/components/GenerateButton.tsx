import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isGenerating: boolean;
}

export const GenerateButton = ({ onClick, disabled, isGenerating }: GenerateButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={`
        w-full py-4 px-6 rounded-xl font-semibold text-base
        flex items-center justify-center gap-3
        transition-all duration-300
        ${disabled || isGenerating
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-primary text-primary-foreground btn-primary-glow hover:brightness-110'
        }
      `}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating Video...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" />
          Generate Video
        </>
      )}
    </button>
  );
};
