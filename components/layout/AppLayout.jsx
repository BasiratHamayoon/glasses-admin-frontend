"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { fetchProfile, adminLogout } from '@/redux/actions/adminAuthActions';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Spinner } from '@/components/loaders-and-skeletons/Spinner';

export function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginPage = pathname === '/login';
  
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  // Safe destructuring of token and user
  const { token: reduxToken, user } = useSelector((state) => state.adminAuth) || {};
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true); // 🔒 Security State
  
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🔒 IRON-CLAD AUTHENTICATION GUARD
  useEffect(() => {
    if (!isMounted) return;

    const verifySession = async () => {
      let localToken = null;
      if (typeof window !== 'undefined') {
        localToken = localStorage.getItem('adminToken');
      }

      const activeToken = reduxToken || localToken;

      // 1. No token -> Redirect to login
      if (!activeToken) {
        setIsVerifying(false);
        if (!isLoginPage) router.replace('/login');
        return;
      }

      // 2. Has token & on Login Page -> Redirect to dashboard
      if (activeToken && isLoginPage) {
        router.replace('/dashboard');
      }

      // 3. Has token but NO user data -> Fetch from server to verify token validity!
      if (activeToken && !user && !isLoginPage) {
        try {
          // This API call proves the token is mathematically valid
          await dispatch(fetchProfile()).unwrap();
          setIsVerifying(false);
        } catch (error) {
          // 🚨 VULNERABILITY BLOCKED: Token is invalid/fake/expired. Destroy it.
          dispatch(adminLogout());
          setIsVerifying(false);
          router.replace('/login');
        }
      } else {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [isMounted, isLoginPage, pathname, reduxToken, user, dispatch, router]);

  useEffect(() => {
    if (isDesktop) setIsMobileOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // While verifying the token with the backend, show a blank/loading screen
  if (!isMounted || isVerifying) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#111111] flex items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  // Double check: if still no token, don't render dashboard HTML
  if (!reduxToken && typeof window !== 'undefined' && !localStorage.getItem('adminToken') && !isLoginPage) {
    return <div className="min-h-screen bg-neutral-50 dark:bg-[#111111]" />;
  }

  if (isLoginPage) {
    return <main dir={isArabic ? 'rtl' : 'ltr'}>{children}</main>;
  }

  return (
    <div 
      dir={isArabic ? 'rtl' : 'ltr'}
      className="h-screen w-full bg-neutral-50 dark:bg-[#111111] flex flex-col text-black dark:text-white selection:bg-[#E9B10C] selection:text-black overflow-hidden"
    >
      <AdminHeader 
        toggleMobile={() => setIsMobileOpen(true)} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      
      <div className="flex flex-1 overflow-hidden relative w-full h-full">
        
        {isMobileOpen && !isDesktop && (
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <AdminSidebar 
          isMobileOpen={isMobileOpen} 
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
          isDesktop={isDesktop} 
        />
        
        <main className="flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-10 w-full relative scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}