/** @type {{ company: string, role: string, period: string, location?: string, website?: string, about?: string, type: 'full-time'|'freelance', bullets: string[], tech: string[], skills: string[] }[]} */
export const experience = [
  {
    company: "KÉSZ Consulting Kft.",
    role: "Software Engineer (Internship)",
    period: "Oct 2025 – Dec 2025",
    location: "Kecskemét, Hungary",
    website: "https://kesz.hu",
    about:
      "Part of KESZ Group, one of the largest construction and engineering companies in Hungary. The internship focused on developing internal automation tools to optimize operational workflows during my BSc studies.",
    type: "full-time",
    bullets: [
      "Developed Python-based automation tools to streamline internal operational workflows.",
      "Built document processing utilities for automated sorting and type conversion.",
      "Improved processing reliability and efficiency by replacing repetitive tasks with scripts.",
      "Worked closely with IT team members to design and deploy internal automation tools.",
    ],
    tech: ["Python", "N8N", "NumPy", "Microsoft Azure", "Active Directory"],
    skills: ["Teamwork", "Workflow Optimization", "System Integration"],
  },
  {
    company: "Gambit - Multi Theft Auto",
    role: "Founder / Software Engineer",
    period: "2022 - 2025",
    location: "Remote",
    website: "",
    about:
      "A custom multiplayer game server built on the Multi Theft Auto platform. The project sadly did not exit the development phase due to real-life circumstances. The project is on-hold as of 2025.",
    type: "projects",
    bullets: [
      "Founded and led development of a multiplayer game server with a small, dedicated team.",
      "Architected core gameplay systems and backend infrastructure for a custom environment.",
      "Designed and implemented key platform components including networking and rendering integrations",
      "Managed project roadmap, coordinated contributions, and ensured code quality across the codebase.",
    ],
    tech: [
      "Lua",
      "HLSL",
      "Chromium Embedded Framework",
      "Docker",
      "AWS",
      "Jira",
    ],
    skills: [
      "Algorithmic Thinking",
      "Product Development",
      "Project Management",
    ],
  },
];
