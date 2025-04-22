import React, { useEffect, useState } from 'react'

const LoadingScreen = () => {
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <PandaLoader />
        </div>
    )
}

export default LoadingScreen


const PandaLoader = () => {
  const [eyeBlink, setEyeBlink] = useState(false);
  const [headTilt, setHeadTilt] = useState(false);

  useEffect(() => {
    // Blinking animation
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 200);
    }, 3000);

    // Head tilt animation
    const tiltInterval = setInterval(() => {
      setHeadTilt(true);
      setTimeout(() => setHeadTilt(false), 500);
    }, 5000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(tiltInterval);
    };
  }, []);

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-500 ${
        headTilt ? "rotate-3" : ""
      }`}
    >
      {/* Panda Body */}
      <circle cx="60" cy="60" r="50" fill="white" />

      {/* Ears */}
      <circle cx="30" cy="30" r="15" fill="black" />
      <circle cx="90" cy="30" r="15" fill="black" />

      {/* Eyes */}
      <ellipse
        cx="45"
        cy="55"
        rx="10"
        ry={eyeBlink ? "1" : "10"}
        fill="black"
        className="transition-all duration-200"
      />
      <ellipse
        cx="75"
        cy="55"
        rx="10"
        ry={eyeBlink ? "1" : "10"}
        fill="black"
        className="transition-all duration-200"
      />

      {/* Eye shine */}
      <circle cx="48" cy="52" r="2" fill="white" />
      <circle cx="78" cy="52" r="2" fill="white" />

      {/* Nose */}
      <ellipse cx="60" cy="70" rx="7" ry="5" fill="black" />

      {/* Mouth */}
      <path
        d="M53 78C56 82 64 82 67 78"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

