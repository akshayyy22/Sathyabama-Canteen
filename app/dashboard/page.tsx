"use client";

import { useRouter } from 'next/navigation'; // Correct import for next/navigation
import { useState, useEffect } from 'react';
import { account ,  } from '@/lib/appwrite'; // Import your Appwrite client
import { SidebarDemo } from '@/components/SideBarPreview';

export default function Dashboard() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get(); // Check if the user is authenticated
        setLoading(false);
      } catch (err) {
        console.error("Authentication check failed:", err);
        router.push('/auth/signup'); // Redirect to login if not authenticated
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current'); // Delete the current session
      router.push('/auth/login'); // Redirect to login page after logout
    } catch (err: any) {
      console.error("Logout error:", err); // Log detailed error
      setError('Logout failed. Please try again.');
    }
  };

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


  return (
    <div>
      <SidebarDemo/>      
      {error && <p>{error}</p>}
    </div>
  );
}
