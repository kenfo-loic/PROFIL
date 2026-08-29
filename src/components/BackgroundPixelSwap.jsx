import { useState, useEffect } from 'react';
import PixelSwap from './PixelSwap';
import './BackgroundPixelSwap.css';

const BackgroundPixelSwap = () => {
  const [active, setActive] = useState(false);

  // Automatically cycle the pixel swap transition periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => !prev);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const firstScene = (
    <div className="bg-scene-1">
      <div className="glowing-orb orb-a"></div>
      <div className="glowing-orb orb-b"></div>
    </div>
  );

  const secondScene = (
    <div className="bg-scene-2">
      <div className="glowing-orb orb-c"></div>
      <div className="glowing-orb orb-d"></div>
    </div>
  );

  return (
    <div className="bg-pixelswap-wrapper">
      <PixelSwap
        firstContent={firstScene}
        secondContent={secondScene}
        active={active}
        onActiveChange={setActive}
        pixelSize={48}
        gap={2}
        pixelRadius={12}
        pixelSpin={15}
        pixelScale={0.25}
        fade={true}
        duration={1600}
        pixelDuration={500}
        pattern="spiral"
        randomness={0.2}
        easing="cubic-bezier(0.22, 1, 0.36, 1)"
        className="bg-pixelswap-container"
        style={{ width: '100vw', height: '100vh' }}
      />
    </div>
  );
};

export default BackgroundPixelSwap;
