import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import BottomNav from '../components/common/BottomNav';
import NetworkBanner from '../components/common/NetworkBanner';
import CapacitorInit from '../components/common/CapacitorInit';

export const metadata = {
  title: 'KisanDrishti • Early Crop Disease & Pest Intelligence (SIH 2026)',
  description:
    'AI-powered farmer-friendly crop health protection platform. Instant foliar diagnosis, symptoms, causes, non-chemical controls, and verified ICAR recommendations in 20 Indian languages.',
  keywords: [
    'crop disease detection',
    'pest management',
    'smart agriculture',
    'kisan',
    'ICAR',
    'plant health',
    'SIH 2026',
    'Android APK',
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col text-gray-900 antialiased selection:bg-emerald-200">
        <LanguageProvider>
          <AuthProvider>
            <CapacitorInit />
            <NetworkBanner />
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-10">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
