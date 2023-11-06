const siteAddress =
  process.env.NEXT_PUBLIC_DOMAIN_URL || "http://localhost:3000/";

export const siteConfig = {
  name: "B2C Marketplace System",
  shortName: "B2C Marketplace",
  locale: "en",
  localeUpper: "enUS",
  localeUpperSpace: "en-US",
  url: siteAddress,
  ogImage: `${siteAddress}opengraph-image`,
  description:
    "It provides a frontend, backend, and database schema that startups can use to create their own B2C applications with a few simple changes. This can help startups to get a head start on their development and to launch their applications more quickly and affordably",
  links: {
    github: "https://github.com/arifulbgt4/Marketplace",
  },
  keywords: [
    "Frontend Engineer",
    "JavaScript Develope",
    "React.js Specialis",
    "Next.js Expert",
    "Senior Web Developer",
    "User-Centric Design",
    "UI/UX Enthusiast",
    "Node.js Developer",
    "Web Application Architect",
    "Code Refactoring Pro",
  ],
  author: "Ariful",
  creator: "Ariful",
  themeColor: "#090c24",
  defaultTheme: "light",
  backgroundColor: "#090c24",
};
