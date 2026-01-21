import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  Upload,
  Eye,
  EyeOff,
  AlertTriangle,
  Bell,
  Lock,
  Trash2,
  Shield,
  Save,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ProfileQuickEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ProfileFormData {
  name: string
  email: string
  phone: string
  emergencyContact: string
  bio: string
  profilePhoto: string
}

interface PreferencesData {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  profileVisibility: "public" | "members" | "private"
  showBeltRank: boolean
  showAttendanceStats: boolean
}

export function ProfileQuickEdit({
  open,
  onOpenChange,
}: ProfileQuickEditProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+44 7700 900123",
    emergencyContact: "+44 7700 900456",
    bio: "Black belt judoka with 10 years of experience. Passionate about teaching and competing.",
    profilePhoto: "",
  })

  const [preferences, setPreferences] = useState<PreferencesData>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    profileVisibility: "members",
    showBeltRank: true,
    showAttendanceStats: true,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^\+?[\d\s-()]+$/
    return phone.length >= 10 && re.test(phone)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {}

    // Validate personal info
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number"
    }

    if (formData.emergencyContact && !validatePhone(formData.emergencyContact)) {
      newErrors.emergencyContact = "Invalid emergency contact number"
    }

    // Validate password change if attempted
    if (passwordData.currentPassword || passwordData.newPassword) {
      if (!passwordData.currentPassword) {
        newErrors.currentPassword = "Current password is required"
      }
      if (!validatePassword(passwordData.newPassword)) {
        newErrors.newPassword = "Password must be at least 8 characters"
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsSaving(true)
      setTimeout(() => {
        setIsSaving(false)
        onOpenChange(false)
        toast.success("Profile updated successfully")
      }, 1500)
    } else {
      toast.error("Please fix the errors in the form")
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }

      // In a real app, you'd upload to a server here
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({ ...formData, profilePhoto: e.target?.result as string })
        toast.success("Profile photo updated")
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and preferences
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4">
              {/* Profile Photo */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.profilePhoto} alt={formData.name} />
                  <AvatarFallback className="text-lg">
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </div>
                  </Label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Personal Details */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={cn("pl-9", errors.name && "border-destructive")}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={cn("pl-9", errors.email && "border-destructive")}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={cn("pl-9", errors.phone && "border-destructive")}
                      placeholder="+44 7700 900000"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="emergency"
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyContact: e.target.value,
                        })
                      }
                      className={cn(
                        "pl-9",
                        errors.emergencyContact && "border-destructive"
                      )}
                      placeholder="+44 7700 900000"
                    />
                  </div>
                  {errors.emergencyContact && (
                    <p className="text-xs text-destructive">
                      {errors.emergencyContact}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </h4>
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            emailNotifications: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">SMS Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Get text message alerts
                        </p>
                      </div>
                      <Switch
                        checked={preferences.smsNotifications}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            smsNotifications: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Push Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Browser and mobile push alerts
                        </p>
                      </div>
                      <Switch
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            pushNotifications: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    Privacy
                  </h4>
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Belt Rank</p>
                        <p className="text-xs text-muted-foreground">
                          Display your belt rank on profile
                        </p>
                      </div>
                      <Switch
                        checked={preferences.showBeltRank}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, showBeltRank: checked })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Show Attendance Stats
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Make your training stats visible
                        </p>
                      </div>
                      <Switch
                        checked={preferences.showAttendanceStats}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            showAttendanceStats: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </h4>
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className={cn(
                            "pr-10",
                            errors.currentPassword && "border-destructive"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-xs text-destructive">
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className={cn(
                            "pr-10",
                            errors.newPassword && "border-destructive"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-xs text-destructive">
                          {errors.newPassword}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Minimum 8 characters
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className={cn(
                            "pr-10",
                            errors.confirmPassword && "border-destructive"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-destructive">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Danger Zone
                  </h4>
                  <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">Delete Account</p>
                        <p className="text-xs text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  This action cannot be undone
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium">
              Deleting your account will permanently remove:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Your profile and personal information</li>
              <li>• Your belt rank progression and achievements</li>
              <li>• Your training history and attendance records</li>
              <li>• Your subscription and payment history</li>
            </ul>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast.error("Account deletion is not available in demo mode")
                setShowDeleteDialog(false)
              }}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
