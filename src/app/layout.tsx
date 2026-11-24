import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "../components/layout/Navbar/Navbar";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { Suspense } from "react";
import { LocalizedContent, PreferencesProvider } from "@/components/ui-preferences";
import AppToaster from "@/components/AppToaster";
import Footer from "@/src/components/layout/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import TanProviders from "../providers/TanProvider";

const robotoHeading = Roboto({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "goodfolk — thoughtful everyday goods",
    template: "%s | goodfolk",
  },
  description:
    "Discover thoughtful essentials from independent labels and familiar favorites.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        robotoHeading.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var l=localStorage.getItem('ecommerce-locale');if(l==='ar'||l==='en'){document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'}var t=localStorage.getItem('ecommerce-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark'}else if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light'}}catch(e){}",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <TanProviders>
          <PreferencesProvider>
            <LocalizedContent>
              <Navbar />
              <Suspense fallback={null}>
                <Breadcrumbs />
              </Suspense>
              {children}
              <Footer />
            </LocalizedContent>
            <AppToaster />
          </PreferencesProvider>
        </TanProviders>
      </body>
    </html>
  );
}
