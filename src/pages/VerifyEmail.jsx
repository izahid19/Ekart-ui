import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/utils/config";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [countdown, setCountdown] = useState(5);

  const verifyUser = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Email verified successfully!");
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.response?.data?.message || "Verification failed!");
      setStatus("failed");
    }
  };

  useEffect(() => {
    verifyUser();
  }, [token]);

  // Countdown and redirect
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      navigate("/login");
    }
  }, [status, countdown, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-50">
      <div className="text-center bg-white p-8 rounded-2xl shadow-md w-[380px]">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            <h2 className="text-lg font-semibold text-gray-700">
              Verifying your email...
            </h2>
            <p className="text-gray-500 text-sm">
              Please wait while we confirm your account.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-bold text-green-600">
              ✅ Email Verified!
            </h2>
            <p className="text-gray-600">
              Redirecting to login page in <span className="font-semibold">{countdown}</span>...
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-bold text-red-600">
              ❌ Verification Failed
            </h2>
            <p className="text-gray-600 text-sm">
              The link might be invalid or expired.
            </p>
            <Button
              className="mt-3 bg-pink-500 hover:bg-pink-600"
              onClick={() => navigate("/verify-account")}
            >
              Resend Verification Email
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
