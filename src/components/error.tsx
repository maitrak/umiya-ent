import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

const ErrorPage401 = ({ children }: any) => {
  const router = useRouter();

  setTimeout(() => {
    router.push("/admin/upload"); // or any route
  }, 1500);

  return (
    <>
      {children}
      <div className="flex items-center justify-center flex-col h-screen text-center">
        <h1>
          Unauthorized <small>401</small>
        </h1>
        <p>The requested resource requires an authentication.</p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Go to Home
        </Button>
      </div>
    </>
  );
};

export default ErrorPage401;
