import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, DollarSign, Share2, Linkedin, Twitter, Check } from "lucide-react";
import { type Job } from "@/lib/jobData";
import { toast } from "sonner";
import JobApplicationForm from "./JobApplicationForm";

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  if (!job) return null;

  const handleShare = (platform: "linkedin" | "twitter" | "copy") => {
    const url = `${window.location.origin}/careers?job=${job.id}`;
    const text = `Check out this opportunity: ${job.title} at JUDO Platform`;

    switch (platform) {
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
        break;
    }
  };

  const handleApplicationSubmit = () => {
    setShowApplicationForm(false);
    onClose();
  };

  if (showApplicationForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit your application
            </DialogDescription>
          </DialogHeader>
          <JobApplicationForm
            job={job}
            onSuccess={handleApplicationSubmit}
            onCancel={() => setShowApplicationForm(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{job.category}</Badge>
                {job.featured && (
                  <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl">{job.title}</DialogTitle>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>{job.salaryRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Job Description */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">About the Role</h3>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Required Qualifications
                </h4>
                <ul className="space-y-2">
                  {job.requirements.required.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Nice to Have
                </h4>
                <ul className="space-y-2">
                  {job.requirements.niceToHave.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Benefits</h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to Apply */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">How to Apply</h3>
            <p className="text-sm text-muted-foreground">
              Ready to join the JUDO team? Click the button below to submit your application.
              We review all applications carefully and will get back to you within 5 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                onClick={() => setShowApplicationForm(true)}
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleShare("copy")}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Share this job:</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("linkedin")}
                className="hover:text-blue-600"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("twitter")}
                className="hover:text-blue-400"
              >
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
