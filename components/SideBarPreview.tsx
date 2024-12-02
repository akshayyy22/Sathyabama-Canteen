"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Poppins } from 'next/font/google';  // Import Google Fonts if needed

import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/SideBar";
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
import Menu from "../components/Menu";
import OrderFood from "./OrderFood";
import { motion } from "framer-motion";
import { CoverDemo } from "../components/IntroPreview";
import ProfilePage from "../components/ProfilePreview";
import { TableDemo } from "../components/PaymentHistoryPreview";
import { account } from "@/lib/appwrite"; // Adjust the import path as needed
const poppinsfont = Poppins({
  weight: ['400', '600'],  // Regular for Sathy, Semi-bold for Pay
  subsets: ['latin'],
});
export function SidebarDemo() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // For mobile
  // Define the Poppins font


  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      component: <CoverDemo />,
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      component: <ProfilePage />,
    },
    {
      label: "Order Food",
      href: "#",
      icon: (
        <IconPizza className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      component: <OrderFood />,
    },
    {
      label: "Orders",
      href: "#",
      icon: (
        <IconShoppingCart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Payment History",
      href: "#",
      icon: (
        <IconCreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      component: <TableDemo />,
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      // component: <CardDemo />,
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

  return (
    <div className={cn("flex h-screen bg-gray-100 dark:bg-neutral-800")}>
      {/* Sidebar Component */}
      <div className={`md:block ${isSidebarOpen ? "" : "hidden"} ${isSidebarVisible ? "fixed inset-0 z-40" : "hidden"} bg-gray-100 dark:bg-neutral-800`}>
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
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 z-50 md:hidden flex justify-between items-center px-4 py-2">
        {links.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className="flex-1 text-center"
            onClick={() => {
              setActiveTab(link.label);
              if (link.onClick) link.onClick(); // Handle the logout
            }}
          >
            {link.icon}
          </Link>
        ))}
      </div>

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
