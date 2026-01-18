import { 
  ZoomIn, 
  ZoomOut, 
  MoveHorizontal, 
  RotateCcw,

  Video
} from 'lucide-react';

export type MotionStyle = 'zoom-in' | 'zoom-out' | 'pan' | 'orbit';
export type Duration = 5 | 10;

interface MotionControlsProps {
  motionStyle: MotionStyle;
  onMotionChange: (style: MotionStyle) => void;
  duration: Duration;
  onDurationChange: (duration: Duration) => void;

}

const motionOptions: { value: MotionStyle; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'zoom-in', label: 'Zoom In', icon: <ZoomIn className="w-4 h-4" />, description: 'Push forward' },
  { value: 'zoom-out', label: 'Zoom Out', icon: <ZoomOut className="w-4 h-4" />, description: 'Pull back' },
  { value: 'pan', label: 'Pan', icon: <MoveHorizontal className="w-4 h-4" />, description: 'Side motion' },
  { value: 'orbit', label: 'Orbit', icon: <RotateCcw className="w-4 h-4" />, description: 'Circle around' },

];

export const MotionControls = ({
  motionStyle,
  onMotionChange,
  duration,
  onDurationChange,

}: MotionControlsProps) => {
  return (
    <div className="space-y-6">
      {/* Motion Style */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Video className="w-4 h-4 text-primary" />
          Motion Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {motionOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onMotionChange(option.value)}
              className={`control-chip flex flex-col items-center gap-1.5 py-3 ${
                motionStyle === option.value ? 'active' : ''
              }`}
            >
              {option.icon}
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Duration</label>
        <div className="flex gap-2">
          {[5, 10].map((d) => (
            <button
              key={d}
              onClick={() => onDurationChange(d as Duration)}
              className={`control-chip flex-1 ${duration === d ? 'active' : ''}`}
            >
              {d} seconds
            </button>
          ))}
        </div>
      </div>


    </div>
  );
};
