import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "../lib/auth";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// Floating shapes for background animation
function FloatingShape({ delay, duration, size, color, startX, startY }: {
  delay: number;
  duration: number;
  size: number;
  color: string;
  startX: number;
  startY: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 blur-xl ${color}`}
      style={{
        width: size,
        height: size,
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -40, 20, -10, 0],
        scale: [1, 1.2, 0.9, 1.1, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  );
}

// Animated background component
function AnimatedBackground() {
  const shapes = useMemo(() => [
    { delay: 0, duration: 20, size: 300, color: "bg-primary", startX: 10, startY: 20 },
    { delay: 2, duration: 25, size: 250, color: "bg-blue-500", startX: 70, startY: 10 },
    { delay: 4, duration: 22, size: 200, color: "bg-purple-500", startX: 80, startY: 60 },
    { delay: 1, duration: 28, size: 280, color: "bg-cyan-500", startX: 20, startY: 70 },
    { delay: 3, duration: 18, size: 150, color: "bg-indigo-500", startX: 50, startY: 40 },
  ], []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
    </div>
  );
}

// Email validation
function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  if (!email.includes("@")) {
    return { isValid: false, message: "Please enter a valid email address" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email format" };
  }

  return { isValid: true };
}

// Input field with validation state
function EmailInput({
  value,
  onChange,
  onBlur,
  disabled,
  error,
  isTouched,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled: boolean;
  error?: string;
  isTouched: boolean;
}) {
  const showError = isTouched && error;
  const showSuccess = isTouched && !error && value.length > 0;

  return (
    <div className="space-y-2">
      <div className="relative">
        <motion.div
          className="absolute left-3 top-1/2 -translate-y-1/2"
          animate={{ scale: value ? 1 : 0.9, opacity: value ? 1 : 0.5 }}
        >
          <Mail className="h-5 w-5 text-muted-foreground" />
        </motion.div>
        <Input
          type="email"
          placeholder="Enter your email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required
          disabled={disabled}
          className={`h-14 pl-11 pr-11 text-base transition-all duration-300 ${
            showError
              ? "border-red-500 focus-visible:ring-red-500"
              : showSuccess
              ? "border-green-500 focus-visible:ring-green-500"
              : ""
          }`}
        />
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </motion.div>
          )}
          {showError && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// Remember me checkbox with animation
function RememberMeCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <motion.div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked
            ? "bg-primary border-primary"
            : "border-muted-foreground/40 group-hover:border-primary/60"
        }`}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(!checked)}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-3 h-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <motion.path
                d="M2 6l3 3 5-6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        Remember me
      </span>
    </label>
  );
}

// Loading button with animation
function LoadingButton({
  isLoading,
  disabled,
  children,
}: {
  isLoading: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="submit"
      className="w-full h-14 text-base font-medium relative overflow-hidden group bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300"
      disabled={disabled || isLoading}
    >
      <motion.span
        className="absolute inset-0 bg-white/20"
        initial={{ x: "-100%", skewX: -15 }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending magic link...
          </motion.span>
        ) : (
          <motion.span
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {children}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const navigate = useNavigate();
  const { signIn, isAuthenticated, role, isLoading: authLoading } = useAuth();

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("judo-remember-email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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

  const emailValidation = validateEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);

    if (!emailValidation.isValid) {
      toast.error(emailValidation.message);
      return;
    }

    // Handle remember me
    if (rememberMe) {
      localStorage.setItem("judo-remember-email", email);
    } else {
      localStorage.removeItem("judo-remember-email");
    }

    // Recommend @bbk.ac.uk for students but allow other emails
    if (!email.endsWith("@bbk.ac.uk")) {
      toast.info("Tip: Use your @bbk.ac.uk email for student access", {
        duration: 4000,
      });
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
    setEmailTouched(false);
  };

  // Demo: Simulate clicking the magic link
  const handleDemoSignIn = () => {
    (window as unknown as { confirmJudoSignIn: (email: string) => void }).confirmJudoSignIn(email);
    toast.success(`Signed in as ${email}`);
  };

  return (
    <PageTransition>
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center p-4 relative z-10"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-xl">
            <CardHeader className="text-center space-y-4 pb-2">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto relative"
              >
                <motion.div
                  className="text-7xl"
                  animate={isEmailSent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isEmailSent ? Infinity : 0, duration: 2 }}
                >
                  {isEmailSent ? "📧" : "🥋"}
                </motion.div>
                {!isEmailSent && (
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {isEmailSent ? "Check your inbox" : "Judo Club Manager"}
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <CardDescription className="text-base">
                  {isEmailSent
                    ? `We sent a magic link to ${email}`
                    : "University of London Judo Club at Birkbeck"}
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="pt-4">
              <AnimatePresence mode="wait">
                {isEmailSent ? (
                  <motion.div
                    key="email-sent"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-muted/50 rounded-xl p-5 border border-muted"
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Mail className="h-5 w-5 text-primary" />
                          </motion.div>
                          <span className="font-medium">Check your email</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click the link in the email to sign in. The link will expire in 24 hours.
                        </p>
                      </motion.div>

                      {/* Demo button - remove in production */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleDemoSignIn}
                          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="mr-2"
                          >
                            ✨
                          </motion.span>
                          Demo: Click to Sign In
                        </Button>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                      >
                        <p className="text-xs text-muted-foreground">
                          Didn't receive the email? Check your spam folder or
                        </p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="outline"
                            onClick={handleBackToEmail}
                            className="w-full h-12"
                          >
                            Use a different email
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="email-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <EmailInput
                        value={email}
                        onChange={setEmail}
                        onBlur={() => setEmailTouched(true)}
                        disabled={isLoading}
                        error={emailValidation.message}
                        isTouched={emailTouched}
                      />

                      <div className="flex items-center justify-between">
                        <RememberMeCheckbox
                          checked={rememberMe}
                          onChange={setRememberMe}
                        />
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-xs text-muted-foreground"
                        >
                          @bbk.ac.uk for students
                        </motion.p>
                      </div>

                      <LoadingButton isLoading={isLoading} disabled={!emailValidation.isValid && emailTouched}>
                        Continue with Email
                      </LoadingButton>
                    </form>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 pt-6 border-t text-center"
                    >
                      <p className="text-sm text-muted-foreground">
                        New to the club?{" "}
                        <motion.a
                          href="#"
                          className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                          whileHover={{ x: 2 }}
                        >
                          Learn more
                          <ArrowRight className="h-3 w-3" />
                        </motion.a>
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-muted-foreground mt-6"
          >
            Secure, passwordless authentication
          </motion.p>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
