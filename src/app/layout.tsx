import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaseKeeper — Legal Assistance & Case Management Platform",
  description: "Citizen legal guidance in English & Hindi, official government schemes, verified advocate directory, and secure lawyer briefing workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans bg-[#F8FAFC] text-[#0F172A] min-h-screen">
        {children}
      </body>
    </html>
  );
}
