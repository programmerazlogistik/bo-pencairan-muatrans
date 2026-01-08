"use client";

import {
  AuthCredential,
  AuthUser,
  createAuthAdapter,
} from "@muatmuat/lib/auth-adapter";

import { login } from "@/services/auth/login";

import { PUBLIC_ROUTES } from "./constants";

// 🎯 Let TypeScript infer our AppUser type automatically
export const { AuthProvider, useAuth } = createAuthAdapter({
  guard: {
    publicRoutes: PUBLIC_ROUTES,
    loggedOutRedirectTo: `/login`,
    loggedInRedirectTo: null,
  },

  getSession: async (
    _accessToken,
    _refreshToken
  ): Promise<{ user: AuthUser }> => {
    try {
      // Try to get user data from localStorage first (stored during login)
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return { user: userData };
      }

      // Fallback to profile API if needed
      // const response = await getProfile();

      // return {
      //   user: {
      //     name: "Admin",
      //     email: "admin@example.com",
      //     photo: undefined,
      //     phone: undefined,
      //     data: {},
      //   },
      // };
    } catch {
      return {
        user: {
          data: {} as any,
        },
      };
    }
  },

  isLoggedIn: (user) => Boolean(user.email),
  login: async (credential: AuthCredential) => {
    let loggedIn = false;
    let accessToken: string | null = null;
    let refreshToken: string | null = null;

    const response = await login({
      email: credential.email,
      password: credential.password,
    });

    if (response?.tokens) {
      accessToken = response.tokens.accessToken;
      refreshToken = response.tokens.refreshToken;
      loggedIn = true;

      // Store user data from login response in localStorage for getSession to access
      if (response.user) {
        localStorage.setItem("currentUser", JSON.stringify(response.user));
      }
    }

    return { loggedIn, accessToken, refreshToken };
  },

  logout: async (_router, _accessToken, _refreshToken) => {
    // Clear stored user data on logout
    localStorage.removeItem("currentUser");
    window.location.replace(`${process.env.NEXT_PUBLIC_ASSET_REVERSE}/login`);
  },
});
