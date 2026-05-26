export type NavItem = {
  label: string
  href: string
}

export type SocialLink = {
  label: string
  href: string
}

export type SiteConfig = {
  name: string
  claim: string
  description: string
  location: string
  email: string
  phone: string
  navItems: NavItem[]
  socialLinks: SocialLink[]
}
