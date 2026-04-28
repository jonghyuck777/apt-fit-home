import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "아파트 추천 | 부부 직장역 기준 중간지점 아파트 찾기",
  description: "부부 직장역을 입력하면 중간지점 기준으로 최적의 아파트를 실거래가와 함께 추천해드려요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}