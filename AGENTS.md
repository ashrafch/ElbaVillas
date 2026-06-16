# AGENTS.md

## Project Overview

Elba Luce Villas is a premium real estate landing/portal for a luxury villa complex on Elba Island, Italy.

The first version is a static, editorial landing page with a professional lead form. It must feel like a boutique architecture and luxury real estate experience, not a generic template.

Core goals:
- Present architecture, nature, location, lifestyle and investment potential.
- Collect qualified leads through an email-based form.
- Stay deployable on Vercel from day one.
- Avoid backend complexity in v1.
- Keep code modular, typed and easy to extend.

## Stack

Use Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, React Hook Form, Zod, lucide-react, next/image and Vercel-compatible APIs.

Do not add a database, auth, admin area or CMS unless explicitly requested.

## Architecture

- Page composition lives in `app/page.tsx`.
- Sections live in `components/sections`.
- Layout components live in `components/layout`.
- Motion primitives live in `components/motion`.
- Forms live in `components/forms`.
- Data/config lives in `lib`.
- Shared types live in `types`.
- Server-only logic stays server-side.
- Never expose secrets to client code.

## Data Rules

In v1, content is stored in TypeScript:
- `lib/site.ts`
- `lib/villas.ts`
- `lib/gallery.ts`
- `lib/faqs.ts`

Do not hardcode repeated content inside UI components when it belongs in these config files.

## Form Rules

The lead form uses React Hook Form and Zod. Validate on the client and again in `/app/api/lead/route.ts`.

Fields:
- firstName
- lastName
- email
- phone
- budget
- interest
- message
- privacyAccepted
- website honeypot

If the honeypot is filled, return generic success and do nothing. If Resend env vars are missing, use mock mode and log server-side. Never store leads in a database in v1.

## Visual Rules

Direction: sober luxury, Mediterranean, architectural, editorial, photographic, spacious and calm.

Avoid neon, cyber gradients, SaaS dashboard patterns, exaggerated glassmorphism, stock copy, fake ROI claims and heavy animations.

Use warm white, stone, sand, Mediterranean green, deep sea blue, anthracite and subtle gold accents.

## Component Rules

Keep components small, typed and readable. Use server components by default. Add `"use client"` only for animation, form state, mobile menu, lightbox or browser APIs.

Do not make the whole homepage a client component.

## Accessibility And Performance

Maintain semantic HTML, meaningful alt text, visible focus states, keyboard-friendly interactions, labels on form fields and reduced-motion support.

Use `next/image`, avoid layout shift, keep video preload controlled and do not add expensive scroll effects.

## SEO

Use Next.js metadata, one `h1`, proper section headings and crawlable text. Prepare for future sitemap/robots, but do not add unnecessary infrastructure now.

## Deployment

The project must build on Vercel without a custom server. Document env vars in `.env.example` and deployment steps in `README.md`.

## Task Workflow

1. Inspect relevant files first.
2. Make the smallest complete change.
3. Keep style consistent.
4. Preserve static content architecture.
5. Run lint/build when possible.
6. Summarize changed files and any residual risk.

## Video Assets

Two real video assets are deployed in `public/videos/`:

- `elba-hero.mp4` — ambient background for the HeroSection (autoplay, muted, loop).
- `elba-drone.mp4` — full-bleed cinematic video in DroneVideoSection (autoplay muted; user can unmute).

Source files are kept in `assets/` (gitignored). Do not delete or rename the public copies without updating the component references. Both videos use `preload="metadata"` to avoid unnecessary bandwidth on load.

## Do Not Do

Do not add a database, auth, admin panel, CMS, unnecessary libraries, fake investment promises, exposed secrets, massive components or unrelated refactors.
