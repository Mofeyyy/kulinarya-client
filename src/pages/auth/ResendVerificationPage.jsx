import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/config/axios";
import toast from "react-hot-toast";
import Logo from "../../components/Logo";

const ResendVerificationPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const resendVerificationEmail = async () => {
    if (!email) return toast.error("Please enter your email.");
    setLoading(true);
    try {
      const response = await API.post("/auth/resend-verification", { email });
      if (response.status === 200) {
        toast.success("Verification email resent! Check your inbox.");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Failed to resend verification email.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6">
      <div className="bg-background  rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md p-6 transition-colors duration-300">
        {/* Logo */}
        <div className="text-center mb-5">
          <Logo className="mx-auto w-20 h-20" />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-3">
          Please Verify Your Account
        </h2>

        <div className="text-center mb-5">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Chill muna! Your account’s still marinating. Check your inbox to finish.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Didn’t receive the email? No worries, we’ll resend it below.
          </p>
        </div>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-300 dark:border-[#2C2C2C] rounded-md bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
        />

        <div className="space-y-3">
          <button
            onClick={resendVerificationEmail}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Resending..." : "Resend Verification Email"}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gray-300 dark:bg-[#333333] text-gray-800 dark:text-white py-2 rounded-md hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
