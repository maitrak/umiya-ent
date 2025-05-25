"use client";
import { SessionProvider, useSession } from "next-auth/react";
import UserButton from "@/components/user-button";
import React from "react";

const Home = () => {
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  return (
    <div>
      <UserButton />
    </div>
  );
};

export default Home;
