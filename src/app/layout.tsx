import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import { type ReactNode } from "react";
import { OctoKitContextProvider } from "@/components/OctoKitContext";
import Profile from "@/app/Profile";

export const metadata = {
  title: "Custom auth Example ",
  description: "T3 app with custom authentication example",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body className="min-h-screen w-full">
        <TRPCReactProvider>
          <OctoKitContextProvider>
            {children}
            <Profile />
          </OctoKitContextProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
