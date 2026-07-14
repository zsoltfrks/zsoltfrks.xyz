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
    title: "Link Health Checker",
    description:
      "An N8N workflow that checks the validity of links and reports broken ones. A Python script is also included.",
    tags: ["N8N", "Python", "Docker", "Automation"],
    github: "https://github.com/zsoltfrks/link-checker-n8n",
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
