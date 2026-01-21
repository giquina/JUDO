import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { type Job } from "@/lib/jobData";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

interface JobApplicationFormProps {
  job: Job;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  cvFile: File | null;
  coverLetter: string;
  demoVideoUrl: string;
  confirmRequirements: boolean;
}

export default function JobApplicationForm({
  job,
  onSuccess,
  onCancel,
}: JobApplicationFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: isAuthenticated && user ? user.name : "",
    email: isAuthenticated && user ? user.email : "",
    phone: "",
    cvFile: null,
    coverLetter: "",
    demoVideoUrl: "",
    confirmRequirements: false,
  });

  const isInstructorRole = job.category === "Instruction";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      // Check file type
      const allowedTypes = [".pdf", ".doc", ".docx"];
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));
      if (!allowedTypes.includes(fileExtension.toLowerCase())) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      setFormData({ ...formData, cvFile: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.cvFile) {
      toast.error("Please upload your CV");
      return;
    }

    if (!formData.coverLetter.trim()) {
      toast.error("Please write a cover letter");
      return;
    }

    if (!formData.confirmRequirements) {
      toast.error("Please confirm you meet the minimum requirements");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In production, this would upload the CV and send the application
    console.log("Application submitted:", {
      job: job.title,
      ...formData,
      cvFileName: formData.cvFile.name,
    });

    setIsSubmitting(false);
    toast.success("Application submitted successfully!", {
      description: "We'll review your application and get back to you soon.",
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Personal Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+44 7700 900000"
            required
          />
        </div>
      </div>

      {/* CV Upload */}
      <div className="space-y-2">
        <Label htmlFor="cv">
          CV/Resume <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-4">
          <Input
            id="cv"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          <Label
            htmlFor="cv"
            className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm">
              {formData.cvFile ? formData.cvFile.name : "Choose file"}
            </span>
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          PDF or Word document, max 5MB
        </p>
      </div>

      {/* Cover Letter */}
      <div className="space-y-2">
        <Label htmlFor="coverLetter">
          Cover Letter <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="coverLetter"
          value={formData.coverLetter}
          onChange={(e) =>
            setFormData({ ...formData, coverLetter: e.target.value })
          }
          placeholder="Tell us why you're a great fit for this role..."
          rows={6}
          required
        />
        <p className="text-xs text-muted-foreground">
          {formData.coverLetter.length} characters
        </p>
      </div>

      {/* Demo Video (Optional for instructor roles) */}
      {isInstructorRole && (
        <div className="space-y-2">
          <Label htmlFor="demoVideo">Demo Video URL (Optional)</Label>
          <Input
            id="demoVideo"
            type="url"
            value={formData.demoVideoUrl}
            onChange={(e) =>
              setFormData({ ...formData, demoVideoUrl: e.target.value })
            }
            placeholder="https://youtube.com/watch?v=..."
          />
          <p className="text-xs text-muted-foreground">
            Link to a video showcasing your teaching or techniques
          </p>
        </div>
      )}

      {/* Confirmation Checkbox */}
      <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50">
        <input
          type="checkbox"
          id="confirm"
          checked={formData.confirmRequirements}
          onChange={(e) =>
            setFormData({ ...formData, confirmRequirements: e.target.checked })
          }
          className="mt-1 h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="confirm" className="cursor-pointer font-normal">
          I confirm that I meet the minimum requirements for this position and
          that all information provided is accurate.
          <span className="text-red-500">*</span>
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  );
}
