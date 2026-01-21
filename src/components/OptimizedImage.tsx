import { useState } from "react";
import { motion } from "framer-motion";

interface OptimizedImageProps {
  src?: string;
  alt: string;
  category?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * OptimizedImage Component
 *
 * A smart image component that:
 * - Uses Unsplash for placeholder images
 * - Implements lazy loading with blur-up placeholder
 * - Provides responsive images with srcset
 * - Falls back to gradient on error
 * - Supports priority loading for above-fold images
 */
export default function OptimizedImage({
  src,
  alt,
  category = "martial-arts",
  width = 800,
  height = 600,
  className = "",
  priority = false
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate Unsplash URL with specific parameters
  const getUnsplashUrl = (w: number, h: number, quality: number = 80) => {
    if (src) return src;

    // Use Unsplash API with specific dimensions and quality
    const searchQuery = category.replace(/\s+/g, ',');
    return `https://source.unsplash.com/${w}x${h}/?${searchQuery}&q=${quality}`;
  };

  // Generate srcset for responsive images
  const generateSrcSet = () => {
    if (src) {
      return `${src} ${width}w`;
    }

    return [
      `${getUnsplashUrl(Math.round(width * 0.5), Math.round(height * 0.5), 60)} ${Math.round(width * 0.5)}w`,
      `${getUnsplashUrl(width, height, 80)} ${width}w`,
      `${getUnsplashUrl(Math.round(width * 1.5), Math.round(height * 1.5), 90)} ${Math.round(width * 1.5)}w`,
    ].join(', ');
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Gradient fallback
  if (hasError) {
    return (
      <div
        className={`bg-gradient-to-br from-primary/20 via-blue-500/20 to-purple-500/20 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <svg
            className="w-16 h-16 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl"
        >
          <div className="w-full h-full animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>
      )}

      {/* Main image */}
      <motion.img
        src={getUnsplashUrl(width, height)}
        srcSet={generateSrcSet()}
        sizes={`(max-width: 768px) 100vw, ${width}px`}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        initial={{ scale: 1.1 }}
        animate={{ scale: isLoading ? 1.1 : 1 }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
}
