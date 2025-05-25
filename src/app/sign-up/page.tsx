"use client";

//shadcn ui

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";

//react icons
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TriangleAlert } from "lucide-react";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setPending(false);
      toast.success(data.message);
      router.push("/sign-in");
    } else if (res.status === 400) {
      setError(data.message);
      setPending(false);
    } else if (res.status === 500) {
      setError(data.message);
      setPending(false);
    }
  };

  return (
    <div className="LOGIN">
      <div className="div">
        <div className="group">
          {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
              <TriangleAlert />
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 font-medium text-gray-900 dark:text-white text-lg">
                Name
              </label>
              <Input
                type="text"
                disabled={pending}
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label
                htmlFor="Phone Number"
                className="block mb-2 font-medium text-gray-900 dark:text-white text-lg">
                Phone Number
              </label>
              <Input
                type="number"
                disabled={pending}
                placeholder="Phone Number"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                maxLength={10}
                minLength={10}
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirm_password"
                className="block mb-2 font-medium text-gray-900 dark:text-white text-lg">
                Confirm Password
              </label>
              <Input
                type="password"
                disabled={pending}
                placeholder="confirm password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button className="w-full" size="lg" disabled={pending}>
              continue
            </Button>
          </form>
          <Separator />
          <p className="text-center mt-2 text-muted-foreground">
            Already have an account?
            <Link className="text-sky-700 ml-4 hover:underline cursor-pointer" href="sign-in">
              Sign in{" "}
            </Link>
          </p>
        </div>
        <Image src="/logo.jpg" alt="Next.js logo" width={500} height={38} priority />
      </div>
    </div>
  );
};

export default SignUp;
