import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import useSignupForm from "@/forms/useSignupForm";

const SignupForm = ({ className, ...props }) => {
  const {
    signupForm,
    control,
    handleSubmit,
    isSubmitting,
    onSubmit,
    isPending,
  } = useSignupForm();

  const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const countdownRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    if (!isVerificationModalOpen) return;
    
    setCountdown(15);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setVerificationModalOpen(false); // Close modal
          navigate("/"); // Redirect after closing
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [isVerificationModalOpen, navigate]);

  // Handle manual close and redirect
  const handleModalClose = (isOpen) => {
    if (!isOpen) {
      setVerificationModalOpen(false);
      navigate("/"); // Redirect when modal is manually closed
    }
  };

  const handleSignup = async (data) => {
    onSubmit(data, () => {
      setVerificationModalOpen(true);
    });
  };

  return (
    <>
      <Form {...signupForm}>
        <form onSubmit={handleSubmit(handleSignup)} className="flex flex-col gap-6" {...props}>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-2xl font-bold">Welcome to Kulinarya!</p>
            <p className="text-muted-foreground text-sm">
              Signup and share your amazing Filipino recipes!
            </p>
          </div>

          <FormField control={control} name="firstName" render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl><Input type="text" placeholder="Sean" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={control} name="lastName" render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl><Input type="text" placeholder="Bakal" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="m@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" placeholder="••••••" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={control} name="confirmPassword" render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl><Input type="password" placeholder="••••••" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" disabled={isSubmitting || isPending} className="w-full bg-primary">
            {isSubmitting || isPending ? "Loading..." : "Signup"}
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline hover:opacity-80">Login</Link>
          </p>
        </form>
      </Form>

      <Dialog open={isVerificationModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Email Verification Required</DialogTitle>
            <DialogDescription>
              A verification link has been sent to your email. Please check your inbox and verify your account.
            </DialogDescription>
          </DialogHeader>
          <p className="text-center text-lg font-bold text-primary">
            Closing in {countdown} seconds...
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignupForm;
