import './globals.css';
import type { Metadata } from 'next';
import Script, { type ScriptProps } from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Footer } from '@/components/ui/footer';
import { Nav } from '@/components/ui/nav';
import { Toaster } from '@/components/ui/toaster';
import { WebsiteSchema } from '@/components/ui/website-schema';
import config from '@/config';
import {
  geistMono,
  getBodyClass,
  getFontClass,
  ibmPlexSerif,
  inter,
} from '@/lib/utils/fonts';

type CustomScript = {
  src: string;
  strategy: ScriptProps['strategy'];
  attributes?: Record<string, string>;
};

const siteConfig = config;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.title} | ${siteConfig.nav.title}`,
  description: siteConfig.description,
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    types: {
      'application/rss+xml': `${siteConfig.url}/feed.xml`,
      'application/atom+xml': `${siteConfig.url}/atom.xml`,
      'application/feed+json': `${siteConfig.url}/feed.json`,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Get the current font family from config
  const fontFamily = siteConfig?.font?.family || 'geist';

  // Get font class based on configuration
  const fontClass = getFontClass(fontFamily);

  // Get appropriate body class
  const bodyClass = getBodyClass(fontFamily);

  // Determine which font variable classes to include
  const fontClasses: string[] = [];
  // Always add the selected font class first for CSS specificity
  fontClasses.push(fontClass);
  // Then add the other fonts
  fontClasses.push(geistMono.variable);
  fontClasses.push(inter.variable);
  fontClasses.push(ibmPlexSerif.variable);

  return (
    <html className={fontClasses.join(' ')} data-font={fontFamily} lang="en">
      <body className={bodyClass}>
        {siteConfig.scripts.head.map((script: CustomScript) => (
          <Script
            key={`head-script-${script.src}`}
            src={script.src}
            strategy={script.strategy}
            {...script.attributes}
          />
        ))}
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">
            <NuqsAdapter>{children}</NuqsAdapter>
          </main>
          <Footer />
        </div>
        <Toaster />
        {siteConfig.scripts.body.map((script: CustomScript) => (
          <Script
            key={`body-script-${script.src || 'inline'}`}
            src={script.src}
            strategy={script.strategy}
            {...script.attributes}
          />
        ))}

        <WebsiteSchema />
      </body>
    </html>
  );
}
