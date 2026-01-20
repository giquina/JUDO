import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

    setIsLoading(true);
    toast.loading("Signing you in...");

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.dismiss();
    toast.success("Welcome to Judo Club!");

    // Redirect based on email
    if (email.includes("coach") || email.includes("admin")) {
      navigate("/admin");
    } else {
      navigate("/member");
    }

    setIsLoading(false);
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
              🥋
            </motion.div>
            <CardTitle className="text-2xl font-bold">Judo Club Manager</CardTitle>
            <CardDescription>
              University of London Judo Club at Birkbeck
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    Signing in...
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
          </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
