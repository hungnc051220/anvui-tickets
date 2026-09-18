import { GALLERY_DRIVE_URL } from "@/lib/anniversary-links";

export const siteNavItems = [
  { label: "Trang chủ", footerLabel: "Trang chủ", href: "#trang-chu" },
  { label: "Thông tin sự kiện", footerLabel: "Giới thiệu", href: "#su-kien" },
  { label: "Dấu mốc 11 năm", footerLabel: "Dấu mốc", href: "#dau-moc" },
  { label: "Hình ảnh", footerLabel: "Hình ảnh", href: GALLERY_DRIVE_URL, external: true },
  { label: "Liên hệ", footerLabel: "Liên hệ", href: "#lien-he" },
] as const;

export function siteNavHref(href: string, isHome: boolean) {
  return href.startsWith("#") && !isHome ? `/${href}` : href;
}
