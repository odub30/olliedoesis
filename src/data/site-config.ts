export const siteConfig = {
  name: "Ollie Does Is",
  title: "Ollie Does Is - Web Developer & Cybersecurity Student",
  description: "Portfolio of Ollie Does Is - Web Developer & Cybersecurity Student showcasing web development, networking, and security projects",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://olliedoesis.dev",
  ogImage: "/images/og/default.png",
  links: {
    github: "https://github.com/your-username",
    linkedin: "https://linkedin.com/in/your-profile",
    email: "mailto:your-email@example.com",
  },
};

export type SiteConfig = typeof siteConfig;
