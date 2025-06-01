"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ CORRECT
import React from "react";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (session?.user?.role == "ADMIN") {
    router.push("/admin/upload"); // or any route
  } else if (session?.user?.role == "SALESMAN") {
    router.push("/order"); // or any route
  } else {
    return (
      <div>
        <div className="LOGIN">
          <div className="div">
            <Image src="/logo.jpg" alt="Next.js logo" width={700} height={700} priority />
          </div>
        </div>
      </div>
    );
  }
};

export default Home;
