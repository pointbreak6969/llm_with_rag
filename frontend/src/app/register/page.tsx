"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/signUpSchema";

export default function page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/register", data);
      if (response.status === 201) {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error || "Registration failed");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Signup | Dashboard</title>
      </Head>
      <div className="relative min-h-screen bg-linear-to-br from-background via-background to-purple-50/50 dark:to-purple-950/30 overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl"></div>
        </div>

        <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
              🔐 Create Account
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Sign{" "}
              <span className="bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Up
              </span>
            </h2>
            <p className="text-muted-foreground">
              Create your account to get started
            </p>
          </div>
        </div>

        <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
          <div className="relative group">
            <div className="absolute -inset-4 bg-linear-to-r from-purple-500 via-blue-500 to-pink-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border p-8">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      className="w-full pl-10 pr-3 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-foreground placeholder-muted-foreground/60"
                      placeholder="you@example.com"
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="email"
                    render={({ message }) => (
                      <div className="mt-1 flex items-center text-sm text-red-500">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {message}
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-foreground placeholder-muted-foreground/60"
                      placeholder="Create a strong password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground focus:outline-none transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="password"
                    render={({ message }) => (
                      <div className="mt-1 flex items-center text-sm text-red-500">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {message}
                      </div>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-1/4 right-10 w-6 h-6 bg-purple-500 rounded-full shadow-lg animate-pulse opacity-60"></div>
        <div className="absolute bottom-1/3 left-10 w-4 h-4 bg-blue-500 rounded-full shadow-lg animate-pulse delay-300 opacity-60"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-pink-500 rounded-full shadow-lg animate-pulse delay-700 opacity-40"></div>
      </div>
    </>
  );
}
