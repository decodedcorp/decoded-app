import React, { useState, useEffect } from "react";

function ProgressBar({
  duration,
  currentIndex,
  totalItems,
}: {
  duration: number;
  currentIndex: number;
  totalItems: number;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 100 / (duration / 1000); // 1초마다 증가할 진행률 계산
        }
        return 100;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  return (
    <div
      className="flex progress-bar-container h-1"
      style={{ width: "100%", position: "absolute", top: 0, zIndex: 10 }}
    >
      {Array.from({ length: totalItems }, (_, index) => (
        <div
          className="progress-bar bg-slate-400 m-5 opacity-30"
          style={{
            width: `${100 / totalItems}%`,
            height: "5px",
            position: "relative", // 상위 div를 relative로 설정
          }}
        >
          <div
            className="progress-ba bg-gray-800"
            style={{
              width: `${index === currentIndex ? progress : 0}%`, // 현재 index일 때 progress에 따라 width가 채워지도록 설정
              height: "5px",
              position: "absolute", // 내부 div를 absolute로 설정하여 상위 div에 겹치도록 함
              top: 0,
              left: 0,
              transition: "width 2s ease-in-out",
            }}
          ></div>
        </div>
      ))}
    </div>
  );
}

export default ProgressBar;
