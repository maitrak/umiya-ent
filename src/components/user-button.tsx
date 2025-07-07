import { useSession, signOut } from "next-auth/react";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "lucide-react";
import { useEffect } from "react";

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  
  useEffect(() => {
    if (status !== "authenticated") {
          handleSignOut();
      }
      
  }, [status]);
  if (status === "loading") {
    return <Loader className="size-6 mr-4 mt-4 float-right animate-spin" />;
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <>
      {session && (
        <nav className="flex bg-gray-200 justify-end rounded-3xl items-center h-12 max-w-md mx-auto  shadow border border-gray-300 overflow-hidden">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative float-right  md:p-2">
              <div className="bg-[#6f6f6f85] flex justify-between items-center rounded-full w-[150px] pl-[7px]">
                <span>{session.user?.name}</span>
                <Avatar className="size-10 hover:opacity-75 transition">
                  <AvatarImage
                    className="size-10 hover:opacity-75 transition"
                    src={session.user?.image || undefined}
                  />
                  <AvatarFallback className="bg-sky-900 text-white">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="bottom" className="w-50">
              <DropdownMenuItem className="h-10" onClick={handleSignOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      )}
    </>
  );
};

export default UserButton;
