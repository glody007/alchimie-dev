import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "~/lib/providers";
import { Toaster } from "~/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Alchimiste Dev",
  description: "Transform your time into software",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <Providers>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
