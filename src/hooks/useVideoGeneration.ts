import { useState } from 'react';
import { toast } from 'sonner';
import type { MotionStyle, Duration } from '@/components/MotionControls';

interface VideoGenerationParams {
  imageBase64: string;
  motionStyle: MotionStyle;
  duration: Duration;
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

  const generate = (params: VideoGenerationParams): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const { imageBase64, motionStyle, duration } = params;

      if (!imageBase64) {
        const err = 'No image provided for generation.';
        setError(err);
        toast.error(err);
        return reject(err);
      }

      setIsGenerating(true);
      setError(null);
      setVideoUrl(null);

      const img = new Image();
      img.src = imageBase64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Let's use a fixed resolution for predictability
        const aspectRatio = img.width / img.height;
        canvas.width = 1024;
        canvas.height = 1024 / aspectRatio;
        
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          const err = 'Could not get canvas context.';
          setError(err);
          toast.error(err);
          setIsGenerating(false);
          return reject(err);
        }

        try {
          const stream = canvas.captureStream();
          const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          const chunks: Blob[] = [];

          recorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };

          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
            setIsGenerating(false);
            toast.success('Video generated successfully!');
            resolve(url);
          };

          recorder.onerror = (e) => {
            const err = 'Error during video recording.';
            console.error(e);
            setError(err);
            toast.error(err);
            setIsGenerating(false);
            reject(new Error(err));
          }

          recorder.start();

          let frame = 0;
          const totalFrames = duration * 60; // 60 fps

          const animate = () => {
            if (frame >= totalFrames) {
              recorder.stop();
              return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            const progress = frame / totalFrames;

            // Map MotionControls props to animation logic
            if (motionStyle === 'pan') {
                const pan = (progress - 0.5) * 0.2 * canvas.width;
                ctx.drawImage(img, pan, 0, canvas.width, canvas.height);
            } else if (motionStyle === 'zoom-in') {
                const zoom = 1 + progress * 0.3;
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.scale(zoom, zoom);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } else if (motionStyle === 'zoom-out') {
                const zoom = 1 + progress * 0.3;
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.scale(1 / zoom, 1 / zoom);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } else if (motionStyle === 'orbit') {
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(progress * Math.PI * 0.1);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } else { // Default or 'dynamic'
                const pan = (progress - 0.5) * 0.2 * canvas.width;
                ctx.drawImage(img, pan, 0, canvas.width, canvas.height);
            }

            ctx.restore();
            frame++;
            requestAnimationFrame(animate);
          };

          animate();
        } catch (e) {
          const err = 'Failed to start video generation.';
          console.error(e);
          setError(err);
          toast.error(err);
          setIsGenerating(false);
          reject(e);
        }
      };

      img.onerror = () => {
        const err = 'Failed to load image.';
        setError(err);
        toast.error(err);
        setIsGenerating(false);
        reject(new Error(err));
      }
    });
  };

  return {
    videoUrl,
    isGenerating,
    error,
    generate,
  };
};
