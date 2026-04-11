"use client";

import { useState } from "react";
import Link from "next/link";

const MENU_ITEMS = [
  { href: "/", label: "研究室トップ", icon: "🌱" },
  { href: "/zukan", label: "品種図鑑", icon: "📖" },
  { href: "/akinator", label: "品種診断", icon: "🔍" },
  { href: "/column", label: "コラム", icon: "✏️" },
  { href: "/diary", label: "成長日記", icon: "📝" },
  { href: "/gallery", label: "みんなのギャラリー", icon: "🖼️" },
  { href: "/board", label: "掲示板", icon: "💬" },
  { href: "/contact", label: "お問い合わせ", icon: "✉️" },
];

export default function GlobalMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="global-menu-btn"
        onClick={() => setOpen(true)}
        aria-label="メニューを開く"
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="global-menu-overlay" onClick={() => setOpen(false)}>
          <nav className="global-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="global-menu-header">
              <span className="global-menu-title">ハオルチア研究室</span>
              <button className="global-menu-close" onClick={() => setOpen(false)}>✕</button>
            </div>
            <ul className="global-menu-list">
              {MENU_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="global-menu-link"
                    onClick={() => setOpen(false)}
                  >
                    <span className="global-menu-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
