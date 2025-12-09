import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Nav from "./components/navigation/nav"; 
import Footer from "@/app/homepage/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./components/providers"; 

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LASU Sports Hub | Live Faculty Scores & Standings",
    template: "%s | LASU Sports Hub",
  },
  description: "The official home for Lagos State University sports.  Track live football scores, faculty standings, fixtures, and match highlights in real-time.",
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
  themeColor: "#020617",
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
    <html lang="en" className="dark" style={{ fontFamily: "'Cormorant Garamond', serif" }}> 
      <body
        className={`${cormorantGaramond. variable} antialiased text-slate-200`}
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        <Providers> 
          <Nav />

          <main className="min-h-screen pt-20 sm:pt-24 lg:pt-28 flex flex-col relative z-0">
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none -z-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise. svg')]"></div>
            
            {children}
          </main>

          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#1e293b', 
                border: '1px solid #334155', 
                color: 'white',
                fontFamily: "'Cormorant Garamond', serif",
              }
            }}
          />

          <Footer />
        </Providers>
      </body>
    </html>
  );
}