import { Tajawal, Cairo, Montserrat } from 'next/font/google';
import "./globals.css";
import { Providers } from '@/providers/Providers';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from 'sonner';

const tajawal = Tajawal({ subsets: ['arabic', 'latin'], weight: ['400', '500', '700', '900'], variable: '--font-tajawal', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '600', '700', '900'], variable: '--font-cairo', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '700', '900'], variable: '--font-montserrat', display: 'swap' });

export const metadata = {
  title: 'EYENOIR | Admin Panel',
  description: 'Admin Dashboard for EYENOIR',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${tajawal.variable} ${cairo.variable} ${montserrat.variable}`}>
      <body suppressHydrationWarning={true} className="bg-neutral-50 dark:bg-[#111111] text-black dark:text-white">
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}