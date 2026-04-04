"use client";

import { useState, useRef } from "react";
import Link from "next/link";

function HaworthiaIcon() {
  return (
    <svg viewBox="0 0 160 160" width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="wc">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <radialGradient id="lg1" cx="45%" cy="80%" r="65%">
          <stop offset="0%" stopColor="#d8f0dc" stopOpacity="0.9"/>
          <stop offset="60%" stopColor="#aad4b2" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#88be92" stopOpacity="0.6"/>
        </radialGradient>
        <radialGradient id="win" cx="50%" cy="15%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98"/>
          <stop offset="50%" stopColor="#f0faf2" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#d8f0dc" stopOpacity="0.1"/>
        </radialGradient>
      </defs>
      <g filter="url(#wc)">
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 80 80)`}>
            <path d="M80,73 C71,65 65,47 68,27 Q74,17 80,15 Q86,17 92,27 C95,47 89,65 80,73Z"
              fill="url(#lg1)" stroke="#8aba94" strokeWidth="0.8" opacity="0.9"/>
            <path d="M80,68 C74,61 71,48 73,31 Q78,22 80,19 Q82,22 87,31 C89,48 86,61 80,68Z"
              fill="url(#win)"/>
          </g>
        ))}
        <circle cx="80" cy="80" r="3" fill="rgba(255,255,255,0.75)"/>
      </g>
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="f3"><feGaussianBlur stdDeviation="0.6" /></filter>
      </defs>
      {/* ノート本体 */}
      <path d="M13 10 Q12 9 14 9 L46 9 Q48 9 48 11 L48 53 Q48 55 46 55 L14 55 Q12 55 13 53 Z"
        fill="rgba(160,148,136,0.18)" stroke="#b0a498" strokeWidth="1.8" strokeLinejoin="round" filter="url(#f3)" />
      <path d="M13 10 Q12 9 14 9 L46 9 Q48 9 48 11 L48 53 Q48 55 46 55 L14 55 Q12 55 13 53 Z"
        fill="none" stroke="#887870" strokeWidth="1.2" strokeLinejoin="round" opacity="0.8" />
      {/* 罫線 */}
      <line x1="19" y1="21" x2="40" y2="21" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <line x1="19" y1="29" x2="40" y2="29" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <line x1="19" y1="37" x2="34" y2="37" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* ペン */}
      <g transform="rotate(-40 50 44)">
        <rect x="46" y="32" width="5" height="16" rx="1.5"
          fill="rgba(180,168,156,0.35)" stroke="#a09080" strokeWidth="1.2" />
        <polygon points="46,48 51,48 48.5,54"
          fill="rgba(160,148,136,0.5)" stroke="#a09080" strokeWidth="0.8" />
        <line x1="46" y1="35" x2="51" y2="35" stroke="#c4b8b0" strokeWidth="0.8" opacity="0.7" />
      </g>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="fb"><feGaussianBlur stdDeviation="0.6" /></filter>
      </defs>
      {/* 背表紙（厚み） */}
      <path d="M10 13 Q10 11 12 11 L17 11 L17 53 L12 53 Q10 53 10 51 Z"
        fill="rgba(140,128,116,0.28)" stroke="#a09080" strokeWidth="1.4" />
      {/* 本体 */}
      <path d="M17 9 L52 9 Q54 9 54 11 L54 53 Q54 55 52 55 L17 55 Z"
        fill="rgba(165,152,140,0.18)" stroke="#b0a498" strokeWidth="1.8" filter="url(#fb)" />
      <path d="M17 9 L52 9 Q54 9 54 11 L54 53 Q54 55 52 55 L17 55 Z"
        fill="none" stroke="#887870" strokeWidth="1.2" opacity="0.8" />
      {/* ページの重なり（小口） */}
      <line x1="53" y1="12" x2="53" y2="52" stroke="#c4b8b0" strokeWidth="1" opacity="0.5" />
      <line x1="51" y1="11" x2="51" y2="53" stroke="#d0c4bc" strokeWidth="0.7" opacity="0.4" />
      {/* 罫線 */}
      <line x1="23" y1="22" x2="47" y2="22" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <line x1="23" y1="30" x2="47" y2="30" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="23" y1="38" x2="47" y2="38" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="23" y1="46" x2="40" y2="46" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      {/* しおり */}
      <path d="M44 9 L44 20 L41 17 L38 20 L38 9 Z"
        fill="rgba(180,148,120,0.35)" stroke="#c0a888" strokeWidth="0.8" />
    </svg>
  );
}

function DiagnoseIcon() {
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="fd"><feGaussianBlur stdDeviation="0.6" /></filter>
      </defs>
      <circle cx="32" cy="32" r="22" fill="rgba(160,148,136,0.18)" stroke="#b0a498" strokeWidth="1.8" filter="url(#fd)" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#887870" strokeWidth="1.2" opacity="0.8" />
      <text x="32" y="40" textAnchor="middle" fontSize="26" fill="#b0a498" fontWeight="300" fontFamily="serif">?</text>
    </svg>
  );
}

function LightIcon() {
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="fl"><feGaussianBlur stdDeviation="0.6" /></filter>
      </defs>
      <circle cx="32" cy="28" r="12" fill="rgba(220,200,140,0.3)" stroke="#c8b870" strokeWidth="1.8" filter="url(#fl)" />
      <circle cx="32" cy="28" r="12" fill="none" stroke="#a89848" strokeWidth="1.2" opacity="0.8" />
      {[0,45,90,135,180,225,270,315].map((a, i) => {
        const rad = a * Math.PI / 180;
        const x1 = 32 + 15 * Math.cos(rad), y1 = 28 + 15 * Math.sin(rad);
        const x2 = 32 + 20 * Math.cos(rad), y2 = 28 + 20 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c8b870" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />;
      })}
      <rect x="20" y="46" width="24" height="4" rx="2" fill="rgba(160,148,136,0.2)" stroke="#b0a498" strokeWidth="1.2" />
      <rect x="24" y="50" width="16" height="3" rx="1.5" fill="rgba(160,148,136,0.15)" stroke="#b0a498" strokeWidth="1" />
    </svg>
  );
}

export default function Home() {
  const [lightResult, setLightResult] = useState(null);
  const lightInputRef = useRef(null);

  const measureLight = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 100, 100);
        const data = ctx.getImageData(0, 0, 100, 100).data;
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
          sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        }
        const brightness = sum / 10000;
        let level;
        if (brightness > 200) level = { label: "非常に良い", desc: "ハオルチアに最適な明るさです", bar: 100 };
        else if (brightness > 140) level = { label: "良い", desc: "十分な光量があります", bar: 75 };
        else if (brightness > 80) level = { label: "普通", desc: "もう少し明るい場所が理想的です", bar: 50 };
        else level = { label: "足りない", desc: "光が不足しています。窓辺に移動しましょう", bar: 25 };
        setLightResult(level);
        e.target.value = "";
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <main>
      <div className="container">
        <header style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.8rem" }}>
            <HaworthiaIcon />
          </div>
          <h1>ハオルチア研究室</h1>
          <p className="subtitle">～ あなただけの育成記録 ～</p>
        </header>

        <div className="home-nav">

          <Link href="/diary" className="home-nav-card">
            <div className="home-nav-icon"><NoteIcon /></div>
            <div className="home-nav-body">
              <div className="home-nav-title">成長日記</div>
              <div className="home-nav-desc">株の登録・写真記録・成長メモ</div>
            </div>
            <div className="home-nav-arrow">›</div>
          </Link>

          <div className="home-nav-card home-nav-card--light" onClick={() => lightInputRef.current.click()} style={{ cursor: "pointer" }}>
            <div className="home-nav-icon"><LightIcon /></div>
            <div className="home-nav-body">
              <div className="home-nav-title">照度チェック</div>
              <div className="home-nav-desc">置き場所の明るさを写真で確認</div>
            </div>
            <div className="home-nav-arrow">›</div>
          </div>
          <input
            ref={lightInputRef}
            type="file"
            accept="image/*"
            onChange={measureLight}
            style={{ display: "none" }}
          />
          {lightResult && (
            <div className="light-result">
              <div className="light-result-label">{lightResult.label}</div>
              <div className="light-bar-wrap">
                <div className="light-bar" style={{ width: `${lightResult.bar}%` }} />
              </div>
              <div className="light-desc">{lightResult.desc}</div>
            </div>
          )}

          <Link href="/zukan" className="home-nav-card">
            <div className="home-nav-icon"><BookIcon /></div>
            <div className="home-nav-body">
              <div className="home-nav-title">図鑑</div>
              <div className="home-nav-desc">登録品種を検索・フィルター</div>
            </div>
            <div className="home-nav-arrow">›</div>
          </Link>

          <Link href="/akinator" className="home-nav-card">
            <div className="home-nav-icon"><DiagnoseIcon /></div>
            <div className="home-nav-body">
              <div className="home-nav-title">品種診断</div>
              <div className="home-nav-desc">質問に答えて品種を絞り込む</div>
            </div>
            <div className="home-nav-arrow">›</div>
          </Link>

        </div>
      </div>
    </main>
  );
}
