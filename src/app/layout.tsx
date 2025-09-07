import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI 마케팅 문구 생성기",
    template: "%s | AI 마케팅 문구 생성기"
  },
  description: "AI가 자동으로 생성하는 최적화된 마케팅 문구. 가치 제언과 타겟팅 옵션만 입력하면 플랫폼별 맞춤 문구를 즉시 생성합니다.",
  keywords: ["AI", "마케팅", "문구", "자동생성", "OpenAI", "마케팅자동화", "카피라이팅"],
  authors: [{ name: "AI Marketing Generator" }],
  creator: "AI Marketing Generator",
  publisher: "AI Marketing Generator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    title: "AI 마케팅 문구 생성기",
    description: "AI가 자동으로 생성하는 최적화된 마케팅 문구",
    siteName: "AI 마케팅 문구 생성기",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI 마케팅 문구 생성기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 마케팅 문구 생성기",
    description: "AI가 자동으로 생성하는 최적화된 마케팅 문구",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
