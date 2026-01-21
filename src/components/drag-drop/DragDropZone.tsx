import { useState, useCallback } from "react"
import { Upload, File, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface FileWithPreview extends File {
  preview?: string
}

interface DragDropZoneProps {
  onFilesAdded: (files: File[]) => void
  accept?: string
  maxSize?: number // in bytes
  multiple?: boolean
  className?: string
}

export function DragDropZone({
  onFilesAdded,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = true,
  className,
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FileWithPreview[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File ${file.name} is too large. Max size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`
    }

    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim())
      const fileType = file.type
      const fileName = file.name
      const fileExtension = "." + fileName.split(".").pop()

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExtension === type
        }
        if (type.endsWith("/*")) {
          return fileType.startsWith(type.slice(0, -1))
        }
        return fileType === type
      })

      if (!isAccepted) {
        return `File ${file.name} type not accepted`
      }
    }

    return null
  }

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return

    const newFiles: FileWithPreview[] = []
    const errors: string[] = []

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
      } else {
        const fileWithPreview = file as FileWithPreview
        if (file.type.startsWith("image/")) {
          fileWithPreview.preview = URL.createObjectURL(file)
        }
        newFiles.push(fileWithPreview)
      }
    })

    if (errors.length > 0) {
      console.error("File validation errors:", errors)
      // You can use toast here to show errors
    }

    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
      setFiles(updatedFiles)
      onFilesAdded(updatedFiles)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      processFiles(e.dataTransfer.files)
    },
    [files, multiple]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesAdded(newFiles)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center transition-all",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        <input
          type="file"
          onChange={handleFileInput}
          accept={accept}
          multiple={multiple}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className={cn(
              "rounded-full p-4 transition-colors",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>

          <div>
            <p className="text-lg font-medium">
              {isDragging ? "Drop files here" : "Drag and drop files here"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse
            </p>
          </div>

          {(accept || maxSize) && (
            <div className="text-xs text-muted-foreground space-y-1">
              {accept && <p>Accepted formats: {accept}</p>}
              {maxSize && (
                <p>Max file size: {(maxSize / 1024 / 1024).toFixed(0)}MB</p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                    <File className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
