export const siteConfig = {
  name: "Your Name",
  title: "Your Name - Portfolio",
  description: "A showcase of my web development, networking, and security projects",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og/default.png",
  links: {
    github: "https://github.com/your-username",
    linkedin: "https://linkedin.com/in/your-profile",
    email: "mailto:your-email@example.com",
  },
};

export type SiteConfig = typeof siteConfig;
