import React, { useState, useEffect } from "react";
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
import { Loader2, MailCheck, Clock } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/config";
import { toast } from "sonner";

const VerifyAccount = () => {
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0); // in seconds
  const [isDisabled, setIsDisabled] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (cooldownTime > 0) {
      setIsDisabled(true);
      timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setIsDisabled(false);
            setLinkSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your registered email address");
      return;
    }
    try {
      setIsResending(true);
      const res = await axios.post(
        `${BASE_URL}/user/reverify`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setLinkSent(true);
        setCooldownTime(180); // 3 minutes = 180 seconds
        toast.success(res.data.message || "Verification link sent successfully!");
      } else {
        toast.error(res.data.message || "Unable to send verification link");
      }
    } catch (error) {
      console.error("Reverify error:", error);
      toast.error(error.response?.data?.message || "Failed to resend verification link");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Verify your email</CardTitle>
          <CardDescription className="text-sm">
            We've sent a verification link to your registered email address.  
            Please click the link in your email to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResend} className="flex flex-col gap-6">
            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isDisabled}
              />
            </div>

            {/* Submit Button + Status */}
            <CardFooter className="flex flex-col gap-3 p-0 pt-4">
              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50"
                disabled={isResending || isDisabled}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : isDisabled ? (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Resend after {formatTime(cooldownTime)}
                  </>
                ) : (
                  "Resend Verification Link"
                )}
              </Button>

              {linkSent && cooldownTime > 0 && (
                <div className="flex items-center justify-center gap-2 text-green-600 mt-2">
                  <MailCheck className="h-5 w-5" />
                  <p className="text-sm">Verification link sent successfully!</p>
                </div>
              )}

              {isDisabled && (
                <div className="flex items-center justify-center gap-2 text-gray-600 mt-2">
                  <Clock className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">
                    You can resend the link in {formatTime(cooldownTime)}
                  </p>
                </div>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyAccount;