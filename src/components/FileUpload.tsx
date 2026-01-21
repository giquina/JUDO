import { useState } from "react"
import { DragDropZone } from "./drag-drop/DragDropZone"
import { Progress } from "./ui/progress"
import { CheckCircle2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface FileUploadProps {
  accept?: string
  maxSize?: number
  multiple?: boolean
  onUploadComplete?: (files: File[]) => void
  className?: string
}

interface UploadingFile {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
}

export function FileUpload({
  accept,
  maxSize,
  multiple = true,
  onUploadComplete,
  className,
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const simulateUpload = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          resolve()
        }

        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? { ...f, progress: Math.min(progress, 100) }
              : f
          )
        )
      }, 200)
    })
  }

  const handleFilesAdded = async (files: File[]) => {
    if (files.length === 0) return

    setIsUploading(true)
    const newUploadingFiles = files.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }))
    setUploadingFiles(newUploadingFiles)

    // Simulate upload for each file
    try {
      await Promise.all(files.map((file) => simulateUpload(file)))

      setUploadingFiles((prev) =>
        prev.map((f) => ({ ...f, status: "completed" as const }))
      )

      toast.success(
        `Successfully uploaded ${files.length} ${files.length === 1 ? "file" : "files"}`
      )

      onUploadComplete?.(files)

      // Clear after 2 seconds
      setTimeout(() => {
        setUploadingFiles([])
        setIsUploading(false)
      }, 2000)
    } catch (error) {
      toast.error("Upload failed")
      setUploadingFiles((prev) =>
        prev.map((f) => ({ ...f, status: "error" as const }))
      )
      setIsUploading(false)
    }
  }

  return (
    <div className={className}>
      <DragDropZone
        onFilesAdded={handleFilesAdded}
        accept={accept}
        maxSize={maxSize}
        multiple={multiple}
      />

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <h3 className="text-sm font-medium">
            {isUploading ? "Uploading..." : "Upload Complete"}
          </h3>
          <AnimatePresence>
            {uploadingFiles.map((uploadingFile, index) => (
              <motion.div
                key={`${uploadingFile.file.name}-${index}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="space-y-2 rounded-lg border bg-card p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate flex-1">
                    {uploadingFile.file.name}
                  </p>
                  {uploadingFile.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {uploadingFile.status === "completed" && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>

                <Progress value={uploadingFile.progress} />

                <p className="text-xs text-muted-foreground">
                  {uploadingFile.progress.toFixed(0)}% •{" "}
                  {(uploadingFile.file.size / 1024).toFixed(2)} KB
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
