// pages/index.tsx
import { useRouter } from "next/router";
import { useEffect } from "react";
import { account } from "@/lib/appwrite";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
        router.push("/dashboard"); // Redirect to dashboard if logged in
      } catch {
        router.push("/login"); // Redirect to login if not logged in
      }
    };
    checkSession();
  }, [router]);

  return <div>Loading...</div>;
}
