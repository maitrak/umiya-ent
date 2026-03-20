"use client";

//shadcn ui

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

//react icons
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { TriangleAlert } from "lucide-react";
import OTPInput from "react-otp-input";
import BackButton from "@/components/back-button";

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
      phone: email,
      password,
    });
    console.log("res", res);
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

  useEffect(() => {
    console.log("password", password);
  }, [password]);

  return (
    <div>
      <div className="LOGIN">
        <div className="div">
          <BackButton fallbackHref="/" className="absolute left-4 top-4 z-10" />
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
                  htmlFor="phoneNumber"
                  className="block mb-2 font-medium text-gray-900 dark:text-white text-lg">
                  User ID
                </label>
                <Input
                  type="text"
                  disabled={pending}
                  placeholder="User ID"
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
                {/* <Input
                  type="password"
                  disabled={pending}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                /> */}
                <OTPInput
                  inputStyle={{
                    width: "3rem",
                    height: "3rem",
                    margin: "0 1rem",
                    fontSize: "2rem",
                    borderRadius: 4,
                    border: "1px solid rgba(0,0,0,0.3)",
                  }}
                  value={password}
                  numInputs={4}
                  onChange={setPassword}
                  renderInput={(props) => <input {...props} />}
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
