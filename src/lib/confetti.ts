import confetti from "canvas-confetti";

/**
 * Confetti celebration system for JUDO app
 * Triggers on achievements, streaks, and belt promotions
 */

// Default confetti
export const celebrate = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

// Achievement unlocked
export const achievementConfetti = () => {
  const duration = 2000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

// Streak milestone
export const streakConfetti = (streak: number) => {
  const colors = ["#FF6B00", "#FFB800", "#FF4500"]; // Fire colors

  confetti({
    particleCount: streak * 2,
    spread: 100,
    origin: { y: 0.6 },
    colors,
    scalar: 1.2,
  });
};

// Belt promotion - color based on belt
export const beltPromotionConfetti = (beltColor: string) => {
  const beltColors: Record<string, string[]> = {
    white: ["#FFFFFF", "#F5F5F5"],
    yellow: ["#FFD700", "#FFA500"],
    orange: ["#FF8C00", "#FF6347"],
    green: ["#32CD32", "#228B22"],
    blue: ["#4169E1", "#1E90FF"],
    brown: ["#8B4513", "#A0522D"],
    black: ["#000000", "#2F2F2F"],
  };

  const colors = beltColors[beltColor.toLowerCase()] || ["#FFD700", "#FFA500"];

  // Fireworks effect
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors,
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

// Goal completed
export const goalConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 60,
    origin: { y: 0.8 },
    colors: ["#10b981", "#34d399", "#6ee7b7"],
    scalar: 1.2,
  });
};

// Class booking confirmed
export const bookingConfetti = () => {
  confetti({
    particleCount: 50,
    spread: 40,
    origin: { y: 0.5 },
    colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
  });
};

// Custom confetti with specific colors
export const customConfetti = (colors: string[], particleCount = 100) => {
  confetti({
    particleCount,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  });
};

// Continuous confetti (for major celebrations)
export const continuousConfetti = (duration: number = 3000) => {
  const animationEnd = Date.now() + duration;

  const interval: any = setInterval(() => {
    if (Date.now() > animationEnd) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });

    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
  }, 50);
};
