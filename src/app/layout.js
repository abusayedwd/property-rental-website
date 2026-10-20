// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/pages/Navbar";
// import Footer from "@/components/pages/Footer";
// import { ConfigProvider } from "antd";
// import Providers from "@/redux/Providers";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Property Rental",
//   description: "Property sell and rent",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">

// <head>
//         {/* Metadata */}
//         <title>{metadata.title}</title>
//         <meta name="description" content={metadata.description} /> 
//         <link rel="icon" href="/logo.png" sizes="32x32" type="image/png" /> 
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
      
//           {/* <Navbar />
//           {children}
//           <Footer /> */}
         

//           <Providers > 
//           <Navbar />
//           {children}
//           <Footer />
//           </Providers>
    
//       </body>
//     </html>
//   );
// }

 

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/pages/Navbar";
import Footer from "@/components/pages/Footer";
import { ConfigProvider } from "antd";
import Providers from "@/redux/Providers";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_URL } from "@/utils/site";
 
 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`, // each page sets its own title
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["Bangladesh property", "flat for rent", "apartment for sale", "Dhaka rent", "house for rent", "real estate Bangladesh"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/Hero.jpg", width: 1344, height: 768, alt: "Homes for rent and sale on MyNextHome" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/images/Hero.jpg"],
  },
};

export const viewport = {
  themeColor: "#222F55",
};

export default function RootLayout({ children }) {

 

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-wrap`}>

        

        <Providers>
          {/* <ProviderTheme> */}

          <Navbar />
          {children}
          <Footer />
          {/* </ProviderTheme> */}
        </Providers>
      </body>
    </html>
  );
}
