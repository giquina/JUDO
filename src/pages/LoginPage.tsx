import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();
  const { signIn, isAuthenticated, role, isLoading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role && !authLoading) {
      switch (role) {
        case "member":
          navigate("/member");
          break;
        case "coach":
          navigate("/coach");
          break;
        case "admin":
        case "treasurer":
        case "super_admin":
          navigate("/admin");
          break;
        default:
          navigate("/member");
      }
    }
  }, [isAuthenticated, role, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Recommend @bbk.ac.uk for students but allow other emails
    if (!email.endsWith("@bbk.ac.uk")) {
      toast.info("Tip: Use your @bbk.ac.uk email for student access");
    }

    setIsLoading(true);
    toast.loading("Sending magic link...");

    try {
      const result = await signIn(email);
      toast.dismiss();

      if (result.success) {
        toast.success("Magic link sent! Check your inbox.");
        setIsEmailSent(true);
      } else {
        toast.error(result.error || "Failed to send magic link");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to send magic link. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setIsEmailSent(false);
    setEmail("");
  };

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto text-7xl"
              >
                {isEmailSent ? "📧" : "🥋"}
              </motion.div>
              <CardTitle className="text-2xl font-bold">
                {isEmailSent ? "Check your inbox" : "Judo Club Manager"}
              </CardTitle>
              <CardDescription>
                {isEmailSent
                  ? `We sent a magic link to ${email}`
                  : "University of London Judo Club at Birkbeck"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {isEmailSent ? (
                  <motion.div
                    key="email-sent"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">
                          Click the link in the email to sign in. The link will expire in 24 hours.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Didn't receive the email? Check your spam folder or
                        </p>
                        <Button
                          variant="outline"
                          onClick={handleBackToEmail}
                          className="w-full"
                        >
                          Use a different email
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="email-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                          className="h-12"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use your @bbk.ac.uk email for student access
                        </p>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending magic link...
                          </span>
                        ) : (
                          "Continue with Email"
                        )}
                      </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t text-center">
                      <p className="text-sm text-muted-foreground">
                        New to the club?{" "}
                        <a href="#" className="text-primary hover:underline font-medium">
                          Learn more
                        </a>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
