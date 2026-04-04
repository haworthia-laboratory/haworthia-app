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
      {/* ノート本体（やや左寄り） */}
      <path d="M8,9 L42,9 Q44,9 44,11 L44,55 Q44,57 42,57 L8,57 Q6,57 6,55 L6,11 Q6,9 8,9 Z"
        fill="rgba(160,148,136,0.18)" stroke="#b0a498" strokeWidth="1.8" strokeLinejoin="round" filter="url(#f3)" />
      <path d="M8,9 L42,9 Q44,9 44,11 L44,55 Q44,57 42,57 L8,57 Q6,57 6,55 L6,11 Q6,9 8,9 Z"
        fill="none" stroke="#887870" strokeWidth="1.2" strokeLinejoin="round" opacity="0.8" />
      {/* 罫線 */}
      <line x1="12" y1="26" x2="38" y2="26" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <line x1="12" y1="34" x2="38" y2="34" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <line x1="12" y1="42" x2="30" y2="42" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* 鉛筆（右上、先端が左下のノートに向かう） */}
      <g transform="translate(50,18) rotate(145)">
        {/* 消しゴム */}
        <rect x="-3" y="-20" width="6" height="5" rx="1.2"
          fill="rgba(200,178,168,0.45)" stroke="#b0988a" strokeWidth="1" />
        {/* 金属帯 */}
        <rect x="-3" y="-15" width="6" height="3"
          fill="rgba(180,168,148,0.4)" stroke="#a09070" strokeWidth="0.8" />
        {/* 本体 */}
        <rect x="-3" y="-12" width="6" height="22" rx="0.5"
          fill="rgba(172,158,140,0.32)" stroke="#a09080" strokeWidth="1.2" />
        {/* 木部（先端） */}
        <polygon points="-3,10 3,10 0,17"
          fill="rgba(195,172,145,0.45)" stroke="#a09070" strokeWidth="0.9" />
        {/* 芯 */}
        <polygon points="-0.8,15 0.8,15 0,17"
          fill="rgba(100,90,80,0.6)" />
      </g>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="fb"><feGaussianBlur stdDeviation="0.5" /></filter>
      </defs>
      {/* 表紙（正面・やや台形で奥行き感） */}
      <path d="M8,16 L44,12 L44,54 L8,58 Z"
        fill="rgba(160,148,136,0.22)" stroke="#b0a498" strokeWidth="1.8" strokeLinejoin="round" filter="url(#fb)" />
      <path d="M8,16 L44,12 L44,54 L8,58 Z"
        fill="none" stroke="#887870" strokeWidth="1.2" opacity="0.85" />
      {/* 小口（右側・ページの断面） */}
      <path d="M44,12 L56,16 L56,58 L44,54 Z"
        fill="rgba(220,210,200,0.35)" stroke="#b0a498" strokeWidth="1.5" strokeLinejoin="round" />
      {/* 上面 */}
      <path d="M8,16 L44,12 L56,16 L20,20 Z"
        fill="rgba(180,168,156,0.28)" stroke="#b0a498" strokeWidth="1.3" strokeLinejoin="round" />
      {/* 小口のページ線（辞書らしい細かい積み重ね） */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => {
        const t = i / 13;
        const y1 = 14 + t * 40, y2 = 18 + t * 40;
        return <line key={i} x1="44" y1={y1} x2="56" y2={y2}
          stroke="#c8bcb0" strokeWidth="0.7" opacity={0.3 + (i % 3) * 0.1} />;
      })}
      {/* しおり */}
      <path d="M34,12 L34,24 L31,21 L28,24 L28,12 Z"
        fill="rgba(180,148,120,0.4)" stroke="#c0a880" strokeWidth="0.8" />
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
