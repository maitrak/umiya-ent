"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ CORRECT
import React from "react";
import Link from "next/link";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if ((session?.user as any)?.role === "ADMIN") {
    router.push("/admin/upload");
  } else if ((session?.user as any)?.role == "SALESMAN") {
    router.push("/order"); // or any route
  } else {
    return (
      <div>
        <div className="LOGIN">
          <div className="div">
            <Link href="/sign-in">
              <Image src="/logo.jpg" alt="Next.js logo" width={700} height={700} priority />
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default Home;
