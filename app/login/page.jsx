"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/redux/actions/adminAuthActions";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/useTheme";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/loaders-and-skeletons/Spinner";

// ❌ REMOVE THIS — import logo from "/public/logo.png"
// ✅ NO IMPORT NEEDED — just use /logo.png directly

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { mounted } = useTheme();

  const isArabic = language === "ar";
  const { isLoading, error } = useSelector((state) => state.adminAuth);

  const fontFamily = isArabic
    ? "var(--font-cairo), var(--font-tajawal), system-ui, sans-serif"
    : "system-ui, -apple-system, sans-serif";

  const handleLogin = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(adminLogin({ email, password }));
    if (adminLogin.fulfilled.match(resultAction)) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#111111]" />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-[#111111] p-4 text-black dark:text-white transition-colors duration-500"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Card className="w-full max-w-md border border-neutral-200 dark:border-neutral-800/60 bg-white dark:bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-none relative overflow-hidden">

        {/* Golden top accent */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E9B10C] to-transparent opacity-50" />

        <CardHeader className="space-y-5 text-center pt-10 pb-8 border-b border-neutral-100 dark:border-neutral-800/50">

          {/* ✅ LOGO — plain img tag, no import needed */}
          <div className="flex justify-center mb-2">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="space-y-1">
            <CardTitle
              className="text-xl uppercase tracking-widest font-black"
              style={{ fontFamily }}
            >
              {t("welcomeBack")}
            </CardTitle>
            <CardDescription
              className="text-xs uppercase tracking-[0.2em] text-neutral-500"
              style={{ fontFamily }}
            >
              {t("signInAdmin")}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-8 pb-10 px-8">
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-[10px] uppercase tracking-widest font-black text-neutral-600 dark:text-neutral-400"
                style={{ fontFamily }}
              >
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isSuccess}
                className="h-12 rounded-none border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111111] px-4 text-sm focus-visible:ring-1 focus-visible:ring-[#E9B10C] focus-visible:border-[#E9B10C] transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-[10px] uppercase tracking-widest font-black text-neutral-600 dark:text-neutral-400"
                style={{ fontFamily }}
              >
                {t("password")}
              </Label>
              <div className="relative flex items-center">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isSuccess}
                  className={`h-12 w-full rounded-none border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111111] px-4 text-sm focus-visible:ring-1 focus-visible:ring-[#E9B10C] focus-visible:border-[#E9B10C] transition-all duration-300 ${
                    isArabic ? "pl-10" : "pr-10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isSuccess}
                  className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-neutral-400 hover:!text-[#E9B10C] transition-colors focus:outline-none ${
                    isArabic ? "left-3" : "right-3"
                  }`}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={2} />
                  ) : (
                    <Eye size={18} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold text-center">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full h-14 mt-4 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer ${
                isSuccess
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-[#E9B10C] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black"
              }`}
              style={{ fontFamily }}
            >
              {isLoading ? (
                <>
                  <Spinner size={16} />
                  {t("loading")}
                </>
              ) : isSuccess ? (
                <>
                  <Check size={18} strokeWidth={3} className="animate-in zoom-in" />
                  {t("success") || "SUCCESS"}
                </>
              ) : (
                t("signIn")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}