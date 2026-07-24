import { cache } from "react";

import {
  DEFAULT_BRANDING_SETTINGS,
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_PAYMENT_SETTINGS,
  businessSettingsService,
} from "src/lib/services/business-settings";

export const getStorefrontSettings = cache(async () => {
  try {
    return await businessSettingsService.getPublic();
  } catch {
    return {
      business: {
        displayName: DEFAULT_BUSINESS_SETTINGS.displayName,
        supportEmail: DEFAULT_BUSINESS_SETTINGS.supportEmail,
        supportPhone: DEFAULT_BUSINESS_SETTINGS.supportPhone,
        address: DEFAULT_BUSINESS_SETTINGS.address,
        defaultCurrency: DEFAULT_BUSINESS_SETTINGS.defaultCurrency,
        defaultLocale: DEFAULT_BUSINESS_SETTINGS.defaultLocale,
        timezone: DEFAULT_BUSINESS_SETTINGS.timezone,
      },
      branding: DEFAULT_BRANDING_SETTINGS,
      payments: DEFAULT_PAYMENT_SETTINGS,
    };
  }
});
