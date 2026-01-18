import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { MotionControls, MotionStyle, Duration } from '@/components/MotionControls';
import { VideoPreview } from '@/components/VideoPreview';
import { GenerateButton } from '@/components/GenerateButton';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { toast } from 'sonner';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [motionStyle, setMotionStyle] = useState<MotionStyle>('dynamic');
  const [duration, setDuration] = useState<Duration>(5);
  
  const { videoUrl, isGenerating, generate } = useVideoGeneration();

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setImageFile(file);
    setSelectedImage(preview);
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedImage(null);
    setImageFile(null);
  }, []);

  const handleGenerate = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    toast.info('Starting video generation...', {
      description: 'This may take a few seconds.',
    });

    await generate({
      imageBase64: selectedImage,
      motionStyle,
      duration,
    });
  };

  const isReadyToGenerate = selectedImage !== null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Transform Images into{' '}
              <span className="text-gradient">Simple Animations</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload any image, choose a motion style, and watch as your static images are brought to life.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Input */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="glass-panel p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Source Image</h3>
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    selectedImage={selectedImage}
                    onClear={handleClearImage}
                  />
                </div>
              </div>

              <div className="glass-panel p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold text-foreground mb-4">Controls</h3>
                <MotionControls
                  motionStyle={motionStyle}
                  onMotionChange={setMotionStyle}
                  duration={duration}
                  onDurationChange={setDuration}
                  cameraFixed={false} // This prop is no longer used but kept for component compatibility
                  onCameraFixedChange={() => {}} // Dummy function
                />
              </div>
            </div>

            {/* Right Column - Output */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Result</h3>
                <VideoPreview
                  videoUrl={videoUrl}
                  isGenerating={isGenerating}
                />
              </div>

              <GenerateButton
                onClick={handleGenerate}
                disabled={!isReadyToGenerate}
                isGenerating={isGenerating}
              />

              {/* Info Card */}
              <div className="glass-panel p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Pro Tips</p>
                  <ul className="space-y-1 text-xs">
                    <li>• High-resolution images produce better results</li>
                    <li>• Choose a motion style to animate your image</li>
                    <li>• Generation is done in your browser and is very fast</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border/30">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>Built with Gemini • Create simple animations in seconds</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
