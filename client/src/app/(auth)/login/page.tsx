"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginRequest } from "@/lib/auth-api";
import { useAuthStore } from "@/lib/auth-store";
import { getErrorMessage } from "@/lib/api";
import { fadeUp } from "@/lib/motion";
import { loginSchema, LoginForm } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {register, handleSubmit, formState: { errors }} = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      router.push("/dashboard");
    },
  });

  return (
    <div className="flex flex-1 items-center justify-center bg-background p-4">
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-card shadow-xl shadow-primary/10 ring-1 ring-border">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative hidden w-1/2 bg-accent md:block">
         
          <Image
            src="/images/login.png"
            alt="MealOra chef"
            fill
            sizes="(min-width: 768px) 50vw, 0px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-6">
            <p className="text-lg font-semibold text-white">Good food is waiting for you!</p>
            <p className="text-sm text-white/80">Log in and discover delicious meals made with love.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="w-full md:w-1/2">

          <Card className="h-full rounded-none border-0 ring-0 [--card-spacing:--spacing(8)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-center pt-10 font-semibold text-2xl text-brand-green">Login to MealOra!</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit((values) => mutation.mutate(values))}>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 px-4"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input id="password" type="password" className="h-11 px-4" {...register("password")} />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {mutation.isError && (
                  <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" disabled={mutation.isPending} className="h-11 w-full text-base">
                    {mutation.isPending ? "Logging in..." : "Log In"}
                  </Button>
                </motion.div>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
                  Create one
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
