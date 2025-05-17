"use client";

//shadcn ui

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";

//react icons
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/");
      toast.success("login successful");
    } else if (res?.status === 401) {
      setError("Invalid Credentials");
      setPending(false);
    } else {
      setError("Something went wrong");
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(value, { callbackUrl: "/" });
  };
  return (
    <div>
      <div className="LOGIN">
        <div className="div">
          <div className="group">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 font-medium text-gray-900 dark:text-white text-lg">
                  Email
                </label>
                <Input
                  type="email"
                  disabled={pending}
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 font-medium text-gray-900 dark:text-white text-lg">
                  Password
                </label>
                <Input
                  type="password"
                  disabled={pending}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full" size="lg" disabled={pending}>
                continue
              </Button>
            </form>
            <Separator />
            <p className="text-center mt-2 text-muted-foreground">
              Create Account?
              <Link className="text-sky-700 ml-4 hover:underline cursor-pointer" href="sign-up">
                Sign up{" "}
              </Link>
            </p>
          </div>
          <Image src="/logo.jpg" alt="Next.js logo" width={500} height={38} priority />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
