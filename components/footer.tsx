"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteNavHref, siteNavItems } from "@/config/navigation";

export default function Footer() {
  const isHome = usePathname() === "/";

  return (
    <footer className="anniversary-footer" id="lien-he">
      <div className="site-container">
        <div className="footer-top">
          <a href={siteNavHref("#trang-chu", isHome)} aria-label="AN VUI, về đầu trang">
            <Image src="/assets/logo-anvui.webp" alt="AN VUI" width={145} height={88} className="footer-logo" />
          </a>
          <nav aria-label="Điều hướng cuối trang">
            {siteNavItems.map((item) => (
              <a
                key={item.href}
                href={siteNavHref(item.href, isHome)}
                target={"external" in item && item.external ? "_blank" : undefined}
                rel={"external" in item && item.external ? "noopener noreferrer" : undefined}
              >
                {item.footerLabel}
              </a>
            ))}
          </nav>
          <span className="footer-script">Cùng nhau,<br />đi xa hơn!</span>
        </div>
        <div className="footer-bottom">
          <span className="footer-credit">Developed by HungNC</span>
          <span className="footer-copyright">© 2026 AN VUI. All rights reserved.</span>
          <div className="social-links">
            <a href="https://www.facebook.com/anvui.vn" target="_blank" rel="noopener noreferrer" aria-label="Facebook AN VUI">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M14.3 21v-7.7h2.6l.4-3.1h-3V8.4c0-.9.3-1.5 1.6-1.5h1.5V4.1c-.7-.1-1.6-.1-2.4-.1-2.7 0-4.5 1.7-4.5 4.7v1.5H8v3.1h2.5V21h3.8Z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@ANVUI" target="_blank" rel="noopener noreferrer" aria-label="YouTube AN VUI">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
                <path d="m10 8.7 5.6 3.3-5.6 3.3V8.7Z" fill="white" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/an-vui/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn AN VUI">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.2 8.8h3.2V20H4.2V8.8Zm1.6-5.3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM9.3 8.8h3.1v1.5c.5-.9 1.7-1.8 3.5-1.8 3.7 0 4.1 2.4 4.1 5.5v6h-3.2v-5.3c0-1.3 0-3-1.8-3s-2.5 1.4-2.5 2.9V20H9.3V8.8Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
