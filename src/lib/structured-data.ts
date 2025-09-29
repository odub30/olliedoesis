// src/lib/structured-data.ts
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Full Name",
  "jobTitle": "Full Stack Developer",
  "url": "https://yoursite.com",
  "sameAs": [
    "https://github.com/yourusername",
    "https://linkedin.com/in/yourprofile",
    "https://twitter.com/yourhandle"
  ],
  "knowsAbout": [
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "Network Security",
    "Cybersecurity"
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Software Developer",
    "occupationLocation": "Your Location"
  }
};

export const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Portfolio Website",
  "description": "Showcasing web development and security projects",
  "author": personSchema,
  "dateCreated": "2025-09-28",
  "programmingLanguage": ["TypeScript", "JavaScript", "CSS"],
  "runtimePlatform": "Next.js"
};