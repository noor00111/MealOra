"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginRequest } from "@/lib/auth-api";
import { useAuthStore } from "@/lib/auth-store";
import { getErrorMessage } from "@/lib/api";
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
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <div className="relative hidden w-1/2 md:block">
          <Image src="/images/login.png"
            alt="MealOra chef"
            fill
            sizes="(min-width: 768px) 50vw, 0px"
            className="object-cover"
            priority
          />
        </div>

        <Card className="w-full rounded-none ring-0 md:w-1/2">
          <CardHeader>
            <CardTitle>Login To MealOra</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit((values) => mutation.mutate(values))}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {mutation.isError && (
                <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
              )}

              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
