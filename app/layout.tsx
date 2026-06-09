import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import "react-beautiful-color/dist/react-beautiful-color.css";
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Databuddy } from '@databuddy/sdk/react';

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shadowstudio.swamii.me"),
  title: "Shadow Studio",
  description: "Interactive CSS shadow editor",
  openGraph: {
    title: "Shadow Studio",
    description: "Interactive CSS shadow editor",
    url: "https://shadowstudio.swamii.me",
    siteName: "Shadow Studio",
    images: [
      {
        url: "/ogimage.png",
        width: 1200,
        height: 630,
        alt: "Shadow Studio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadow Studio",
    description: "Interactive CSS shadow editor",
    images: ["/ogimage.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Databuddy
        clientId="6442d463-011b-41d5-8d74-f72646d27489"
        trackHashChanges={true}
        trackAttributes={true}
        trackOutgoingLinks={true}
        trackInteractions={true}
        trackWebVitals={true}
        trackErrors={true}
      />
          </ThemeProvider>
      </body>
    </html>
  );
}
