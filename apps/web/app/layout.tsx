import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Dona da Revenda — Gestão com IA para Consultoras de Beleza",
    template: "%s | Dona da Revenda"
  },
  description: "A primeira plataforma de gestão para revendedoras de cosméticos 100% movida a Inteligência Artificial. Controle seu PDV, estoque, clientes (fiado) e financeiro em um só lugar.",
  keywords: ["gestão para revendedoras", "cosméticos", "natura", "avon", "o boticário", "eudora", "sistema pdv", "controle de fiado", "inteligência artificial", "crm vendas"],
  authors: [{ name: "Dona da Revenda" }],
  creator: "Dona da Revenda",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://donadarevenda.com.br",
    title: "Dona da Revenda — Gestão com IA para Consultoras",
    description: "Controle seu estoque, fluxo de caixa e fiados com a ajuda de 5 Agentes de IA trabalhando para você 24h por dia.",
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
    title: "Dona da Revenda — Gestão com IA para Consultoras",
    description: "A IA que cuida do seu negócio de beleza.",
    images: ["https://donadarevenda.com.br/icons/icon-512x512.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dona da Revenda" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
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
