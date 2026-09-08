// Public project routing and primary images shared by pages, links, and the sitemap.
export const PROJECTS = [
  {
    key: "laibi",
    id: "supermarket-laibi-2",
    group: "ecommerce",
    href: "https://www.superettelaibi.com/",
    image: "/Projects/superete%20laibi%202/card.webp",
  },
  {
    key: "said",
    id: "said",
    group: "ecommerce",
    href: "https://said-web-seven.vercel.app/",
    image: "/Projects/said/card.webp",
  },
  {
    key: "rimoochat",
    id: "rimoochat",
    group: "ecommerce",
    href: "https://rimoochat.com/",
    image: "/Projects/rimoochat/card.webp",
  },
  {
    key: "unimarket",
    id: "unimarket",
    group: "platforms",
    href: "https://unimarcket.com/",
    hasRoadmap: true,
    image: "/Projects/unimarket/card.webp",
  },
  {
    key: "duks",
    id: "duks",
    group: "ecommerce",
    href: "https://duks-perfume.vercel.app/",
    image: "/Projects/duks/card.webp",
  },
  {
    key: "reperto",
    id: "reperto",
    group: "platforms",
    image: "/Projects/reperto/cover.webp",
  },
  {
    key: "tahwisa",
    id: "tahwisa",
    group: "internal",
    image: "/Projects/tahwisa/tahwisa%20main%20image%20desktop.webp",
  },
  {
    key: "waity",
    id: "waity",
    group: "saas",
    image: "/Projects/waity/waity%20main%20image%20desktop.webp",
  },
  { key: "awid", id: "awid", group: "saas", image: null },
] as const;

export function getProjectPath(id: string) {
  return `/projects/${id}`;
}
