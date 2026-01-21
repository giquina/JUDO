import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Edit,
  Share2,
  QrCode,
  Calendar,
  Award,
  TrendingUp,
  Flame,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Copy,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import BeltBadge from "@/components/BeltBadge"
import { ProfileQuickEdit } from "./ProfileQuickEdit"
import { toast } from "sonner"

interface ProfileCardProps {
  className?: string
}

interface ProfileData {
  name: string
  email: string
  profilePhoto?: string
  beltRank: "white" | "yellow" | "orange" | "green" | "blue" | "brown" | "black"
  memberSince: number
  totalSessions: number
  currentStreak: number
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

export function ProfileCard({ className }: ProfileCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  const profile: ProfileData = {
    name: "John Smith",
    email: "john.smith@example.com",
    beltRank: "black",
    memberSince: Date.now() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
    totalSessions: 156,
    currentStreak: 12,
    socialLinks: {
      twitter: "https://twitter.com/johnsmith",
      instagram: "https://instagram.com/johnsmith_judo",
    },
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }

      setIsUploadingPhoto(true)
      setTimeout(() => {
        setIsUploadingPhoto(false)
        toast.success("Profile photo updated")
      }, 1500)
    }
  }

  return (
    <>
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              {/* Profile Photo with Upload Overlay */}
              <div className="group relative">
                <Avatar className="h-20 w-20 ring-2 ring-primary/10">
                  <AvatarImage src={profile.profilePhoto} alt={profile.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-photo-upload"
                  className={cn(
                    "absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100",
                    isUploadingPhoto && "opacity-100"
                  )}
                >
                  {isUploadingPhoto ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Edit className="h-5 w-5 text-white" />
                  )}
                </label>
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <BeltBadge rank={profile.beltRank} />
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    Member since{" "}
                    {new Date(profile.memberSince).toLocaleDateString("en-GB", {
                      month: "short",
                      year: "numeric",
                    })}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setShowEditDialog(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 rounded-lg border bg-muted/50 p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Award className="h-5 w-5 text-primary" />
                {profile.totalSessions}
              </div>
              <p className="text-xs text-muted-foreground">Total Sessions</p>
            </div>
            <div className="border-l border-r text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Flame className="h-5 w-5 text-orange-500" />
                {profile.currentStreak}
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <TrendingUp className="h-5 w-5 text-green-600" />
                94%
              </div>
              <p className="text-xs text-muted-foreground">Attendance</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowQRDialog(true)}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Member QR
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          {/* Social Links */}
          {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
            <div className="flex items-center gap-2 border-t pt-4">
              <p className="text-sm font-medium">Social:</p>
              <div className="flex gap-2">
                {profile.socialLinks.facebook && (
                  <a
                    href={profile.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <ProfileQuickEdit open={showEditDialog} onOpenChange={setShowEditDialog} />

      {/* QR Code Dialog */}
      <QRCodeDialog open={showQRDialog} onOpenChange={setShowQRDialog} profile={profile} />

      {/* Share Profile Dialog */}
      <ShareProfileDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        profile={profile}
      />
    </>
  )
}

function QRCodeDialog({
  open,
  onOpenChange,
  profile,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: ProfileData
}) {
  const memberId = "JC-2024-001234"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Member QR Code</DialogTitle>
          <DialogDescription>
            Use this QR code for quick check-in at sessions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border bg-white p-6">
            {/* Placeholder QR Code */}
            <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-muted">
              <QrCode className="h-32 w-32 text-muted-foreground" />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium">{profile.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{memberId}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Tip:</strong> Save this QR code to your phone's wallet for quick
              access at the dojo. You can also take a screenshot for offline use.
            </p>
          </div>

          <Button className="w-full" onClick={() => toast.success("QR code saved")}>
            Save to Device
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ShareProfileDialog({
  open,
  onOpenChange,
  profile,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: ProfileData
}) {
  const [copied, setCopied] = useState(false)
  const profileUrl = `https://judo-club-app.vercel.app/profile/${profile.email.split("@")[0]}`

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Profile link copied")
  }

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "text-sky-500",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=Check out my Judo profile!`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Profile</DialogTitle>
          <DialogDescription>
            Share your Judo profile with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Link */}
          <div>
            <p className="mb-2 text-sm font-medium">Profile Link</p>
            <div className="flex gap-2">
              <div className="flex-1 rounded-md border bg-muted px-3 py-2">
                <p className="truncate text-sm">{profileUrl}</p>
              </div>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div>
            <p className="mb-3 text-sm font-medium">Share on social media</p>
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-accent"
                >
                  <option.icon className={cn("h-6 w-6", option.color)} />
                  <span className="text-xs font-medium">{option.name}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
