import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NeuroSight - Alzheimer’s MRI Diagnostic Co-pilot',
  description: 'AI-powered staging of Alzheimer’s from brain MRI with Grad-CAM explainability and clinical LangChain agent.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <main className="pt-16 md:pt-20">{children}</main>
      </body>
    </html>
  );
}