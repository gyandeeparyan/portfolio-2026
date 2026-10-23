/* ───────────────────────────────────────────────────────────────────────────
   Single source of truth for every piece of content on the site.
   Edit this file and the whole page follows.

   Lines marked  ⚠ VERIFY  are my best reconstruction from public sources
   (your GitHub profile, peerlist.io/gyandeeparyan, iyfpatna.in). LinkedIn
   blocks automated reads, so please check those before you publish.
   ─────────────────────────────────────────────────────────────────────────── */

import { asset } from "./asset";

export const PROFILE = {
  name: "Gyandeep Aryan",
  nameHi: "ज्ञानदीप आर्यन",
  firstName: "Gyandeep",
  initials: "GA",
  role: "Software Developer",
  roleHi: "सॉफ़्टवेयर डेवलपर",
  heroTitle: "Software Developer",
  dept: "Department of Posts",
  deptHi: "डाक विभाग",
  ministry: "Ministry of Communications",
  ministryHi: "संचार मंत्रालय",
  govt: "Government of India",
  govtHi: "भारत सरकार",
  company: "India Post",
  companyHi: "भारतीय डाक",
  since: "Jul 2025", // ⚠ VERIFY — joining date
  location: "Patna, Bihar", // ⚠ VERIFY — posting
  circle: "Bihar Circle", // ⚠ VERIFY
  idNo: "", // ⚠ VERIFY — your real staff number, or "" to hide the row
  email: "gyandeeparyan.dev@gmail.com",
  phone: "", // leave "" to hide the phone row everywhere
  phoneHref: "",
  github: "https://github.com/gyandeeparyan",
  githubHandle: "github.com/gyandeeparyan",
  linkedin: "https://www.linkedin.com/in/gyandeep-aryan-6a7509176",
  linkedinHandle: "linkedin.com/in/gyandeep-aryan",
  peerlist: "https://peerlist.io/gyandeeparyan",
  site: "https://gyandeeparyan.vercel.app",
  resume: asset("/cv.pdf"), // drop your PDF at public/cv.pdf
  /** Save a 4:5 portrait at public/portrait.webp, then set this to "/portrait.webp".
   *  Left empty, the ID card and the hero show a clean initials placeholder instead —
   *  rendering the <img> unconditionally would flash broken-image alt text, because the
   *  load fails before React hydrates and the error event is never replayed. */
  portrait: "https://ik.imagekit.io/ynqdeubtz/WhatsApp%20Image%202026-10-23%20at%2010.37.35.jpeg",
  summary:
    "Software Developer with the Department of Posts, Ministry of Communications, Government of India — building and maintaining web interfaces for India Post. Outside the office I ship production Next.js applications; the most recent is iyfpatna.in, a bilingual platform serving the ISKCON Youth Forum in Patna.",
} as const;

/** Render the State Emblem of India on the ID card. Its use is governed by the
 *  State Emblem of India (Prohibition of Improper Use) Act, 2005 — set false to drop it. */
export const SHOW_STATE_EMBLEM = true;

export type SectionId = "about" | "skills" | "work" | "certifications" | "experience" | "achievements" | "contact";

/** Section tag numbers follow rendered order. Rendered as `${index} — ${label}`. */
export const SECTIONS: Record<SectionId, { index: string; label: string }> = {
  about: { index: "01", label: "About me" },
  skills: { index: "02", label: "Skills" },
  work: { index: "03", label: "Selected work" },
  certifications: { index: "04", label: "Certifications" },
  experience: { index: "05", label: "Experience" },
  achievements: { index: "06", label: "Honours & numbers" },
  contact: { index: "07", label: "Contact" },
};

export interface NavItem {
  id: SectionId;
  label: string;
  index: string;
}
export const NAV: NavItem[] = (["about", "skills", "work", "experience", "achievements", "contact"] as const).map((id) => ({
  id,
  index: SECTIONS[id].index,
  label: id === "work" ? "Work" : id[0].toUpperCase() + id.slice(1),
}));

/* ---------- Skills ---------- */
export type SkillFamily = "Languages" | "Frontend" | "Backend" | "Data" | "Tooling" | "Platforms";

export interface Skill {
  /** Logo key for <TechLogo name=... /> — a brand file in /public/logos, or a concept icon. */
  logo: string;
  name: string;
  family: SkillFamily;
  /** Unique 2-letter element symbol. */
  symbol: string;
  /** Atomic number: 1-based position in the whole table. */
  number: number;
  /** Where it shows up in your work. */
  usedIn?: string[];
}
export interface SkillGroup {
  family: SkillFamily;
  skills: Skill[];
}

type RawSkill = Omit<Skill, "number" | "family">;
const RAW: Record<SkillFamily, RawSkill[]> = {
  Languages: [
    { logo: "typescript", name: "TypeScript", symbol: "Ts", usedIn: ["Sameeksha, Zoya Store, Stack Overflow clone", "Typed data layers and API contracts"] },
    { logo: "javascript", name: "JavaScript", symbol: "Js", usedIn: ["The bulk of 56 public repositories", "Samvad Setu, Akriti, Netflix GPT"] },
    { logo: "python", name: "Python", symbol: "Py", usedIn: ["Scripting and data work"] },
    { logo: "sql", name: "SQL", symbol: "Sq", usedIn: ["Relational schemas behind project back-ends"] },
    { logo: "bash", name: "Bash", symbol: "Ba", usedIn: ["Build and deploy scripting"] },
  ],
  Frontend: [
    { logo: "nextjs", name: "Next.js", symbol: "Nx", usedIn: ["iyfpatna.in — App Router, i18n routing, image pipeline", "Samvad Setu, Akriti, Sameeksha"] },
    { logo: "react", name: "React", symbol: "Re", usedIn: ["Every interface on this list", "UI work at the Department of Posts"] },
    { logo: "tailwindcss", name: "Tailwind CSS", symbol: "Tw", usedIn: ["iyfpatna.in design system", "Akriti, admin dashboard"] },
    { logo: "redux", name: "Redux Toolkit", symbol: "Rx", usedIn: ["Akriti canvas state", "Admin dashboard"] },
    { logo: "html5", name: "HTML5", symbol: "Ht", usedIn: ["Semantic, accessible markup"] },
    { logo: "css3", name: "CSS3", symbol: "Cs", usedIn: ["Animation and layout, including this page"] },
    { logo: "figma", name: "Figma", symbol: "Fg", usedIn: ["Design hand-off and UI exploration"] },
  ],
  Backend: [
    { logo: "nodejs", name: "Node.js", symbol: "No", usedIn: ["API routes and standalone servers"] },
    { logo: "express", name: "Express", symbol: "Ex", usedIn: ["Akriti realtime server", "Samvad Setu signalling server"] },
    { logo: "socketio", name: "Socket.IO", symbol: "Si", usedIn: ["Akriti multi-user drawing", "Samvad Setu peer signalling"] },
    { logo: "api", name: "REST APIs", symbol: "Ap", usedIn: ["Booking and donation flows on iyfpatna.in"] },
    { logo: "appwrite", name: "Appwrite", symbol: "Ao", usedIn: ["Stack Overflow clone — auth, database, storage"] },
  ],
  Data: [
    { logo: "mongodb", name: "MongoDB", symbol: "Mo", usedIn: ["Document stores behind Next.js apps"] },
    { logo: "postgresql", name: "PostgreSQL", symbol: "Pg", usedIn: ["Relational workloads"] },
    { logo: "mysql", name: "MySQL", symbol: "My", usedIn: ["Relational workloads"] },
    { logo: "prisma", name: "Prisma", symbol: "Pr", usedIn: ["Type-safe database access"] },
    { logo: "firebase", name: "Firebase", symbol: "Fb", usedIn: ["Auth and realtime data"] },
  ],
  Tooling: [
    { logo: "git", name: "Git", symbol: "Gi", usedIn: ["Daily, across every repository"] },
    { logo: "github", name: "GitHub", symbol: "Gh", usedIn: ["56 public repositories", "Actions for CI on full-stack-open-pokedex"] },
    { logo: "docker", name: "Docker", symbol: "Do", usedIn: ["Reproducible local environments"] },
    { logo: "vscode", name: "VS Code", symbol: "Vs", usedIn: ["Editor of choice"] },
    { logo: "postman", name: "Postman", symbol: "Pm", usedIn: ["API design and contract testing"] },
    { logo: "npm", name: "npm", symbol: "Np", usedIn: ["Package and workspace management"] },
    { logo: "jest", name: "Jest", symbol: "Je", usedIn: ["Unit and integration tests"] },
  ],
  Platforms: [
    { logo: "vercel", name: "Vercel", symbol: "Ve", usedIn: ["iyfpatna.in and most live demos"] },
    { logo: "aws", name: "AWS", symbol: "As", usedIn: ["Cloud fundamentals"] },
    { logo: "linux", name: "Linux", symbol: "Li", usedIn: ["Server-side work"] },
    { logo: "imagekit", name: "ImageKit", symbol: "Ik", usedIn: ["Media CDN and transforms on iyfpatna.in"] },
  ],
};

export const SKILL_FAMILIES = Object.keys(RAW) as SkillFamily[];

let atomic = 0;
export const SKILL_GROUPS: SkillGroup[] = SKILL_FAMILIES.map((family) => ({
  family,
  skills: RAW[family].map((s) => ({ ...s, family, number: ++atomic })),
}));
export const SKILLS: Skill[] = SKILL_GROUPS.flatMap((g) => g.skills);

/* ---------- Experience & education ----------
   ⚠ VERIFY — these bullets are starter copy written from your public GitHub bio
   ("UI Developer • SDE • Dept. of Posts, Ministry of Communications"). Replace
   each one with what you actually did before you publish the site. */
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
}
export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "indiapost",
    role: "Software Developer",
    company: "India Post — Department of Posts, Ministry of Communications, Government of India",
    period: "Jul 2025 – Present",
    bullets: [
      "Build and maintain web interfaces for the Department of Posts, working to government accessibility and bilingual (Hindi / English) content requirements.",
      "Develop React and Next.js front-ends against departmental REST services, with typed data contracts and reusable component libraries.",
      "Collaborate with postal operations staff to turn counter and back-office workflows into usable screens.",
      "Contribute to the department's push towards modern, responsive citizen-facing web experiences under India Post's IT modernisation programme.",
    ],
  },
];

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  place?: string;
  period?: string;
  /** Currently pursuing (no end date). */
  pursuing?: boolean;
}
export const EDUCATION: EducationItem[] = [
  // ⚠ VERIFY — taken from peerlist.io/gyandeeparyan
  { id: "bppimt", school: "B. P. Poddar Institute of Management and Technology", degree: "B.Tech, Computer Science and Engineering", place: "Kolkata", period: "2018 – 2022" },
];

/** Education + work merged into one path, oldest first. The Experience section renders this. */
export interface TimelineItem {
  id: string;
  kind: "education" | "work";
  org: string;
  title: string;
  place?: string;
  period: string;
  pursuing?: boolean;
  bullets?: string[];
}
const edu = (id: string): EducationItem => EDUCATION.find((e) => e.id === id)!;
const job = (id: string): ExperienceItem => EXPERIENCE.find((e) => e.id === id)!;
const fromEdu = (e: EducationItem): TimelineItem => ({
  id: e.id,
  kind: "education",
  org: e.school,
  title: e.degree,
  place: e.place,
  period: e.pursuing ? "Currently pursuing" : (e.period ?? ""),
  pursuing: e.pursuing,
});
const fromJob = (e: ExperienceItem): TimelineItem => ({
  id: e.id,
  kind: "work",
  org: e.company,
  title: e.role,
  period: e.period,
  bullets: e.bullets,
});
export const TIMELINE: TimelineItem[] = [fromEdu(edu("bppimt")), fromJob(job("indiapost"))];

/* ---------- Projects ---------- */
export interface ProjectTech {
  name: string;
  /** Logo key, only when a logo exists. */
  logo?: string;
}
export interface Project {
  id: string;
  number: string;
  title: string;
  date: string;
  kicker: string;
  description: string;
  features: string[];
  tech: ProjectTech[];
  link?: { href: string; label: string };
  repo?: { href: string; label: string };
  /** Which illustrative mini-UI to draw. */
  visual: "temple" | "video" | "canvas" | "feedback";
}
export const PROJECTS: Project[] = [
  {
    id: "iyfpatna",
    number: "01",
    title: "IYF Patna",
    date: "2026",
    kicker: "Production Next.js platform",
    description:
      "A bilingual platform for the ISKCON Youth Forum in Patna, the youth wing of Sri Sri Radha Banke Bihari Temple. It carries the community's programmes, courses, festival calendar and campus gallery, and runs a separate yatra sub-domain that handles pilgrimage bookings end to end.",
    features: [
      "Next.js App Router",
      "Hindi / English locale routing",
      "Yatra booking sub-domain",
      "Donation flow",
      "Course and festival schedules",
      "Campus gallery via ImageKit CDN",
      "User profile dashboard",
      "Mobile-first bottom navigation",
    ],
    tech: [
      { name: "Next.js", logo: "nextjs" },
      { name: "React", logo: "react" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
      { name: "ImageKit", logo: "imagekit" },
      { name: "Vercel", logo: "vercel" },
    ],
    link: { href: "https://iyfpatna.in", label: "Visit iyfpatna.in" },
    visual: "temple",
  },
  {
    id: "samvad-setu",
    number: "02",
    title: "Samvad Setu",
    date: "2024",
    kicker: "Serverless video meetings",
    description:
      "A video meeting application built on a mesh network topology, so peers connect to each other directly rather than through a central media server. Next.js on the front, a lightweight signalling server behind it.",
    features: [
      "Mesh peer-to-peer topology",
      "No central media server",
      "Room-based joining",
      "Realtime signalling",
      "Camera and mic controls",
      "Works across networks",
    ],
    tech: [
      { name: "Next.js", logo: "nextjs" },
      { name: "WebRTC" },
      { name: "Socket.IO", logo: "socketio" },
      { name: "Node.js", logo: "nodejs" },
      { name: "Express", logo: "express" },
    ],
    link: { href: "https://samvad-setu.vercel.app", label: "Open live demo" },
    repo: { href: "https://github.com/gyandeeparyan/samvad-setu", label: "Source" },
    visual: "video",
  },
  {
    id: "akriti",
    number: "03",
    title: "Akriti",
    date: "2024",
    kicker: "Collaborative drawing canvas",
    description:
      "A drawing application where several people share one canvas in real time. Strokes, erases and undo/redo propagate over a socket layer, with canvas state held in Redux Toolkit and served from an Express back-end.",
    features: [
      "Realtime multi-user drawing",
      "Draw and erase tools",
      "Undo / redo history",
      "Shared canvas state",
      "Redux Toolkit store",
      "Socket.IO transport",
    ],
    tech: [
      { name: "Next.js", logo: "nextjs" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
      { name: "Redux Toolkit", logo: "redux" },
      { name: "Socket.IO", logo: "socketio" },
      { name: "Express", logo: "express" },
    ],
    link: { href: "https://nextjs-sketch-book.vercel.app/", label: "Open live demo" },
    repo: { href: "https://github.com/gyandeeparyan/nextjs-sketch-book", label: "Source" },
    visual: "canvas",
  },
  {
    id: "sameeksha",
    number: "04",
    title: "Sameeksha",
    date: "2024",
    kicker: "Anonymous feedback",
    description:
      "An anonymous messaging and feedback app for people who need candid answers — a teacher collecting honest student feedback, a mentor taking questions nobody wants to ask out loud. Typed end to end in TypeScript.",
    features: [
      "Anonymous message links",
      "Personal inbox",
      "Accept / pause replies",
      "Typed end to end",
      "Server-rendered dashboard",
    ],
    tech: [
      { name: "Next.js", logo: "nextjs" },
      { name: "TypeScript", logo: "typescript" },
      { name: "MongoDB", logo: "mongodb" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
    ],
    link: { href: "https://sameeksha.vercel.app", label: "Open live demo" },
    repo: { href: "https://github.com/gyandeeparyan/sameeksha", label: "Source" },
    visual: "feedback",
  },
];

/* ---------- Certifications ----------
   Empty by default — the section hides itself when there is nothing here.
   Add entries in this shape:
   { id: "mern", title: "Full Stack Web Development", issuer: "Namaste Dev", date: "Mar 2024", url: "https://…" }, */
export interface Certification {
  id: string;
  index: string;
  title: string;
  date: string;
  url: string;
  issuer?: string;
}
const CERT_RAW: Omit<Certification, "index">[] = [];
export const CERTIFICATIONS: Certification[] = CERT_RAW.map((c, i) => ({ ...c, index: String(i + 1).padStart(2, "0") }));

/* ---------- Honours & numbers ----------
   ⚠ VERIFY — the first four are grounded in things I could check publicly.
   Swap in departmental recognitions, appreciation letters or real metrics. */
export interface Achievement {
  id: string;
  index: string;
  label: string;
  caption: string;
  detail: string;
  /** Logo key: a brand file, a concept icon, or "indiapost" / "emblem". */
  logo: string;
  /** Soft glow behind the logo, rgba. */
  tint: string;
  number?: number;
  prefix?: string;
  suffix?: string;
  /** Small unit text beside the number. */
  unit?: string;
}
const ACH_RAW: Omit<Achievement, "index">[] = [
  {
    id: "dop",
    label: "Department of Posts",
    caption: "Serving as a Software Developer with India Post, Ministry of Communications",
    detail: "Government of India · Bihar",
    logo: "indiapost",
    tint: "rgba(198,40,41,0.14)",
  },
  {
    id: "iyf",
    label: "iyfpatna.in in production",
    caption: "A bilingual Next.js platform serving a live community in Patna",
    detail: "Hindi and English, with a separate yatra booking sub-domain",
    logo: "nextjs",
    tint: "rgba(13,13,13,0.08)",
  },
  {
    id: "repos",
    label: "Public repositories",
    caption: "Shipped and open-sourced on GitHub",
    detail: "Next.js, React, TypeScript and realtime work",
    logo: "github",
    tint: "rgba(13,13,13,0.08)",
    number: 56,
  },
  {
    id: "langs",
    label: "Languages served",
    caption: "Every page of iyfpatna.in ships in Hindi and English",
    detail: "Locale-prefixed routing with a live toggle",
    logo: "imagekit",
    tint: "rgba(255,221,0,0.22)",
    number: 2,
  },
  {
    id: "realtime",
    label: "Realtime systems",
    caption: "Mesh-topology video calling and multi-user canvas, both live",
    detail: "Samvad Setu and Akriti",
    logo: "socketio",
    tint: "rgba(13,13,13,0.08)",
    number: 2,
  },
];
export const ACHIEVEMENTS: Achievement[] = ACH_RAW.map((a, i) => ({ ...a, index: String(i + 1).padStart(2, "0") }));
