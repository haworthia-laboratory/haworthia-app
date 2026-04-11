"use client";

import { useState } from "react";
import Link from "next/link";

// ホームのアイコンと同テイスト（細線・薄塗り・グレーブラウン）
function IconHome() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
      <path d="M16,5 L4,15 L4,28 L12,28 L12,20 L20,20 L20,28 L28,28 L28,15 Z"
        fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M11,28 L11,21 L21,21 L21,28" fill="rgba(160,148,136,0.1)" stroke="#9a8e84" strokeWidth="1.2"/>
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
      <path d="M6,6 L10,6 L10,26 L6,26 Z" fill="rgba(130,118,106,0.3)" stroke="#8a7e72" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M10,6 L26,6 L26,26 L10,26 Z" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.4" strokeLinejoin="round"/>
      <line x1="14" y1="11" x2="22" y2="11" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="14" y1="15" x2="22" y2="15" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <line x1="14" y1="19" x2="20" y2="19" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
    </svg>
  );
}

function IconDiagnose() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="11" fill="rgba(160,148,136,0.18)" stroke="#b0a498" strokeWidth="1.4"/>
      <text x="16" y="22" textAnchor="middle" fontSize="14" fill="#b0a498" fontWeight="300" fontFamily="serif">?</text>
    </svg>
  );
}

function IconColumn() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="4" width="22" height="24" rx="2.5" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.4"/>
      <rect x="9" y="6" width="7" height="3.5" rx="0.8" fill="rgba(160,148,136,0.28)" stroke="#9a8e84" strokeWidth="0.7"/>
      <line x1="9" y1="14" x2="23" y2="14" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="9" y1="18" x2="23" y2="18" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="9" y1="22" x2="18" y2="22" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function IconDiary() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
      <path d="M16,7 Q9,6 4,7.5 L4,26 Q10,24.5 16,25.5 Z"
        fill="rgba(160,148,136,0.15)" stroke="#9a8e84" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M16,7 Q23,6 28,7.5 L28,26 Q22,24.5 16,25.5 Z"
        fill="rgba(160,148,136,0.15)" stroke="#9a8e84" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M16,7 Q15.5,16 16,25.5" fill="none" stroke="#9a8e84" strokeWidth="0.9" opacity="0.5"/>
      <g transform="translate(25,7) rotate(30)">
        <rect x="-1.5" y="-9" width="3" height="2.5" rx="0.6" fill="rgba(200,178,168,0.5)" stroke="#a08878" strokeWidth="0.8"/>
        <rect x="-1.5" y="-6.5" width="3" height="10" rx="0.4" fill="rgba(168,152,132,0.35)" stroke="#9a8878" strokeWidth="1"/>
        <polygon points="-1.5,3.5 1.5,3.5 0,7" fill="rgba(190,168,138,0.5)" stroke="#908060" strokeWidth="0.7"/>
      </g>
    </svg>
  );
}

function IconGallery() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="12" height="11" rx="2" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.3"/>
      <rect x="17" y="7" width="12" height="11" rx="2" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.3"/>
      <rect x="3" y="20" width="12" height="5" rx="2" fill="rgba(160,148,136,0.12)" stroke="#9a8e84" strokeWidth="1.1"/>
      <rect x="17" y="20" width="12" height="5" rx="2" fill="rgba(160,148,136,0.12)" stroke="#9a8e84" strokeWidth="1.1"/>
      <circle cx="7" cy="11" r="1.5" fill="rgba(200,178,138,0.4)" stroke="#b8a878" strokeWidth="0.8"/>
      <polyline points="3,16 7,12 11,15 15,10" fill="none" stroke="#9a8e84" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}

function IconBoard() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="26" height="18" rx="3" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.4"/>
      <path d="M10,23 L10,27 L16,23" fill="rgba(160,148,136,0.25)" stroke="#9a8e84" strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1="8" y1="11" x2="24" y2="11" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="8" y1="15" x2="24" y2="15" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="8" y1="19" x2="18" y2="19" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function IconContact() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="26" height="18" rx="3" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.4"/>
      <polyline points="3,9 16,18 29,9" fill="none" stroke="#9a8e84" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

const MENU_ITEMS = [
  { href: "/",        label: "研究室トップ",       Icon: IconHome },
  { href: "/zukan",   label: "品種図鑑",           Icon: IconBook },
  { href: "/akinator",label: "品種診断",           Icon: IconDiagnose },
  { href: "/column",  label: "コラム",             Icon: IconColumn },
  { href: "/diary",   label: "成長日記",           Icon: IconDiary },
  { href: "/gallery", label: "みんなのギャラリー", Icon: IconGallery },
  { href: "/board",   label: "掲示板",             Icon: IconBoard },
  { href: "/contact", label: "お問い合わせ",       Icon: IconContact },
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
                    <span className="global-menu-icon"><item.Icon /></span>
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
