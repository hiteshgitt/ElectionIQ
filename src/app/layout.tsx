import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Chatbot from "@/components/Chatbot";
import Header from "@/components/Header";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ElectionIQ – Smart Election Learning Assistant 🇮🇳",
  description: "Personalized election guidance for Indian citizens powered by Vertex AI and Google Cloud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          {children}
          <Chatbot />
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-PPV9D6JMSV" />
    </html>
  );
}
