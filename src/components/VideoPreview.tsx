import { Play, Download, Loader2, Film } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string | null;
  isGenerating: boolean;
  progress?: number;
}

export const VideoPreview = ({ videoUrl, isGenerating, progress = 0 }: VideoPreviewProps) => {
  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'generated-video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (isGenerating) {
    return (
      <div className="video-preview w-full aspect-video flex flex-col items-center justify-center gap-4 border border-border/30">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-foreground font-medium mb-1">Generating your video</p>
          <p className="text-sm text-muted-foreground">This may take a minute...</p>
        </div>
        {progress > 0 && (
          <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  if (videoUrl) {
    return (
      <div className="video-preview w-full aspect-video relative group border border-primary/20 glow-border">
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          controls
          autoPlay
          loop
          muted
        />
        <button
          onClick={handleDownload}
          className="absolute top-3 right-3 p-2.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
        >
          <Download className="w-4 h-4" />
        </button>
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50">
          <span className="text-xs text-primary font-medium">Generated Video</span>
        </div>
      </div>
    );
  }

  return (
    <div className="video-preview w-full aspect-video flex flex-col items-center justify-center gap-4 border border-border/30">
      <div className="p-4 rounded-2xl bg-muted/30">
        <Play className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-muted-foreground font-medium mb-1">Video preview</p>
        <p className="text-sm text-muted-foreground/70">Your generated video will appear here</p>
      </div>
    </div>
  );
};
