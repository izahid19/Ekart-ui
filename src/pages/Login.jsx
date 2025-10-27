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
import { Link, useNavigate } from "react-router-dom";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/config";
import { toast } from "sonner";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { Content } from "@radix-ui/react-tabs";

// ✅ Yup validation schema for login
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loggedInUserIdData, setLoggedInUserIdData] = useState({});

  const userId = loggedInUserIdData?.user?.id;
  const accessToken = loggedInUserIdData?.accessToken;
  const [formData, setFormData] = useState({
    email: "pubgworldcup@gmail.com",
    password: "Zahid@123",
  });
  const dispatch = useDispatch();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const fetchUser = async (userId, accessToken) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/get-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      
      const userData = res?.data?.data;
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(userData));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error(error.response?.data?.message || "Failed to fetch user");
    }
  };

  useEffect(() => {
    if ((userId, accessToken)) {
      fetchUser(userId, accessToken);
    }
  }, [userId, accessToken]);

  // Handle form submit
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // ✅ Validate inputs
      await loginSchema.validate(formData, { abortEarly: false });
      setIsLoading(true);

      // ✅ API call
      const res = await axios.post(`${BASE_URL}/user/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      const userData = res?.data;
      setLoggedInUserIdData(userData);

      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(res.data.message || "Login successful!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
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
        <CardHeader>
          <CardTitle>Welcome Back 👋</CardTitle>
          <CardDescription>Log in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
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
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </div>

            <CardFooter className="flex flex-col gap-3 mt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
              <Link
                to="/forgot-password"
                className="text-sm text-center text-blue-600 hover:underline"
              >
                Forgot your password?
              </Link>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
