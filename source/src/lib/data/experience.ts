export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location?: string;
  website?: string;
  about?: string;
  logo?: string;
  type: "full-time" | "projects";
  bullets: string[];
  tech: string[];
  skills: string[];
  screenshots?: { src: string; label: string }[];
};

export const experience: ExperienceItem[] = [
  {
    company: "KÉSZ Consulting Kft.",
    role: "Software Engineer Internship",
    logo: "/images/kesz-logo.webp",
    period: "Oct 2025 – Dec 2025",
    location: "On-site",
    website: "https://kesz.hu",
    about:
      "As part of KÉSZ Group, one of Hungary’s largest construction and engineering companies, I completed an internship during my BSc studies focused on developing internal automation tools to optimize operational workflows. I also gained hands-on experience across various IT departments. \n\n Many thanks to everyone I had the opportunity to work with during this internship!",
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
    company: "Gambit",
    role: "Software Engineer / Project Lead",
    logo: "/images/gambit-logo.webp",
    period: "2023 - 2026",
    location: "Remote",
    website: "",
    about:
      "A custom Grand Theft Auto: San Andreas multiplayer roleplay server built on the Multi Theft Auto platform, this project emphasized a highly immersive simulation experience. \n\nIt featured a custom scripting framework, optimized synchronization mechanics, and unique UI/UX elements enhanced with HLSL-powered shaders. \n\nThe project was discontinued due to a declining player base on the MTA:SA platform and other strategic factors.",
    type: "projects",
    bullets: [
      "Founded and led the development of a multiplayer server with a dedicated team.",
      "Architected core gameplay systems and backend infrastructure for a custom environment.",
      "Designed and implemented key platform components, including networking and rendering integrations.",
      "Managed roadmaps, feature development, and tracking of project milestones.",
    ],
    tech: [
      "Lua",
      "MySQL",
      "High-Level Shading Language",
      "Chromium Embedded Framework",
      "Docker",
      "Jira",
    ],
    skills: [
      "Game Development",
      "Scalable System Architecture",
      "Project Management",
    ],
  },
];
