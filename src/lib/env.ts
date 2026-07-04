import { z } from "zod";

export const envSchema = z.object({
  // Required environment variables
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  
  // Database (PostgreSQL via Docker/Postgres connection)
  POSTGRES_PRISMA_URL: z.string().url("POSTGRES_PRISMA_URL must be a valid PostgreSQL connection URL"),
  POSTGRES_URL_NON_POOLING: z.string().url("POSTGRES_URL_NON_POOLING must be a valid PostgreSQL direct connection URL"),
  
  // Application configuration
  NEXT_PUBLIC_MARKETPLACE_NAME: z.string().min(1, "NEXT_PUBLIC_MARKETPLACE_NAME must be set"),
  NEXT_PUBLIC_DOMAIN_URL: z.string().url("NEXT_PUBLIC_DOMAIN_URL must be a valid URL"),
  
  // API integration URLs
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().min(1, "NEXT_PUBLIC_MAPBOX_TOKEN must be set if using maps"),
  
  // Currency configuration (ISO 4217 codes)
  NEXT_PUBLIC_CURRENCY_CODE: z.string().length(3, "Currency code must be 3 characters (ISO 4217)").default("USD"),
  NEXT_PUBLIC_CURRENCY_SYMBOL: z.string().min(1, "Currency symbol must be set").default("$"),
  NEXT_PUBLIC_CURRENCY_LOCALE: z.string().min(2, "Currency locale must be set").default("en-US"),
  
  // Pricing configuration
  NEXT_PUBLIC_MAX_PRICE: z.string().refine(val => !isNaN(parseFloat(val)), {
    message: "NEXT_PUBLIC_MAX_PRICE must be a valid number"
  }).default("100000"),
  
  // Search configuration
  NEXT_PUBLIC_SEARCH_DEBOUNCE_MS: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "NEXT_PUBLIC_SEARCH_DEBOUNCE_MS must be a valid integer"
  }).default("300"),
  
  // Rate limiting
  NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS must be a valid integer"
  }).default("900000"),
  NEXT_PUBLIC_RATE_LIMIT_MAX: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "NEXT_PUBLIC_RATE_LIMIT_MAX must be a valid positive integer"
  }).default("100"),
  
  // File upload configuration
  NEXT_PUBLIC_MAX_UPLOAD_SIZE: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "NEXT_PUBLIC_MAX_UPLOAD_SIZE must be a valid positive integer"
  }).default("5242880"),
  NEXT_PUBLIC_ALLOWED_FILE_TYPES: z.string().default("image/jpeg,image/png,image/gif"),
  
  // Session configuration
  NEXT_PUBLIC_SESSION_MAX_AGE: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "NEXT_PUBLIC_SESSION_MAX_AGE must be a valid positive integer (in seconds)"
  }).default("2592000"),
  
  // Security headers configuration
  NEXT_PUBLIC_ENABLE_CSP: z.string().transform(val => val === "true" ? true : false).default(false),
  NEXT_PUBLIC_ENABLE_HSTS: z.string().transform(val => val === "true" ? true : false).default(true),
  
  // CORS configuration
  NEXT_PUBLIC_CORS_ORIGIN: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_CORS_CREDENTIALS: z.string().transform(val => val === "true" ? true : false).default(true),
  
  // External API configuration
  NEXT_PUBLIC_PAYMENT_API_TIMEOUT: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "NEXT_PUBLIC_PAYMENT_API_TIMEOUT must be a valid integer"
  }).default("30000"),
  NEXT_PUBLIC_EMAIL_SERVICE_TIMEOUT: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "NEXT_PUBLIC_EMAIL_SERVICE_TIMEOUT must be a valid integer"
  }).default("10000"),
});

export type EnvVarSchema = z.infer<typeof envSchema>;

// Enhanced validation function with detailed error reporting
export function validateEnv() {
  try {
    const envVars = {
      NODE_ENV: process.env.NODE_ENV || "development",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
      NEXT_PUBLIC_MARKETPLACE_NAME: process.env.NEXT_PUBLIC_MARKETPLACE_NAME,
      NEXT_PUBLIC_DOMAIN_URL: process.env.NEXT_PUBLIC_DOMAIN_URL,
      NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      NEXT_PUBLIC_CURRENCY_CODE: process.env.NEXT_PUBLIC_CURRENCY_CODE || "USD",
      NEXT_PUBLIC_CURRENCY_SYMBOL: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$",
      NEXT_PUBLIC_CURRENCY_LOCALE: process.env.NEXT_PUBLIC_CURRENCY_LOCALE || "en-US",
      NEXT_PUBLIC_MAX_PRICE: process.env.NEXT_PUBLIC_MAX_PRICE || "100000",
      NEXT_PUBLIC_SEARCH_DEBOUNCE_MS: process.env.NEXT_PUBLIC_SEARCH_DEBOUNCE_MS || "300",
      NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS: process.env.NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS || "900000",
      NEXT_PUBLIC_RATE_LIMIT_MAX: process.env.NEXT_PUBLIC_RATE_LIMIT_MAX || "100",
      NEXT_PUBLIC_MAX_UPLOAD_SIZE: process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || "5242880",
      NEXT_PUBLIC_ALLOWED_FILE_TYPES: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/gif",
      NEXT_PUBLIC_SESSION_MAX_AGE: process.env.NEXT_PUBLIC_SESSION_MAX_AGE || "2592000",
      NEXT_PUBLIC_ENABLE_CSP: process.env.NEXT_PUBLIC_ENABLE_CSP || "false",
      NEXT_PUBLIC_ENABLE_HSTS: process.env.NEXT_PUBLIC_ENABLE_HSTS || "true",
      NEXT_PUBLIC_CORS_ORIGIN: process.env.NEXT_PUBLIC_CORS_ORIGIN || "http://localhost:3000",
      NEXT_PUBLIC_CORS_CREDENTIALS: process.env.NEXT_PUBLIC_CORS_CREDENTIALS || "true",
      NEXT_PUBLIC_PAYMENT_API_TIMEOUT: process.env.NEXT_PUBLIC_PAYMENT_API_TIMEOUT || "30000",
      NEXT_PUBLIC_EMAIL_SERVICE_TIMEOUT: process.env.NEXT_PUBLIC_EMAIL_SERVICE_TIMEOUT || "10000",
    };

    const validatedEnv = envSchema.parse(envVars);

    const missingRequiredVars = [];
    const invalidVars = [];
    const missingOptionalVars: string[] = [];

    const requiredVars = ["NEXTAUTH_SECRET", "POSTGRES_PRISMA_URL", "NEXT_PUBLIC_MARKETPLACE_NAME"];
    for (const varName of requiredVars) {
      if (!envVars[varName as keyof typeof envVars]) {
        missingRequiredVars.push(varName);
      }
    }

    if (envVars.NODE_ENV && !["development", "production", "test"].includes(envVars.NODE_ENV)) {
      invalidVars.push("NODE_ENV");
    }

    if (envVars.NEXT_PUBLIC_MAPBOX_TOKEN && !envVars.NEXT_PUBLIC_MAPBOX_TOKEN.startsWith("pk")) {
      invalidVars.push("NEXT_PUBLIC_MAPBOX_TOKEN (invalid format)");
    }

    if (missingRequiredVars.length > 0 || invalidVars.length > 0) {
      console.error("\n❌ Environment Configuration Failed:\n");
      
      if (missingRequiredVars.length > 0) {
        console.error("🔴 CRITICAL - Missing required environment variables:");
        missingRequiredVars.forEach(varName => {
          console.error(`   - ${varName}: This variable is required and must be set in .env file`);
        });
        console.error("\n   Please check .env.example for required variables and ensure they are properly configured.");
        console.error("\n🔴 HALT: Server cannot start without required environment variables.\n");
      }
      
      if (invalidVars.length > 0) {
        console.error("🟡 WARNING - Invalid environment variables:");
        invalidVars.forEach(varName => {
          console.error(`   - ${varName}: Invalid value format. Please check your .env configuration.`);
        });
        console.error("\n   Please validate that these environment variables have correct values.\n");
      }
      
      throw new Error("Environment validation failed. Please check console output for details.");
    }

    if (missingOptionalVars.length > 0) {
      console.warn("🟡 WARNING - Missing optional environment variables (may impact functionality):");
      missingOptionalVars.forEach(varName => {
        console.warn(`   - ${varName}: Using default value. Set in .env for custom configuration.`);
      });
      console.warn("")
    }

    console.log("✅ Environment validated successfully");
    console.log(`   Environment: ${validatedEnv.NODE_ENV}`);
    console.log(`   Marketplace: ${validatedEnv.NEXT_PUBLIC_MARKETPLACE_NAME}`);
    console.log("\n");
    
    return validatedEnv;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("\n❌ Environment Validation Failed:\n")
      console.error("The following environment variables have invalid values:");

      const issues = (error as any).issues ?? (error as any).errors ?? [];
      issues.forEach((err: any, index: number) => {
        console.error(`${index + 1}. ${(err.path as string[]).join(".")} - ${err.message}`);
      });
      
      console.error("\n🔴 Please check your .env file configuration and fix the above issues.\n");
    } else {
      console.error("\n❌ Environment Validation Error:\n");
      console.error(error instanceof Error ? error.message : "Unknown error during environment validation");
      console.error("\n🔴 Please check your .env file and try again.\n");
    }
    
    process.exit(1);
  }
}