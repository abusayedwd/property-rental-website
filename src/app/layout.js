import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/pages/Navbar";
import Footer from "@/components/pages/Footer";
import { ConfigProvider } from "antd";
import Providers from "@/redux/Providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Property Rental",
  description: "Generated by Property site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      
          {/* <Navbar />
          {children}
          <Footer /> */}
         

          <Providers > 
          <Navbar />
          {children}
          <Footer />
          </Providers>
    
      </body>
    </html>
  );
}
