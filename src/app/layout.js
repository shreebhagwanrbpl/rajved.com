import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL(
    "https://rajved.com"
  ),

  title:
    "Raj Biosis | Biomedical & Diagnostic Equipment",

  description:
    "Raj Biosis Private Limited  supplies CBC Machines, Hematology Analyzers, Biochemistry Analyzers, ELISA Readers and laboratory equipment across India.",

  keywords: [
    "Biomedical Equipment Supplier",
    "Laboratory Equipment Supplier",
    "CBC Machine Supplier",
    "Hematology Analyzer Supplier",
    "Biochemistry Analyzer Supplier",
    "Diagnostic Equipment Supplier",
    "Medical Equipment Supplier India",
    "Raj Biosis",
    "Raj Biosis",
  ],

  openGraph: {
    title:
      "Raj Biosis | Biomedical & Diagnostic Equipment",

    description:
      "Human-centered healthcare technology with warmer, approachable visual cues.",

    url: "https://rajved.com",

    siteName: "Raj Biosis Private Limited",

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Raj Biosis Private Limited",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Raj Biosis | Biomedical & Diagnostic Equipment",

    description:
      "Human-centered healthcare technology with warmer, approachable visual cues.",

    images: ["/logo.png"],
  },

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  alternates: {
    canonical: "https://rajved.com",
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#FFF9F8] text-[#2D1818] antialiased selection:bg-[#E05353] selection:text-white" suppressHydrationWarning>
        <Navbar />

        <main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#2D1818",
                color: "#FFFFFF",
                border: "1px solid #FBD5D3",
              },
            }}
          />

          {children}
        </main>

        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}