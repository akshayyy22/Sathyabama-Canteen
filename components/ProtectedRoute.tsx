// components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { account } from "@/lib/appwrite"; // Adjust the import path

export const ProtectedRoute = (Component: React.ComponentType) => {
  return function ProtectedRouteWrapper(props: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkSession = async () => {
        try {
          await account.get(); // Fetch user session
          setIsLoading(false);
        } catch (error) {
          console.error("No active session found", error);
          router.push("/login"); // Redirect to login if not authenticated
        }
      };
      checkSession();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>; // Show a loading state
    }

    return <Component {...props} />;
  };
};
