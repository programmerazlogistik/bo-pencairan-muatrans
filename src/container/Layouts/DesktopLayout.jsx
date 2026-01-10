"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useDevice } from "@muatmuat/hooks/use-device";

import Navbar from "@/container/Layouts/Navbar";
import Sidebar from "@/container/Layouts/Sidebar";

const DesktopLayout = ({ children }) => {
  const pathname = usePathname();
  const initialPathRef = useRef(null);
  const { isMobile } = useDevice();

  // Calculate initial state based on pathname
  const initialIsHomePage =
    typeof window !== "undefined"
      ? pathname === "/home" ||
        pathname === "/home/" ||
        pathname === "/" ||
        pathname.startsWith("/home/")
      : false;
  const [sidebarOpen, setSidebarOpen] = useState(!initialIsHomePage); // Closed on home page and home dynamic routes, open on other pages

  useEffect(() => {
    // Set the initial path on first render
    if (initialPathRef.current === null) {
      initialPathRef.current = pathname;
      // Initial state already set in useState
    } else {
      // On route change, only update if coming from or going to home page
      const wasHomePage =
        initialPathRef.current === "/home" ||
        initialPathRef.current === "/home/" ||
        initialPathRef.current === "/" ||
        initialPathRef.current.startsWith("/home/");
      const isNowHomePage =
        pathname === "/home" ||
        pathname === "/home/" ||
        pathname === "/" ||
        pathname.startsWith("/home/");

      if (wasHomePage !== isNowHomePage) {
        // If navigating between home and non-home, update the sidebar state
        setSidebarOpen(!isNowHomePage);
      }

      initialPathRef.current = pathname;
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="grid min-h-screen grid-rows-[58px_1fr] overflow-hidden">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex min-w-0 overflow-hidden">
        {isMobile || (
          <div
            className={`z-20 min-h-[calc(100dvh_-_58px)] bg-white shadow-md transition-all duration-300 ${
              sidebarOpen ? "w-[258px]" : "w-0"
            }`}
          >
            <Sidebar sidebarOpen={sidebarOpen} />
          </div>
        )}

        <main
          className={`w-0 min-w-0 flex-1 overflow-y-auto bg-white ${
            isMobile ? "p-0" : "p-[18px]"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
