"use client";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar/navbar";
import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import PageContext from "./context";
import defaultTheme from "./theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(getCookie("token") !== undefined);
  });

  return (
    <html lang="en">
      <body className={inter.className} style={{ minHeight: "100vh" }}>
        <ThemeProvider theme={defaultTheme}>
          <Navbar isLogged={isLogged} />
          <PageContext.Provider value={setLogged}>
            <Box
              sx={{
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {children}
            </Box>
          </PageContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
