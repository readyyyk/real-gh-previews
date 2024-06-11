import '@/styles/globals.css';

import { GeistSans } from 'geist/font/sans';

import { TRPCReactProvider } from '@/trpc/react';
import { type ReactNode } from 'react';
import Profile from '@/app/Profile';

export const metadata = {
    title: 'Real GitHub previews',
    description:
        'Show off your github public web projects with real preview instead of text',
    icons: [{ rel: 'icon', url: '/favicon.svg' }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={`${GeistSans.variable} dark`}>
            <body className="min-h-screen w-full">
                <TRPCReactProvider>
                    {children}
                    <Profile />
                </TRPCReactProvider>
            </body>
        </html>
    );
}
