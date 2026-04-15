"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconHome, IconZukan, IconDiagnose, IconColumn,
  IconDiary, IconGallery, IconBoard, IconContact,
} from "./Icons";

const MENU_ITEMS = [
  { href: "/",         label: "研究室トップ",       Icon: IconHome },
  { href: "/diary",    label: "成長日記",           Icon: IconDiary },
  { href: "/zukan",    label: "品種図鑑",           Icon: IconZukan },
  { href: "/akinator", label: "品種診断",           Icon: IconDiagnose },
  { href: "/column",   label: "コラム",             Icon: IconColumn },
  { href: "/gallery",  label: "みんなのギャラリー", Icon: IconGallery },
  { href: "/board",    label: "コミュニティ",         Icon: IconBoard },
  { href: "/contact",  label: "お問い合わせ",       Icon: IconContact },
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
              <Link href="/" className="global-menu-title" onClick={() => setOpen(false)}>ハオルチア研究室</Link>
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
                    <span className="global-menu-icon"><item.Icon size={22} /></span>
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
