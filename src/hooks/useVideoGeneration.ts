import { useState } from 'react';
import { toast } from 'sonner';

interface VideoGenerationParams {
  imageBase64: string;
  prompt: string;
  duration: 5 | 10;
  cameraFixed: boolean;
}

interface VideoGenerationResult {
  videoUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  generate: (params: VideoGenerationParams) => Promise<string | null>;
}

export const useVideoGeneration = (): VideoGenerationResult => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (params: VideoGenerationParams): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      console.log('Starting video generation...', {
        promptLength: params.prompt.length,
        duration: params.duration,
        cameraFixed: params.cameraFixed,
      });

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
          imageBase64: params.imageBase64,
          duration: params.duration,
          cameraFixed: params.cameraFixed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }
      
      if (!data?.videoUrl) {
        throw new Error('No video URL returned');
      }

      console.log('Video generated successfully:', data.videoUrl);
      setVideoUrl(data.videoUrl);
      toast.success('Video generated successfully!');
      return data.videoUrl;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate video';
      console.error('Video generation error:', errorMessage);
      setError(errorMessage);
      
      // Show appropriate toast based on error type
      if (errorMessage.includes('Rate limit')) {
        toast.error('Too many requests', {
          description: 'Please wait a moment before trying again.',
        });
      } else if (errorMessage.includes('Usage limit') || errorMessage.includes('credits')) {
        toast.error('Usage limit reached', {
          description: 'Please add credits to continue generating videos.',
        });
      } else {
        toast.error('Generation failed', {
          description: errorMessage,
        });
      }
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    videoUrl,
    isGenerating,
    error,
    generate,
  };
};
