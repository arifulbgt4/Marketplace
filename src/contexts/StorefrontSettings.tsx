"use client";

import { createContext, useContext, type ReactNode } from "react";

export type StorefrontSettings = {
  business: {
    displayName: string;
    supportEmail: string | null;
    supportPhone: string | null;
    address: string | null;
    defaultCurrency: string;
    defaultLocale: string;
    timezone: string;
  };
  branding: {
    logoUrl: string | null;
    faviconUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    seoTitle: string | null;
    seoDescription: string | null;
    socialLinks: {
      facebook?: string | null;
      instagram?: string | null;
      linkedin?: string | null;
      youtube?: string | null;
    };
  };
};

const StorefrontSettingsContext = createContext<StorefrontSettings | null>(null);

export function StorefrontSettingsProvider({
  value,
  children,
}: {
  value: StorefrontSettings;
  children: ReactNode;
}) {
  return (
    <StorefrontSettingsContext.Provider value={value}>
      {children}
    </StorefrontSettingsContext.Provider>
  );
}

export function useStorefrontSettings() {
  return useContext(StorefrontSettingsContext);
}
