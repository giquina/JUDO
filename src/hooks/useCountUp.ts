import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
  isInView?: boolean;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  decimals = 0,
  suffix = '',
  prefix = '',
  separator = ',',
  isInView = true
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Only start once and when in view
    if (!isInView || hasStarted) return;

    setHasStarted(true);

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const progress = Math.min((currentTime - startTimeRef.current) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = start + (end - start) * easeOut;

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end on exact value
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [start, end, duration, isInView, hasStarted]);

  // Format the number with separators
  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    const decimalPart = parts[1] ? `.${parts[1]}` : '';

    return `${prefix}${integerPart}${decimalPart}${suffix}`;
  };

  return formatNumber(count);
}
