import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "./OptimizedImage";

interface GalleryImage {
  id: string;
  category: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

/**
 * ImageGallery Component
 *
 * Features:
 * - Masonry layout on mobile
 * - Grid layout on desktop
 * - Lightbox for fullscreen view
 * - Categories filter
 * - Load more functionality
 */
export default function ImageGallery({
  images,
  columns = { mobile: 2, tablet: 3, desktop: 4 }
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(8);

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(images.map(img => img.category)))];

  // Filter images by category
  const filteredImages = selectedCategory === "all"
    ? images
    : images.filter(img => img.category === selectedCategory);

  // Get visible images
  const visibleImages = filteredImages.slice(0, visibleCount);
  const hasMore = visibleCount < filteredImages.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, filteredImages.length));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(8);
  };

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <motion.div
        layout
        className={`grid gap-4
          grid-cols-${columns.mobile}
          md:grid-cols-${columns.tablet}
          lg:grid-cols-${columns.desktop}
        `}
      >
        {visibleImages.map((image, index) => (
          <motion.div
            key={image.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
            onClick={() => setSelectedImage(image)}
          >
            <OptimizedImage
              category={image.category}
              alt={image.alt}
              width={image.width || 400}
              height={image.height || 400}
              className="w-full h-full transition-transform duration-300 group-hover:scale-110"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Badge variant="secondary" className="backdrop-blur-sm capitalize">
                  {image.category}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="min-w-[200px]"
          >
            Load More
          </Button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                category={selectedImage.category}
                alt={selectedImage.alt}
                width={1200}
                height={900}
                className="w-full h-full rounded-lg"
                priority
              />
              <div className="mt-4 text-center">
                <p className="text-white text-lg">{selectedImage.alt}</p>
                <Badge variant="secondary" className="mt-2 capitalize">
                  {selectedImage.category}
                </Badge>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
