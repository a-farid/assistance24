import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import {ReactNode} from 'react';
import './globals.css';
import { Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/providers/theme-provider";

// import { ThemeProvider } from 'next-themes'
import ToastProvider from "../components/providers/toaster-provider";
import Providers from "../components/providers/redux-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Assistenz365",
    template: "%s | Assistenz365",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

type Props = {
  children: ReactNode;
};

export default async function LocaleLayout({children}: Props) {
  const locale = await getLocale();

  const messages = await getMessages();

  return (
    <html lang="en" >
      <body suppressHydrationWarning={true} className={`${poppins.variable} ${josefin.variable} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider>
        <Providers>
        <ToastProvider />
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
