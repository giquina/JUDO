import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Mail, Phone, MessageSquare, Upload, CheckCircle2 } from "lucide-react";

interface ProfileQuickEditModalProps {
  open: boolean;
  onClose: () => void;
  member: {
    name: string;
    email: string;
    phone?: string;
    emergencyContact?: string;
    bio?: string;
    avatar?: string;
  };
}

export default function ProfileQuickEditModal({
  open,
  onClose,
  member,
}: ProfileQuickEditModalProps) {
  const [formData, setFormData] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone || "",
    emergencyContact: member.emergencyContact || "",
    bio: member.bio || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(member.avatar);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading("Updating profile...");

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.dismiss();
    toast.success("Profile updated successfully!", {
      description: "Your changes have been saved",
      icon: <CheckCircle2 className="h-5 w-5" />,
    });

    setIsLoading(false);
    onClose();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        toast.success("Avatar updated", {
          description: "Don't forget to save your changes",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Quick Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your personal information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={avatarPreview} alt={formData.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <Label htmlFor="avatar" className="cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Avatar
                    </span>
                  </Button>
                </motion.div>
              </Label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@bbk.ac.uk"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+44 7XXX XXXXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency Contact
              </Label>
              <Input
                id="emergency"
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContact: e.target.value })
                }
                placeholder="+44 7XXX XXXXXX"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about your judo journey..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.bio.length}/500 characters
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-blue-600"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
