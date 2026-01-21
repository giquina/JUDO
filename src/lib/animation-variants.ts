// Reusable Framer Motion animation variants

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0
    }
  }
};

export const flipCard = {
  front: {
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  },
  back: {
    rotateY: 180,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

export const hoverLift = {
  rest: { y: 0 },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

export const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const rotateAnimation = {
  rotate: [0, 5, -5, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};
