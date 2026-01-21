import { motion } from "framer-motion";
import { Image, Video, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyMediaProps {
  onUploadMedia?: () => void;
  filterApplied?: boolean;
  mediaType?: "all" | "images" | "videos";
}

export function EmptyMedia({
  onUploadMedia,
  filterApplied,
  mediaType = "all",
}: EmptyMediaProps) {
  const getTitle = () => {
    if (filterApplied) return "No Media Found";
    switch (mediaType) {
      case "images":
        return "No Images Yet";
      case "videos":
        return "No Videos Yet";
      default:
        return "No Media Yet";
    }
  };

  const getDescription = () => {
    if (filterApplied) {
      return "No media matches your current filters. Try adjusting your search or file type.";
    }
    switch (mediaType) {
      case "images":
        return "Share training photos, event pictures, and memorable moments with your club members.";
      case "videos":
        return "Upload technique demonstrations, training clips, and event recordings.";
      default:
        return "Build your club's media gallery. Share photos and videos from training sessions, competitions, and special events.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className="relative mb-8"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-2xl" />

        {/* Icon Container */}
        <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 rounded-full border border-cyan-500/20">
          <Image className="w-16 h-16 text-cyan-500" />

          {/* Floating Video Icon */}
          <motion.div
            animate={{
              y: [-5, 5, -5],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-2 -right-2 bg-gradient-to-br from-pink-500 to-rose-500 p-2 rounded-lg shadow-lg"
          >
            <Video className="w-5 h-5 text-white" />
          </motion.div>

          {/* Camera Icon */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-2 -left-2 bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-lg shadow-lg"
          >
            <Camera className="w-5 h-5 text-white" />
          </motion.div>

          {/* Floating Thumbnails */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <div className="absolute top-1/4 left-0 w-3 h-3 bg-cyan-500 rounded-sm opacity-60" />
            <div className="absolute bottom-1/4 right-0 w-2 h-2 bg-blue-500 rounded-sm opacity-60" />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-8 max-w-md"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          {getTitle()}
        </h3>
        <p className="text-muted-foreground">{getDescription()}</p>
      </motion.div>

      {/* Actions */}
      {!filterApplied && onUploadMedia && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button onClick={onUploadMedia} size="lg" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Media
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Camera className="w-4 h-4" />
            Take Photo
          </Button>
        </motion.div>
      )}

      {/* Feature Grid */}
      {!filterApplied && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl text-xs"
        >
          <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/10">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3 mx-auto">
              <Image className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="font-medium mb-1">Photos</div>
            <div className="text-muted-foreground">
              Training sessions and events
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/5 to-rose-500/5 border border-pink-500/10">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-3 mx-auto">
              <Video className="w-5 h-5 text-pink-500" />
            </div>
            <div className="font-medium mb-1">Videos</div>
            <div className="text-muted-foreground">
              Technique demonstrations
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 mx-auto">
              <Camera className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="font-medium mb-1">Instant Capture</div>
            <div className="text-muted-foreground">
              Quick photo capture
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 border border-violet-500/10">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3 mx-auto">
              <Upload className="w-5 h-5 text-violet-500" />
            </div>
            <div className="font-medium mb-1">Easy Upload</div>
            <div className="text-muted-foreground">
              Drag & drop files
            </div>
          </div>
        </motion.div>
      )}

      {/* Gallery Preview Mockup */}
      {!filterApplied && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 grid grid-cols-3 gap-2 max-w-md opacity-20"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="aspect-square rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/10"
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
