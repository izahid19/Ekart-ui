import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/config";
import { toast } from "sonner";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

// ✅ Yup validation schema
const forgetSchema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required"),
});

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgetSchema.validate({ email });
      setError("");
      setIsLoading(true);

      // ✅ API call to send OTP
      const res = await axios.post(`${BASE_URL}/user/forget-password`, { email });

      if (res.data.success) {
        toast.success(res.data.message || "OTP sent to your email!");
        setOtpSent(true);

        // ✅ Navigate using email param in the route
        setTimeout(() => {
          navigate(`/verify-otp/${email}`);
        }, 2000);
      } else {
        toast.error(res.data.message || "Failed to send OTP!");
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        setError(err.message);
      } else {
        toast.error(err.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle>Forgot Password?</CardTitle>
          <CardDescription>
            Enter your registered email, and we’ll send you an OTP to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <CardFooter className="flex flex-col gap-3 mt-2">
              <Button
                type="submit"
                disabled={isLoading || otpSent}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : otpSent ? (
                  "OTP Sent!"
                ) : (
                  "Send OTP"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPassword;
