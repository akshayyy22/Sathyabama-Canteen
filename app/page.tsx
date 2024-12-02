"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for routing in Next.js App Router
import { account } from '@/lib/appwrite'; // Ensure correct import path

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true); // State to manage loading state
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if the user is authenticated
        await account.getSession('current');
        setLoading(false); // User is authenticated, stop loading
      } catch (error) {
        // Redirect to login page if not authenticated
        router.push('/auth/login');
      }
    };

    checkAuthentication();
  }, [router]);

  if (loading) {
    // Render loading spinner while checking authentication
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-neutral-900">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"
          ></div>
          <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Your adventure is about to begin
          </p>
        </div>
      </div>
    );
  }

  // Render the main content if authenticated
  return (
    <main className="h-screen">
    </main>
  );
};

export default Home;
