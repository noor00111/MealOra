"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader,CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registerRequest } from "@/lib/auth-api";
import { useAuthStore } from "@/lib/auth-store";
import { getErrorMessage } from "@/lib/api";
import { signupSchema, SignupForm } from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {register, handleSubmit, formState: { errors }} = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      router.push("/dashboard");
    },
  });

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
      <Image src="/images/signup.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      <Card className="relative w-full max-w-sm bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Order meals or start selling on MealOra</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

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

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">I am a</span>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-1.5">
                  <input type="radio" value="CUSTOMER" {...register("role")} defaultChecked />
                  Customer
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="radio" value="PROVIDER" {...register("role")} />
                  Provider
                </label>
              </div>
            </div>

            {mutation.isError && (
              <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
            )}

            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
