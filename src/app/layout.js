import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Add this to prevent font loading issues
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Add this to prevent font loading issues
});

export const metadata = {
  title: "Recursion Tree Visualizer",
  keywords: [
    "recursion",
    "tree visualization",
    "algorithm visualization",
    "recursion tree",
    "visualization tool",
    "recursive algorithms",
    "data structures",
    "programming education",
    "algorithm analysis",
    "recursion visualizer",
    "recursion examples",
    "recursion explanation",
    "recursion step by step",
    "recursion for beginners",
    "recursion in programming",
    "recursion in computer science",
    "recursion tree generator",
    "recursion tree diagram",
    "recursion tree solver",
    "recursion tree tool",
    "recursion tree online",
    "recursion tree calculator",
    "recursion tree breakdown",
    "recursion tree analysis",
    "recursion tree method",
    "recursion tree approach",
    "recursion tree problems",
    "recursion tree solution",
    "recursion tree practice",
  ],
  authors: [
    {
      name: "Arpit Pathak",
      url: "https://www.linkedin.com/in/arpit-pathak-413b2b209/",
    },
  ],
  creator: "Your Name",
  openGraph: {
    title: "Recursion Tree Visualizer",
    description: "Visualize recursion trees for better understanding of recursive algorithms.",
    url: "https://yourwebsite.com/recursion-tree-visualizer",
    siteName: "Recursion Tree Visualizer",
    images: [
      {
        url: "https://www.linkedin.com/in/arpit-pathak-413b2b209/",
        width: 1200,
        height: 630,
        alt: "Recursion Tree Visualizer OG Image",
      },
    ],
    type: "website",
  },    
  description: "Visualize recursion trees for better understanding of recursive algorithms.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/shortcut-icon.png",
  },
  themeColor: "#ffffff",
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "Recursion Tree Visualizer",
    description: "Visualize recursion trees for better understanding of recursive algorithms.",
    creator: "@yourtwitterhandle",
    images: ["https://www.linkedin.com/in/arpit-pathak-413b2b209/"],
  },
  alternates: {
    canonical: "https://yourwebsite.com/recursion-tree-visualizer",
    types: {
      "application/rss+xml": "/feed.xml",
      "application/atom+xml": "/atom.xml",
    },
  },
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-site-verification-code",
    other: {
      name: "BingSiteAuth",
      value: "your-bing-site-verification-code",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}