import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Hero from "./components/hero";

const montserrat = Montserrat({ subsets: ["cyrillic"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: {
    absolute: "1° Anno | Informatica",
    default: "Informatica",
    template: "%s | Informatica"
  },
  description: "Tutto ciò che serve agli studenti informatici in un luogo solo",
  icons: {
    icon: "/icon.svg"
  },
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
        <Navbar></Navbar>
        <Hero></Hero>
          {children}
        <Footer></Footer>
        <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
      </body>
    </html>
  );
}
