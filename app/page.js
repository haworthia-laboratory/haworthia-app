"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { IconDiary, IconLight, IconZukan, IconDiagnose, IconColumn, IconGallery, IconBoard } from "./components/Icons";

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
      {/* 開いた本の左ページ */}
      <path d="M32,14 Q20,12 8,15 L8,52 Q20,49 32,51 Z"
        fill="rgba(160,148,136,0.15)" stroke="#9a8e84" strokeWidth="1.6" strokeLinejoin="round" />
      {/* 開いた本の右ページ */}
      <path d="M32,14 Q44,12 56,15 L56,52 Q44,49 32,51 Z"
        fill="rgba(160,148,136,0.15)" stroke="#9a8e84" strokeWidth="1.6" strokeLinejoin="round" />
      {/* 中央の綴じ目 */}
      <path d="M32,14 Q31,32 32,51" fill="none" stroke="#9a8e84" strokeWidth="1.2" opacity="0.6" />
      {/* 左ページの罫線 */}
      <line x1="13" y1="27" x2="28" y2="26" stroke="#c4b8b0" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
      <line x1="13" y1="34" x2="28" y2="33" stroke="#c4b8b0" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
      <line x1="13" y1="41" x2="24" y2="40" stroke="#c4b8b0" strokeWidth="0.9" strokeLinecap="round" opacity="0.5" />
      {/* 鉛筆（右上から左下に向かう） */}
      <g transform="translate(52,14) rotate(30)">
        <rect x="-2.5" y="-18" width="5" height="4" rx="1"
          fill="rgba(200,178,168,0.5)" stroke="#a08878" strokeWidth="1" />
        <rect x="-2.5" y="-14" width="5" height="2.5"
          fill="rgba(170,158,138,0.45)" stroke="#908060" strokeWidth="0.8" />
        <rect x="-2.5" y="-11.5" width="5" height="20" rx="0.5"
          fill="rgba(168,152,132,0.35)" stroke="#9a8878" strokeWidth="1.3" />
        <polygon points="-2.5,8.5 2.5,8.5 0,15"
          fill="rgba(190,168,138,0.5)" stroke="#908060" strokeWidth="0.9" />
        <polygon points="-0.7,13 0.7,13 0,15"
          fill="rgba(80,72,64,0.65)" />
      </g>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      {/* 背表紙（左・太くて厚い） */}
      <path d="M10,10 L18,10 L18,56 L10,56 Z"
        fill="rgba(130,118,106,0.35)" stroke="#8a7e72" strokeWidth="1.5" strokeLinejoin="round" />
      {/* 表紙（正面） */}
      <path d="M18,10 L52,10 L52,56 L18,56 Z"
        fill="rgba(160,148,136,0.2)" stroke="#9a8e84" strokeWidth="1.7" strokeLinejoin="round" />
      {/* 上面（厚みを強調） */}
      <path d="M10,10 L18,10 L52,10 L52,10" fill="none" stroke="#9a8e84" strokeWidth="1.7" />
      {/* 背表紙と表紙の境界線（立体感） */}
      <line x1="18" y1="10" x2="18" y2="56" stroke="#7a6e62" strokeWidth="1.2" opacity="0.6" />
      {/* ページの小口（右側・細かい線で厚みを表現） */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={i} x1="51" y1={12 + i * 5} x2="51" y2={15 + i * 5}
          stroke="#c0b4a8" strokeWidth="0.6" opacity="0.45" strokeLinecap="round" />
      ))}
      {/* 表紙の横線2本（図鑑らしさ） */}
      <line x1="22" y1="22" x2="48" y2="22" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="22" y1="28" x2="40" y2="28" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
      {/* しおり */}
      <path d="M40,10 L40,20 L37.5,17.5 L35,20 L35,10 Z"
        fill="rgba(175,145,115,0.45)" stroke="#b89870" strokeWidth="0.9" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="24" height="22" rx="3" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.6"/>
      <rect x="34" y="14" width="24" height="22" rx="3" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.6"/>
      <rect x="6" y="40" width="24" height="10" rx="3" fill="rgba(160,148,136,0.12)" stroke="#9a8e84" strokeWidth="1.4"/>
      <rect x="34" y="40" width="24" height="10" rx="3" fill="rgba(160,148,136,0.12)" stroke="#9a8e84" strokeWidth="1.4"/>
      <circle cx="14" cy="22" r="3" fill="rgba(200,178,138,0.4)" stroke="#b8a878" strokeWidth="1"/>
      <polyline points="6,32 14,24 22,30 30,20" fill="none" stroke="#9a8e84" strokeWidth="1.2" strokeLinejoin="round"/>
      <polyline points="34,32 42,22 50,28 58,18" fill="none" stroke="#9a8e84" strokeWidth="1.2" strokeLinejoin="round"/>
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
  const [session, setSession] = useState(undefined); // undefined=未確認, null=未ログイン
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("nickname")
          .eq("user_id", session.user.id)
          .single();
        if (profile?.nickname) setNickname(profile.nickname);
      }
    });
  }, []);

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
        if (brightness > 200) level = { label: "非常に良い", desc: "ハオルチアに最適な明るさです", bar: 100, guide: "万象・玉扇・硬葉系など、やや強めの光を好む品種も問題なく育てられます。直射日光が当たる場合はレースカーテン越しにしましょう。" };
        else if (brightness > 140) level = { label: "良い", desc: "十分な光量があります", bar: 75, guide: "オブツーサ系・シンビフォルミスなど多くの軟葉系品種に最適な環境です。ほとんどの品種を育てられます。" };
        else if (brightness > 80) level = { label: "普通", desc: "もう少し明るい場所が理想的です", bar: 50, guide: "耐陰性の高い品種（宝草・シンビフォルミスなど）なら育てられますが、窓に近づけるとより元気に育ちます。" };
        else level = { label: "足りない", desc: "光が不足しています。窓辺に移動しましょう", bar: 25, guide: "この明るさでは多くの品種が徒長してしまいます。できるだけ窓辺に移動するか、植物育成ライトの使用を検討してみてください。" };
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

          {session === null && (
            <Link href="/login" className="home-login-banner">
              <div className="home-login-banner-text">
                <span className="home-login-banner-title">ログイン / 新規登録</span>
                <span className="home-login-banner-desc">成長日記の記録・管理はログインが必要です</span>
              </div>
              <span className="home-login-banner-arrow">›</span>
            </Link>
          )}
          {session && (
            <Link href="/account" className="home-login-banner home-login-banner--loggedin">
              <div className="home-login-banner-text">
                <span className="home-login-banner-title">ログイン中</span>
                <span className="home-login-banner-desc">{nickname || (() => { const [l, d] = session.user.email.split("@"); return l.slice(0, 2) + "×".repeat(Math.max(0, l.length - 2)) + "@" + d; })()}</span>
              </div>
              <span className="home-login-banner-arrow">›</span>
            </Link>
          )}

          {/* 記録する */}
          <div className="home-section-label">記録する</div>
          <Link href="/diary" className="home-nav-card">
            <div className="home-nav-icon"><IconDiary size={48} /></div>
            <div className="home-nav-body">
              <div className="home-nav-title">成長日記</div>
              <div className="home-nav-desc">株の登録・写真記録・成長メモ</div>
            </div>
            <div className="home-nav-arrow">›</div>
          </Link>
          <div className="home-nav-card home-nav-card--light" onClick={() => lightInputRef.current.click()} style={{ cursor: "pointer" }}>
            <div className="home-nav-icon"><IconLight size={48} /></div>
            <div className="home-nav-body">
              <div className="home-nav-title">照度チェック</div>
              <div className="home-nav-desc">置き場所の明るさを写真で確認</div>
            </div>
            <div className="home-nav-arrow">›</div>
          </div>
          <input ref={lightInputRef} type="file" accept="image/*" onChange={measureLight} style={{ display: "none" }} />
          {lightResult && (
            <div className="light-result">
              <div className="light-result-label">{lightResult.label}</div>
              <div className="light-bar-wrap">
                <div className="light-bar" style={{ width: `${lightResult.bar}%` }} />
              </div>
              <div className="light-desc">{lightResult.desc}</div>
              <div className="light-guide">{lightResult.guide}</div>
            </div>
          )}

          {/* 調べる */}
          <div className="home-section-label">調べる</div>
          <div className="home-grid-2">
            <Link href="/zukan" className="home-grid-card">
              <div className="home-grid-icon"><IconZukan size={36} /></div>
              <div className="home-grid-title">品種図鑑</div>
              <div className="home-grid-desc">171品種を検索</div>
            </Link>
            <Link href="/akinator" className="home-grid-card">
              <div className="home-grid-icon"><IconDiagnose size={36} /></div>
              <div className="home-grid-title">品種診断</div>
              <div className="home-grid-desc">質問で絞り込む</div>
            </Link>
          </div>

          {/* 読む・つながる */}
          <div className="home-section-label">読む・つながる</div>
          <div className="home-grid-3">
            <Link href="/column" className="home-grid-card">
              <div className="home-grid-icon"><IconColumn size={36} /></div>
              <div className="home-grid-title">コラム</div>
              <div className="home-grid-desc">育て方・豆知識</div>
            </Link>
            <Link href="/gallery" className="home-grid-card">
              <div className="home-grid-icon"><IconGallery size={36} /></div>
              <div className="home-grid-title">ギャラリー</div>
              <div className="home-grid-desc">みんなの写真</div>
            </Link>
            <Link href="/board" className="home-grid-card">
              <div className="home-grid-icon"><IconBoard size={36} /></div>
              <div className="home-grid-title">掲示板</div>
              <div className="home-grid-desc">質問・雑談</div>
            </Link>
          </div>

        </div>

        <div style={{ textAlign: "center", marginTop: "2rem", paddingBottom: "1rem", display: "flex", justifyContent: "center", gap: "1.2rem", flexWrap: "wrap" }}>
          <Link href="/account" style={{ fontSize: "0.72rem", color: "#a0b8a2", textDecoration: "none" }}>
            アカウント設定
          </Link>
          <Link href="/contact" style={{ fontSize: "0.72rem", color: "#a0b8a2", textDecoration: "none" }}>
            お問い合わせ
          </Link>
          <Link href="/privacy" style={{ fontSize: "0.72rem", color: "#a0b8a2", textDecoration: "none" }}>
            プライバシーポリシー
          </Link>
        </div>
      </div>
    </main>
  );
}
