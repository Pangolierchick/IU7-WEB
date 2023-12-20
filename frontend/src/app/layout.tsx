"use client";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar/navbar";
import { ThemeProvider } from "@emotion/react";
import defaultTheme from "./theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={defaultTheme}>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
