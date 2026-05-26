# Elba Luce Villas

Premium real estate landing page for a luxury villa project on Elba Island.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod
- Resend-ready lead form
- Vercel deploy compatibility

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill values when ready:

```env
RESEND_API_KEY=
LEAD_RECEIVER_EMAIL=
NEXT_PUBLIC_SITE_URL=
```

If `RESEND_API_KEY` or `LEAD_RECEIVER_EMAIL` are missing, the lead form uses mock mode and logs the request on the server.

## Project Structure

```txt
app/                 App Router pages and API routes
components/layout    Header, footer, mobile menu
components/sections  Homepage sections
components/motion    Reusable motion primitives
components/forms     Lead form
components/ui        shadcn/ui components
lib/                 Site data, validations, email helpers
types/               Shared TypeScript types
public/              Placeholder images and video path
```

## Content Editing

- Edit global info in `lib/site.ts`.
- Edit villas in `lib/villas.ts`.
- Edit gallery items in `lib/gallery.ts`.
- Edit FAQs in `lib/faqs.ts`.

## Replacing Assets

Current assets are clear placeholders in `public/images` and `public/videos`.

Replace them with real renders, drone stills, interior images, material details and the final drone video while keeping the same file paths or updating the data files.

## Lead Form

The form posts to `/api/lead`, validates with Zod on client and server, includes a hidden honeypot field and is ready for Resend.

Future production hardening:
- Add rate limiting.
- Add privacy/cookie pages.
- Add consent copy approved by legal counsel.
- Add CRM or Google Sheet export only if requested.

## Deploy On Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Configure `RESEND_API_KEY`, `LEAD_RECEIVER_EMAIL` and `NEXT_PUBLIC_SITE_URL`.
4. Deploy.
5. Test `/api/lead` through the contact form.
6. Connect a custom domain when ready.

The first version requires no database and works on the free Vercel plan.

## Recommended Next Steps

- Replace placeholder assets with real renders and drone material.
- Configure Resend.
- Deploy to Vercel.
- Add privacy and cookie pages.
- Add analytics.
- Consider IT/EN multilingual support.
- Consider a future CMS only after real content workflow is clear.
