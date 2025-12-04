import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Nav from "./components/navigation/nav"; 
import Footer from "@/app/homepage/Footer";
import { Toaster } from "@/components/ui/sonner";
// Re-added the Providers import as requested
import { Providers } from "./components/providers"; 

// 1. Primary Font (UI, Body text) - Clean & Readable
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 2. Secondary Font (Scores, Team Names, Headers) - "Sports Jersey" style
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

// 3. SEO Metadata for LASU Sports Hub
export const metadata: Metadata = {
  title: {
    default: "LASU Sports Hub | Live Faculty Scores & Standings",
    template: "%s | LASU Sports Hub",
  },
  description: "The official home for Lagos State University sports. Track live football scores, faculty standings, fixtures, and match highlights in real-time.",
  keywords: ["LASU", "Sports", "Live Scores", "Faculty League", "University Football", "Nigeria Universities", "LASU Sports Hub"],
  authors: [{ name: "LASU Tech Team" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://lasusportshub.com",
    title: "LASU Sports Hub | Live Scores",
    description: "Real-time updates for the LASU Faculty League.",
    siteName: "LASU Sports Hub",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617", // Matches bg-slate-950
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> 
      <body
        className={`
          ${inter.variable} 
          ${oswald.variable} 
          antialiased 
          text-slate-200
        `}
      >
        {/* The Providers component now wraps the entire application, handling Auth and potentially Theme */}
        <Providers> 
          
          <Nav />

          <main className="min-h-screen pt-20 sm:pt-24 lg:pt-28 flex flex-col relative z-0">
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none -z-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            
            {children}
          </main>

          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#1e293b', 
                border: '1px solid #334155', 
                color: 'white',
              }
            }}
          />

          <Footer />
        </Providers>
      </body>
    </html>
  );
}