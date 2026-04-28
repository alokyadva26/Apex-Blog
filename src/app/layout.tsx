import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: "Apex Blog",
  description: "High-density intellectual consumption curated for the modern thinker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} font-sans bg-[#f8f9fa] text-slate-900 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium tracking-wide uppercase">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-slate-900 block mb-1">APEX BLOG</span>
              &copy; 2024 APEX BLOG. ENGINEERED FOR HIGH-DENSITY INTELLECTUAL CONSUMPTION.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-800 transition-colors">RSS Feed</a>
              <a href="#" className="hover:text-slate-800 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
