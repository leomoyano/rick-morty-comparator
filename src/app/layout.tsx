import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rick & Morty Character Comparator",
  description: "Compare episodes between two selected characters"
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
