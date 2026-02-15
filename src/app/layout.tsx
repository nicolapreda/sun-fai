import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sun-Fai | Cooperativa Energia Rinnovabile",
  description: "Sun-Fai è una cooperativa nata per essere una comunità energetica rinnovabile sociale e solidale. Scopri come condividere l'energia in modo sostenibile.",
  icons: {
    icon: '/assets/logo-min.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
