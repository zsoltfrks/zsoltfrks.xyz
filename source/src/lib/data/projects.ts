export type ProjectItem = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
};

export const projects: ProjectItem[] = [
  {
    title: "zsoltfrks.xyz",
    description:
      "This website you are currently on, built with an emphasis on performance for the love of the game.",
    tags: ["Svelte", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/zsoltfrks/zsoltfrks.xyz",
    live: "",
  },
  {
    title: "Gambit",
    description:
      "A custom roleplay server built on FiveM, featuring a custom framework and optimized onesync mechanics.",
    tags: ["Lua", "CEF", "MySQL", "Docker", "Jira"],
    live: "",
  },
  {
    title: "DOCX to PDF Merger",
    description:
      "An automation script that batch-converts DOCX files to PDF, adds continuous page numbering and TOC.",
    tags: ["Python", "ReportLab", "Automation"],
    github: "https://github.com/zsoltfrks/batch-docx-to-pdf-merger",
    live: "",
  },
];
