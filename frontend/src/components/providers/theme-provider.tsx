'use client'

import { type ThemeProviderProps } from 'next-themes'
import dynamic from 'next/dynamic'
import * as React from 'react'

const NextThemesProvider = dynamic(
	() => import('next-themes').then((e) => e.ThemeProvider),
	{
		ssr: false,
	}
)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props} attribute="class" defaultTheme="system" enableSystem>{children}</NextThemesProvider>
}
