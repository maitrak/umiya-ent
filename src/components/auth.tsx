import { useSession, signOut } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ErrorPage401 from "./error";
import UserButton from "./user-button";
import { useEffect } from "react";
const Auth = ({ children }: any) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAdminRoute = pathname.startsWith("/admin");

  if (status === "loading") {
    return <Loader className="size-6 mr-4 mt-4 float-right animate-spin" />;
  }

  if (session?.user?.role !== "ADMIN" && isAdminRoute) {
    return (
      <ErrorPage401>
        <UserButton />
      </ErrorPage401>
    );
  }

  return (
    <>
      {pathname !== "/sign-up" && pathname !== "/sign-in" && <UserButton />}

      {children}
    </>
  );
};

export default Auth;
