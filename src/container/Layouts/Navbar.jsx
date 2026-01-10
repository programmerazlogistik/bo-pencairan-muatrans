"use client";

import Image from "next/image";
import Link from "next/link";

import { useDevice } from "@muatmuat/hooks/use-device";
import { IconComponent } from "@muatmuat/ui/IconComponent";

import LoginButton from "@/components/Auth/LoginButton";

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { isMobile } = useDevice();
  return (
    <>
      {isMobile ? (
        <>
          <div className="bg-primary sticky left-0 top-0 z-30 flex h-[58px] w-screen items-center justify-between px-4 text-white">
            <div className="flex">
              <div className="bg-primary flex h-[58px] items-center justify-center">
                <Link href="/home">
                  <div className="flex flex-col items-center">
                    <Image
                      src="/svg/logo-muatmuat.svg"
                      alt="MuatMuat Logo"
                      width={120}
                      height={32}
                    />
                  </div>
                  <div className="-mt-2 text-center text-sm font-semibold text-white">
                    <p>BO Finance Muatrans</p>
                  </div>
                </Link>
              </div>
            </div>
            {/* Icon links */}
            <div className="ml-auto flex items-center">
              {/* User profile */}
              <LoginButton />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-primary sticky left-0 top-0 z-30 flex h-[58px] w-screen items-center justify-between px-7 text-white">
            <div className="flex items-center">
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  sidebarOpen ? "w-[230px] opacity-100" : "w-0 opacity-0"
                }`}
              >
                <Link href="/home" className="block min-w-[120px]">
                  <div className="flex flex-col items-center">
                    <Image
                      src="/svg/logo-muatmuat.svg"
                      alt="MuatMuat Logo"
                      width={120}
                      height={32}
                    />
                  </div>
                  <div className="-mt-1 text-center text-xs font-semibold text-white">
                    <p>BO Finance Muatrans</p>
                  </div>
                </Link>
              </div>
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center rounded-md p-2 text-white transition-all duration-200 hover:bg-primary-800 focus:outline-none"
                aria-label="Toggle sidebar"
              >
                <IconComponent
                  src="/icons/nav/hamburger.svg"
                  alt="Toggle Menu"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            {/* Icon links */}
            <div className="ml-auto flex items-center space-x-[14px]">
              <Link href="/home" className="flex items-center">
                <IconComponent
                  src="/icons/nav/home.svg"
                  alt="Home"
                  width={20}
                  height={20}
                />
              </Link>
              <Link href="/messages" className="flex items-center">
                <IconComponent
                  src="/icons/nav/mail.svg"
                  alt="Messages"
                  width={20}
                  height={20}
                />
              </Link>
              <Link href="/notifications" className="flex items-center pr-4">
                <IconComponent
                  src="/icons/nav/notif.svg"
                  alt="Notifications"
                  width={24}
                  height={24}
                />
              </Link>

              {/* User profile */}
              <LoginButton />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
