import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["500", "600", "700"] });

export const viewport: Viewport = {
  themeColor: "#8B1935",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Dona da Revenda — Gestão para quem revende beleza",
    template: "%s | Dona da Revenda"
  },
  description: "Gestão para quem revende beleza: PDV, estoque, clientes, fiados e financeiro num só lugar, com cinco assistentes de IA que trabalham com você. Teste 7 dias grátis.",
  keywords: ["gestão para revendedoras", "cosméticos", "natura", "avon", "o boticário", "eudora", "sistema pdv", "controle de fiado", "inteligência artificial", "crm vendas"],
  authors: [{ name: "Dona da Revenda" }],
  creator: "Dona da Revenda",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://donadarevenda.com.br",
    title: "Dona da Revenda — Gestão para quem revende beleza",
    description: "Estoque, vendas, fiados e financeiro organizados, com cinco assistentes de IA ajudando você todos os dias.",
    siteName: "Dona da Revenda",
    images: [{
      url: "https://donadarevenda.com.br/icons/icon-512x512.png",
      width: 512,
      height: 512,
      alt: "Logo Dona da Revenda"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dona da Revenda — Gestão para quem revende beleza",
    description: "Sua revenda organizada. Seu tempo de volta.",
    images: ["https://donadarevenda.com.br/icons/icon-512x512.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dona da Revenda",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dona da Revenda" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>

        {/* Service Worker Registration */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('[PWA] SW registered:', reg.scope); })
                    .catch(function(err) { console.log('[PWA] SW failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
