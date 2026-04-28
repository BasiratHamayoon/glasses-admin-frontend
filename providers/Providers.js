"use client";

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}