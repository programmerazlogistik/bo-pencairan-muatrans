"use client";

import { Suspense } from "react";

import { LoadingStatic } from "@muatmuat/ui/Loading";
import { Toaster } from "@muatmuat/ui/Toaster";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingStatic />}>
      {children}
      <Toaster variant="muatparts" />
    </Suspense>
  );
}
