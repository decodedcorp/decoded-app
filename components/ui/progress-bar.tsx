import { useState, useEffect, useRef } from "react";

function ProgressBar({
  duration,
  currentIndex,
  setCurrentIndex,
  totalItems,
}: {
  duration: number;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  totalItems: number;
}) {
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsedTime = timestamp - startTimeRef.current;
      const newProgress = Math.min((elapsedTime / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [duration, currentIndex]);

  useEffect(() => {
    setProgress(0);
    startTimeRef.current = undefined;
  }, [currentIndex]);

  return (
    <div className="z-10 flex w-full space-x-2 mt-20">
      {Array.from({ length: totalItems }, (_, index) => (
        <div
          key={index}
          className={`h-2 bg-white bg-opacity-20 transition-all duration-300 cursor-pointer ${
            index === currentIndex ? "w-16 rounded-xl" : "w-2 rounded-full"
          }`}
          onClick={() => setCurrentIndex(index)}
        >
          {index === currentIndex && (
            <div
              className="h-full bg-white transition-all duration-300 ease-linear"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProgressBar;
