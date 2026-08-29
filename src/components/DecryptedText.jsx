import { useEffect, useState, useRef } from 'react';
import './DecryptedText.css';

const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 15,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*<>{}[]0123456789',
  repeatInterval = 5000,
  className = ''
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);
  const repeatTimeoutRef = useRef(null);

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (repeatTimeoutRef.current) clearTimeout(repeatTimeoutRef.current);

    const chars = Array.from(text);
    const order = chars.map((_, i) => i);
    let iteration = 0;

    intervalRef.current = setInterval(() => {
      setDisplayText(
        chars
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (iteration >= maxIterations) return char;
            if (index < iteration / (maxIterations / chars.length)) {
              return char;
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iteration++;

      if (iteration > maxIterations + chars.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text);

        if (repeatInterval > 0) {
          repeatTimeoutRef.current = setTimeout(() => {
            startAnimation();
          }, repeatInterval);
        }
      }
    }, speed);
  };

  useEffect(() => {
    startAnimation();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (repeatTimeoutRef.current) clearTimeout(repeatTimeoutRef.current);
    };
  }, [text, repeatInterval]);

  return (
    <span
      className={`decrypted-text-react ${className}`}
      onMouseEnter={() => startAnimation()}
    >
      {displayText}
    </span>
  );
};

export default DecryptedText;
