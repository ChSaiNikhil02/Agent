import { useCallback, useState } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export const ImageUploader = ({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelect(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  if (selectedImage) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden glass-panel glow-border">
        <img 
          src={selectedImage} 
          alt="Selected" 
          className="w-full h-full object-cover"
        />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50">
          <span className="text-xs text-muted-foreground font-medium">Source Image</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone w-full aspect-video flex flex-col items-center justify-center gap-4 cursor-pointer ${isDragging ? 'active' : ''}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className={`p-4 rounded-2xl bg-primary/10 border border-primary/20 transition-all duration-300 ${isDragging ? 'scale-110 animate-pulse-glow' : ''}`}>
        {isDragging ? (
          <ImageIcon className="w-8 h-8 text-primary" />
        ) : (
          <Upload className="w-8 h-8 text-primary" />
        )}
      </div>
      
      <div className="text-center">
        <p className="text-foreground font-medium mb-1">
          {isDragging ? 'Drop your image here' : 'Drag & drop an image'}
        </p>
        <p className="text-sm text-muted-foreground">
          or click to browse
        </p>
      </div>
      
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span className="px-2 py-1 rounded bg-secondary/50">PNG</span>
        <span className="px-2 py-1 rounded bg-secondary/50">JPG</span>
        <span className="px-2 py-1 rounded bg-secondary/50">WebP</span>
      </div>
    </div>
  );
};
