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
    company: "Gambit - Multi Theft Auto",
    role: "Founder / Software Engineer",
    period: "2022 - 2025",
    location: "Remote",
    website: "",
    about:
      "A custom multiplayer server built on the Multi Theft Auto open-source platform during the pandemic. \n\n This roleplay-based modpack aimed to simulate real-life experiences within the game world, featuring advanced shader usage and environmental effects to make the map feel vibrant and immersive. \n\nDevelopment was paused in 2025 due to real-life circumstances, and the project remains on hold.",
    type: "projects",
    bullets: [
      "Founded and led the development of a multiplayer server with a dedicated team.",
      "Architected core gameplay systems and backend infrastructure for a custom environment.",
      "Designed and implemented key platform components, including networking and rendering integrations.",
    ],
    tech: ["Lua", "HLSL", "Chromium Embedded Framework", "Docker", "Jira"],
    skills: [
      "Algorithmic Thinking",
      "System Architecture",
      "Project Management",
    ],
  },
];
