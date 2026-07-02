export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location?: string;
  website?: string;
  about?: string;
  type: "full-time" | "projects";
  bullets: string[];
  tech: string[];
  skills: string[];
  /** Image paths under public/ with the link text shown in the SCREENSHOTS row. */
  screenshots?: { src: string; label: string }[];
};

export const experience: ExperienceItem[] = [
  {
    company: "KÉSZ Consulting Kft.",
    role: "Software Engineer Internship",
    period: "Oct 2025 – Dec 2025",
    location: "Kecskemét, Hungary",
    website: "https://kesz.hu",
    about:
      "Part of KÉSZ Group, one of Hungary’s largest construction and engineering companies.\n\n During my BSc studies, I completed an internship focused on developing internal automation tools to optimize operational workflows, while also gaining hands-on experience across various IT departments.",
    type: "full-time",
    bullets: [
      "Developed Python-based automation tools to streamline internal operational workflows.",
      "Created document processing utilities for automated sorting and type conversion.",
      "Increased reliability and efficiency by replacing repetitive tasks with custom scripts.",
      "Collaborated with IT team members to design and implement automation solutions.",
    ],
    tech: ["Python", "N8N", "Microsoft Azure", "Active Directory"],
    skills: ["Teamwork", "Workflow Optimization", "System Integration"],
  },
  {
    company: "Gambit (www.gambit-roleplay.com)",
    role: "Founder / Software Engineer",
    period: "2026 - Present",
    location: "Remote",
    website: "https://www.gambit-roleplay.com",
    about:
      "A custom Grand Theft Auto V multiplayer roleplay server built on the FiveM platform. \n\n This project focuses on delivering a highly immersive, realistic simulation experience. It features deeply integrated custom frameworks, optimized sync mechanics, and custom UI/UX elements designed to handle a scaling community dynamic. \n\nOriginally conceptualized on the MTA platform during the pandemic.",
    type: "projects",
    bullets: [
      "Founded and led the development of a multiplayer server with a dedicated team.",
      "Architected core gameplay systems and backend infrastructure for a custom environment.",
      "Designed and implemented key platform components, including networking and rendering integrations.",
      "Managed roadmaps, feature development, and tracking of project milestones.",
    ],
    tech: ["Lua", "MySQL", "Chromium Embedded Framework", "Docker", "Jira"],
    skills: [
      "Game Development",
      "Scalable System Architecture",
      "Project Management",
    ],
    screenshots: [
      { src: "/images/gambit-1.webp", label: "character customization, " },
      { src: "/images/gambit-2.webp", label: "clothing selection" },
    ],
  },
];
