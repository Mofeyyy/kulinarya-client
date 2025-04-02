import { useState, useRef } from "react";
import { Play } from "lucide-react";

// ----------------------------------------------------------------

const VideoPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-t-lg">
      {/* Video with Blur */}
      <video
        ref={videoRef}
        src={src}
        className={`h-auto w-full rounded-t-lg transition ${
          !isPlaying ? "blur-xs brightness-50" : "blur-0 brightness-100"
        }`}
        controls={isPlaying}
      />

      {/* Play Button */}
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="group absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/10"
        >
          <Play className="group-hover:text-primary size-20 text-white transition-colors" />
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
