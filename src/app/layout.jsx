import MainLayout from "@/container/Layouts/MainLayout";

import "./globals.scss";

export const metadata = {
  title: "Muatrans Pencairan - BO",
  description: "Back Office for Muatrans Pencairan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-white`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
