import { siteConfig } from "@/lib/site"

export function Footer() {
  return (
    <footer className="bg-[#172522] py-14 text-white">
      <div className="container-premium grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-heading text-3xl">{siteConfig.name}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/65">{siteConfig.claim}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">Contatti</p>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <p>{siteConfig.email}</p>
            <p>{siteConfig.phone}</p>
            <p>{siteConfig.location}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">Navigazione</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-white/70">
            {siteConfig.navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
            <a href="/privacy" className="transition hover:text-white">Privacy</a>
            <a href="/cookie" className="transition hover:text-white">Cookie</a>
          </div>
        </div>
      </div>
      <div className="container-premium mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 {siteConfig.name}. Tutti i diritti riservati.</span>
        <span>
          Site by{" "}
          <a
            href="mailto:a.chouikh@pulsarengineering.com"
            className="text-white/55 transition hover:text-white/80"
          >
            Ashraf Chouikh
          </a>
        </span>
      </div>
    </footer>
  )
}
