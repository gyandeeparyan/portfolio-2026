import type { ReactElement } from "react";
import { asset } from "@/lib/asset";

/** Brand logos: key -> file in /public.
 *  Tech marks are devicon "original" SVGs (MIT). The India Post logo and the State
 *  Emblem come from indiapost.gov.in — see public/brand/README.md. */
export const BRAND: Record<string, string> = {
  javascript: "/logos/javascript.svg",
  typescript: "/logos/typescript.svg",
  python: "/logos/python.svg",
  bash: "/logos/bash.svg",
  react: "/logos/react.svg",
  nextjs: "/logos/nextjs.svg",
  tailwindcss: "/logos/tailwindcss.svg",
  redux: "/logos/redux.svg",
  html5: "/logos/html5.svg",
  css3: "/logos/css3.svg",
  figma: "/logos/figma.svg",
  nodejs: "/logos/nodejs.svg",
  express: "/logos/express.svg",
  socketio: "/logos/socketio.svg",
  mongodb: "/logos/mongodb.svg",
  postgresql: "/logos/postgresql.svg",
  mysql: "/logos/mysql.svg",
  prisma: "/logos/prisma.svg",
  firebase: "/logos/firebase.svg",
  git: "/logos/git.svg",
  github: "/logos/github.svg",
  docker: "/logos/docker.svg",
  vscode: "/logos/vscode.svg",
  postman: "/logos/postman.svg",
  npm: "/logos/npm.svg",
  jest: "/logos/jest.svg",
  vercel: "/logos/vercel.svg",
  aws: "/logos/aws.svg",
  linux: "/logos/linux.svg",
  indiapost: "/brand/india-post-logo.png",
  emblem: "/brand/ashok-emblem.svg",
};

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Thin line icons (48x48 viewBox, currentColor) for things without an official mark. */
export const CONCEPT: Record<string, ReactElement> = {
  sql: (
    <g {...P}>
      <ellipse cx="24" cy="13" rx="13" ry="5" />
      <path d="M11 13v22c0 2.8 5.8 5 13 5s13-2.2 13-5V13" />
      <path d="M11 24c0 2.8 5.8 5 13 5s13-2.2 13-5" />
    </g>
  ),
  api: (
    <g {...P}>
      <path d="M17 12 8 24l9 12M31 12l9 12-9 12" />
      <path d="M27 10 21 38" />
    </g>
  ),
  appwrite: (
    <g {...P}>
      <rect x="7" y="14" width="34" height="20" rx="10" />
      <circle cx="18" cy="24" r="5" />
      <path d="M27 20h9M27 28h6" />
    </g>
  ),
  imagekit: (
    <g {...P}>
      <rect x="8" y="10" width="32" height="28" rx="4" />
      <circle cx="18" cy="20" r="3.5" />
      <path d="m10 32 9-9 7 7 5-4 7 6" />
    </g>
  ),
  /* A postal envelope with the India Post ribbon sweep. */
  post: (
    <g {...P}>
      <rect x="6" y="12" width="36" height="24" rx="3" />
      <path d="m6 15 18 12 18-12" />
    </g>
  ),
  medal: (
    <g {...P}>
      <path d="m16 5 6 13M32 5l-6 13" />
      <circle cx="24" cy="29" r="12" />
      <path d="m24 23 2 4 4.4.6-3.2 3 .8 4.4L24 33l-4 2 .8-4.4-3.2-3 4.4-.6z" />
    </g>
  ),
  chip: (
    <g {...P}>
      <rect x="13" y="13" width="22" height="22" rx="3" />
      <rect x="19" y="19" width="10" height="10" rx="1.5" />
      <path d="M19 7v6M29 7v6M19 35v6M29 35v6M7 19h6M7 29h6M35 19h6M35 29h6" />
    </g>
  ),
};

export function isBrand(name: string): boolean {
  return name in BRAND;
}

interface Props {
  /** Logo key from data.ts (brand or concept). */
  name: string;
  /** Pixel size (square). Default 40. */
  size?: number;
  /** Accessible label. Omit when the logo is decorative and a visible name sits beside it. */
  label?: string;
  className?: string;
}

export default function TechLogo({ name, size = 40, label, className = "" }: Props) {
  if (isBrand(name)) {
    return (
      <img
        src={asset(BRAND[name])}
        alt={label ?? ""}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {CONCEPT[name] ?? CONCEPT.chip}
    </svg>
  );
}
