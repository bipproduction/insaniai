// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import './globals.css'

import { ColorSchemeScript, MantineProvider } from '@mantine/core';

export const metadata = {
  title: 'Insaniai ',
  description: 'have fun with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning={true}>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}