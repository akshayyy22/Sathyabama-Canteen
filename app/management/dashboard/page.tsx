"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/SideBar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconShoppingCart,
  IconPizza,
  IconCreditCard,
} from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { account } from "@/lib/appwrite"; // Adjust the import path as needed
import {Component} from "../components/ChartPreview";
import { Poppins } from 'next/font/google';  // Import Google Fonts if needed

const poppinsfont = Poppins({
  weight: ['400', '600'],  // Regular for Sathy, Semi-bold for Pay
  subsets: ['latin'],
});

export default function SidebarDemoManagement() {
  const router = useRouter();

  const [loading, setLoading] = useState(true); // State to manage loading

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

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // For mobile

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      component: <Component/>,
    },
    
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: async () => {
        try {
          await account.deleteSession("current"); // Logs out the user
          router.push("/auth/login"); // Redirects to login page
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    },
  ];

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
    <div className={cn("flex h-screen bg-gray-100 dark:bg-neutral-800")}>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-white bg-black p-2 rounded"
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? "Close" : "Menu"}
      </button>

      {/* Sidebar Component */}
      <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen}>
        <SidebarBody className="flex flex-col h-full">
          <div className="flex flex-col flex-1 overflow-y-auto">
            {isSidebarOpen ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveTab(link.label);
                    if (isSidebarOpen) {
                      setIsSidebarOpen(false); // Optionally close the sidebar after selection
                    }
                    if (isSidebarVisible) {
                      setIsSidebarVisible(false); // Close mobile menu after selection
                    }
                    if (link.onClick) link.onClick(); // Handle the logout
                  }}
                >
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto">
            <SidebarLink
              link={{
                label: "akshay enterprises",
                href: "#",
                icon: (
                  <Image
                    src="/ProfileIcon.jpg"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 p-2 md:p-10 bg-white dark:bg-neutral-900 overflow-y-auto">
        {links.find((link) => link.label === activeTab)?.component || null}
      </main>
    </div>
  );
}

export const Logo = () => {
 
  return (
    <Link
  href="#"
  className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
>
  <Image
    src="/bglogo.png"
    alt="Logo"
    width={25}  // Adjust the width to match your requirements
    height={20} // Adjust the height to match your requirements
    className="flex-shrink-0"
  />
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`${poppinsfont.className} whitespace-pre`}  // Apply the professional font
    style={{ letterSpacing: '0.05em' }}  // Adjust letter-spacing for a modern look
  >
    <span style={{ color: '#ffffff' , fontWeight: 1000 }}>Sathy</span><span style={{ color: '#8773ee', fontWeight: 600 }}>Pay</span> 
  </motion.span>
</Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src="/bglogo.png"
        alt="Logo"
        width={25}  // Adjust the width to match your requirements
        height={20} // Adjust the height to match your requirements
        className="flex-shrink-0"
      />
    </Link>
  );
};
