export const personalInfo = {
  name: "Your Full Name",
  title: "Web Developer & Security Enthusiast",
  bio: "Passionate about creating secure, performant web applications and exploring cybersecurity concepts.",
  location: "Your City, State",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "your-email@example.com",
  github: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "your-username",
  
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    backend: ["Node.js", "Express", "PostgreSQL"],
    security: ["Network Security", "Web Security", "Penetration Testing"],
    tools: ["Git", "Docker", "Vercel", "VS Code"],
  },
  
  currentlyLearning: [
    "Advanced React Patterns",
    "Cybersecurity Fundamentals", 
    "Network Administration",
  ],
};

export type PersonalInfo = typeof personalInfo;
