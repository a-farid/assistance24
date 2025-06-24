'use client'

import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';

import * as React from 'react'
import theme from './mui-theme';


const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export function MuiThemeProvider({ children, ...props }: any) {
    return <ThemeProvider theme={theme}>
              {children}
           </ThemeProvider>
}




