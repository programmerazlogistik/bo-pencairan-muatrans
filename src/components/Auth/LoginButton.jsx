"use client";

import { useRouter } from "next/navigation";

import { ChevronDown, Profile } from "@muatmuat/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@muatmuat/ui/Dropdown";

import { useAuth } from "@/lib/auth";

const LoginButton = () => {
  const router = useRouter();
  const { dataUser, isLoggedIn, logout } = useAuth();

  const name = dataUser?.name || "Login";

  const isLoginButton = name === "Login";

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className="flex w-fit cursor-pointer items-center space-x-1 rounded-md p-2 text-white transition-all duration-200"
      onClick={() => {
        const route =
          process.env.NODE_ENV === "development"
            ? "/login"
            : `${process.env.NEXT_PUBLIC_BF_WEB}/adminlogin`;

        if (!isLoggedIn) {
          router.push(route);
        }
      }}
    >
      {isLoginButton ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{name}</span>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2">
              <Profile className="h-5 w-5 text-white" />
              <span className="text-sm font-medium">{`${name}`}</span>
              <ChevronDown className="h-4 stroke-primary-700 stroke-1" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleLogout} className="text-error-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default LoginButton;
