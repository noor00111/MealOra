"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { registerRequest } from "@/lib/auth-api";
import { useAuthStore } from "@/lib/auth-store";
import { getErrorMessage } from "@/lib/api";
import { fadeUp, scaleIn } from "@/lib/motion";
import { signupSchema, SignupForm } from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {register, handleSubmit, control, formState: { errors },} = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const role = useWatch({ control, name: "role" });

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      router.push("/dashboard");
    },
  });

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0">
        <Image src="/images/signup.png" alt="" fill sizes="100vw" className="object-cover" priority />
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={scaleIn} className="relative w-full max-w-lg">
        <Card className="rounded-3xl bg-card/90 shadow-xl shadow-primary/10 backdrop-blur-sm [--card-spacing:--spacing(8)]">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-2xl text-brand-green font-semibold pt-5 pb-1">Create an Account</CardTitle>
            <CardDescription>Order meals or start selling on MealOra!</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.form
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="flex flex-col gap-6"
              onSubmit={handleSubmit((values) => mutation.mutate(values))}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input id="name" className="h-11 px-4" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 px-4"
                  {...register("email")}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <PasswordInput id="password" className="h-11 px-4" {...register("password")} />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">I am a</span>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" value="CUSTOMER" {...register("role")} defaultChecked />
                    Customer
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" value="PROVIDER" {...register("role")} />
                    Provider
                  </label>
                </div>
              </div>

              {role === "PROVIDER" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="businessName" className="text-sm font-medium">
                    Business name
                  </label>
                  <Input id="businessName" className="h-11 px-4" {...register("businessName")} />
                  {errors.businessName && (
                    <p className="text-sm text-destructive">{errors.businessName.message}</p>
                  )}
                </div>
              )}

              {mutation.isError && (
                <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" disabled={mutation.isPending} className="h-11 w-full text-base">
                  {mutation.isPending ? "Creating account..." : "Sign up"}
                </Button>
              </motion.div>
            </motion.form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
