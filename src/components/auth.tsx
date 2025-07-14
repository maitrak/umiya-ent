import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { usePathname } from "next/navigation";
import ErrorPage401 from "./error";
import UserButton from "./user-button";
const Auth = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAdminRoute = pathname.startsWith("/admin");

  if (status === "loading") {
    return <Loader className="size-6 mr-4 mt-4 float-right animate-spin" />;
  }

  if ((session?.user as any)?.role !== "ADMIN" && isAdminRoute) {
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
