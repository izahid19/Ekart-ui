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
import { Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/config";
import { toast } from "sonner";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

// ✅ Validation Schemas
const otpSchema = yup.object().shape({
  otp: yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
});

const passwordSchema = yup.object().shape({
  newPassword: yup.string().min(6, "Password must be at least 6 characters").required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required(),
});

const VerifyOTP = () => {
  const navigate = useNavigate();
  const { email } = useParams();

  const [step, setStep] = useState(1); // 1 = Verify OTP, 2 = New Password
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Step 1: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      await otpSchema.validate({ otp });
      setOtpError("");
      setIsLoading(true);

      const res = await axios.post(`${BASE_URL}/user/verify-otp/${email}`, { otp });

      if (res.data.success) {
        toast.success(res.data.message || "OTP verified successfully!");
        setTimeout(() => setStep(2), 800); // Go to password step
      } else {
        toast.error(res.data.message || "Invalid or expired OTP!");
      }
    } catch (err) {
      if (err.name === "ValidationError") setOtpError(err.message);
      else toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResendOTP = async () => {
    try {
      setResending(true);
      const res = await axios.post(`${BASE_URL}/user/resend-otp/${email}`);
      if (res.data.success) toast.success("New OTP sent to your email!");
      else toast.error(res.data.message || "Failed to resend OTP!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setResending(false);
    }
  };

  // ✅ Step 2: Change Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      await passwordSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setIsLoading(true);

      const res = await axios.post(`${BASE_URL}/user/change-password/${email}`, formData);

      if (res.data.success) {
        toast.success(res.data.message || "Password updated successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(res.data.message || "Failed to change password!");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const newErrors = {};
        error.inner.forEach((err) => (newErrors[err.path] = err.message));
        setErrors(newErrors);
      } else {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm shadow-lg">
        {step === 1 ? (
          <>
            <CardHeader>
              <CardTitle>Verify OTP</CardTitle>
              <CardDescription>
                Enter the 6-digit OTP sent to{" "}
                <span className="font-semibold">{email}</span>.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
                </div>

                <CardFooter className="flex flex-col gap-3 mt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-pink-500 hover:bg-pink-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying OTP...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resending}
                    className="text-sm text-blue-600 hover:underline mt-2 disabled:opacity-60"
                  >
                    {resending ? "Resending OTP..." : "Didn’t receive OTP? Resend"}
                  </button>
                </CardFooter>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <CardDescription>
                Create a strong password for{" "}
                <span className="font-semibold">{email}</span>.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
                {/* New Password */}
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
                      }
                    />
                    {showPassword ? (
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowPassword(true)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                      />
                    )}
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                    {showConfirmPassword ? (
                      <EyeOff
                        onClick={() => setShowConfirmPassword(false)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowConfirmPassword(true)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                      />
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                <CardFooter className="flex flex-col gap-3 mt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-pink-500 hover:bg-pink-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default VerifyOTP;
