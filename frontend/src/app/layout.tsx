import {NextIntlClientProvider} from 'next-intl';
import { getMessages} from 'next-intl/server';
import {ReactNode} from 'react';
// @ts-ignore: side-effect import for global CSS
import './globals.css';
import { Poppins, Roboto } from "next/font/google";
import { ThemeProvider } from "../components/providers/theme-provider";
import ToastProvider from "../components/providers/toaster-provider";
// import Providers from "../components/providers/redux-provider";
import { Metadata } from "next";
import TanStackProvider from '@/components/providers/tanstack-provider';
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

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});
export default async function LocaleLayout({children}: {children: ReactNode}) {

  const messages = await getMessages();
  return (
    <html lang="en" >
      <body suppressHydrationWarning={true} className={`${poppins.variable} ${roboto.variable} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-roboto`}>
        <TanStackProvider>
          <ThemeProvider>
          <ToastProvider />
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
