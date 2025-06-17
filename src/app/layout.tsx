import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Hero from "./components/hero";
import DonationButton from "./components/donation/DonationButton";
import Snow from "./components/snow";
import Whiteboard from "./components/Whiteboard";

const montserrat = Montserrat({ subsets: ["cyrillic"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: {
    absolute: "1° Anno | Informatica",
    default: "Informatica",
    template: "%s | Informatica"
  },
  description: "Tutto ciò che serve agli studenti informatici in un luogo solo",
  openGraph: {
    title: {
      absolute: "1° Anno | Informatica",
      default: "Informatica",
      template: "%s | Informatica"
    },
    description: "Tutto ciò che serve agli studenti informatici in un luogo solo",
    images: {
      url: "https://art.pixilart.com/c562a069cbc4da4.png",
    }
  },
  other: {
    "google-adsense-account": "ca-pub-8738596364045665"
  }
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {
  return (
    <html lang="it">
      <body className={`${montserrat.className} dark:bg-stone-950 bg-stone-100 min-h-screen flex flex-col justify-between items-center relative z-0`}>
        {/*<Snow/>*/}
        <Navbar></Navbar>
        <Hero></Hero>
        <Whiteboard />
          {children}
        <Footer></Footer>
        <DonationButton />
      </body>

      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
