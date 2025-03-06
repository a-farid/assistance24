import clsx from 'clsx';
import {Inter} from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import {ReactNode} from 'react';
import './globals.css';
import { Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/providers/theme-provider";
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

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang="en" suppressHydrationWarning>
    <Providers>
      <body className={`${poppins.variable} ${josefin.variable} bg-gradient-global duration-300 dark:text-white text-black transition-colors min-h-screen pb-5`} suppressHydrationWarning>
        <ToastProvider />
        <ThemeProvider>
        <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
      </ThemeProvider>
      </body>
    </Providers>
    </html>
  );
}
