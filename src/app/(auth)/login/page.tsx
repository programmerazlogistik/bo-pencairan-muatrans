"use client";

import { useState } from "react";

import { EyeClosed, EyeOpen } from "@muatmuat/icons";
import { ImageComponent } from "@muatmuat/ui/ImageComponent";

import { useAuth } from "@/lib/auth";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const { email, password } = formData;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({
        type: "email",
        email: formData.email,
        password: formData.password,
      });

      if (result.loggedIn) {
        // Redirect after successful login
        window.location.replace("/home");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-[#2D7EF8] via-[#1564E8] to-[#0F5ADE]">
        {/* Left Side - Illustration */}
        <div className="relative hidden flex-1 items-center justify-center overflow-hidden p-10 lg:flex">
          <ImageComponent
            src="/login-icon.png"
            height={400}
            width={400}
            alt=""
          />
        </div>
        {/* Right Side - Login Card */}
        <div className="flex flex-1 items-center justify-center p-5 lg:p-10">
          <div className="w-full rounded-2xl bg-white p-8 shadow-[0_25px_80px_rgba(0,0,0,0.15)] md:p-12 lg:p-14">
            {/* Header */}
            <div className="mb-8 text-center">
              {/* Logo */}
              <div className="mb-2 flex justify-center">
                <ImageComponent
                  src="/svg/logo-muatmuat-blue.svg"
                  alt="Muatmuat Logo"
                  width={180}
                  height={50}
                />
              </div>

              <p className="text-sm font-semibold text-black">
                Jalan Mudah Bersama
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[13px] font-medium text-[#555555]"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="email"
                  className={`h-11 w-full rounded-md border bg-white px-3.5 text-sm text-[#1B1B1B] outline-none transition-all duration-200 ${
                    errors.email
                      ? "border-[#EE4343] focus:border-[#EE4343] focus:ring-[3px] focus:ring-[#EE4343]/10"
                      : "border-[#D9D9D9] focus:border-[#176CF7] focus:ring-[3px] focus:ring-[#176CF7]/10"
                  } placeholder:text-[#9D9D9D] disabled:cursor-not-allowed disabled:bg-[#F5F5F5]`}
                />
                {errors.email && (
                  <span className="text-xs text-[#EE4343]">{errors.email}</span>
                )}
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-[13px] font-medium text-[#555555]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                    className={`h-11 w-full rounded-md border bg-white pl-3.5 pr-11 text-sm text-[#1B1B1B] outline-none transition-all duration-200 ${
                      errors.password
                        ? "border-[#EE4343] focus:border-[#EE4343] focus:ring-[3px] focus:ring-[#EE4343]/10"
                        : "border-[#D9D9D9] focus:border-[#176CF7] focus:ring-[3px] focus:ring-[#176CF7]/10"
                    } placeholder:text-[#9D9D9D] disabled:cursor-not-allowed disabled:bg-[#F5F5F5]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9D9D9D] transition-colors hover:text-[#555555] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeClosed className="h-5 w-5 text-orange-600" />
                    ) : (
                      <EyeOpen className="h-5 w-5 text-orange-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-[#EE4343]">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="rounded-md border border-[#EE4343] bg-[#FFEAEC] p-3 text-center text-[13px] text-[#C50018]">
                  {errors.general}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`mt-2 h-12 w-full rounded-full text-sm font-bold tracking-wider text-white transition-all duration-300 ${
                  isLoading
                    ? "cursor-not-allowed bg-[#C4C4C4]"
                    : "bg-gradient-to-br from-[#3A7DE8] to-[#176CF7] shadow-[0_4px_15px_rgba(23,108,247,0.3)] hover:-translate-y-[1px] hover:from-[#2D6FD8] hover:to-[#0F5ADE] hover:shadow-[0_6px_20px_rgba(23,108,247,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(23,108,247,0.3)]"
                } `}
              >
                {isLoading ? "LOADING..." : "MASUK"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
