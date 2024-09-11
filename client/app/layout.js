import { Inter } from "next/font/google";
import Script from "next/script";
import "./global.css";
import { SideMenuProvider } from "@/context/SideMenuContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Comprarla",
  description: "ComprarLa online shop.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SideMenuProvider>{children}</SideMenuProvider>
        {/* Load Telegram Web App script */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
