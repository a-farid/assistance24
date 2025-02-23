import { Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/providers/theme-provider";
import ToastProvider from "../components/providers/toaster-provider";
import Providers from "../components/providers/redux-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "UTAJ-APP",
    template: "%s | UTAJ",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body
          suppressHydrationWarning={true}
          className={`${poppins.variable} ${josefin.variable} bg-gradient-global duration-300 dark:text-white text-black transition-colors min-h-screen pb-5`}
        >
          <ToastProvider />
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </Providers>
  );
}
// const Custom = ({ children }: { children: React.ReactNode }) => {
//   const { isLoading } = useLoadUserQuery("user");
//   return (
//     <>
//       {isLoading ? (
//         <div>
//           <Loading />
//         </div>
//       ) : (
//         { children }
//       )}
//     </>
//   );
// };
