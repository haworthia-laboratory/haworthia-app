"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { IconDiary, IconLight, IconZukan, IconDiagnose, IconColumn, IconGallery, IconBoard } from "./components/Icons";
import { species } from "./zukan/data";

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

// 日付ベースで毎日変わるピックアップ（画像ありのみ）
const withGallery = species.filter(s => s.gallery?.length > 0);
const todaySeed = new Date().getDate() + new Date().getMonth() * 31;
const pickupSpecies = [0, 1, 2].map(i => withGallery[(todaySeed + i * 17) % withGallery.length]);

// 日替わり雑学
const TRIVIA = [
  { emoji: "🪟", text: "ハオルチアの葉先にある透明な部分は「窓（まど）」と呼ばれ、地中に埋まった状態でも光を葉の内部まで導く仕組みになっている。" },
  { emoji: "🌍", text: "ハオルチア属は南アフリカにのみ自生する固有属。自生地では岩陰や草の根元に半分埋まった状態で見つかることが多い。" },
  { emoji: "💧", text: "ハオルチアは春・秋に成長する「春秋型」。夏と冬は休眠に近い状態になるため、水やりを大きく控えるのが基本。" },
  { emoji: "🔬", text: "「軟葉系」と「硬葉系」は見た目だけでなく育ちやすさも違う。硬葉系の方が乾燥・直射日光に比較的強く、初心者向きといわれる。" },
  { emoji: "🌿", text: "ハオルチアはアロエやガステリアと近縁。三属を交配した「ガステアロエ」などの属間雑種も存在する。" },
  { emoji: "💡", text: "ハオルチアの「錦（にしき）」は葉緑素が一部欠けた斑入り個体のこと。光合成効率が下がるぶん成長が遅く、希少性が高い。" },
  { emoji: "🌱", text: "ハオルチアは株分け・葉挿し・実生（種まき）で増やせる。葉挿しは軟葉系より硬葉系の方が成功しやすい傾向がある。" },
  { emoji: "📏", text: "ハオルチア属は現在150〜600種以上とされているが、専門家によって分類が大きく異なり、現在も分類学上の議論が続いている。" },
  { emoji: "🏺", text: "ハオルチアは根が太く水分をためやすい。素焼きの鉢は通気性が高く根腐れを防ぎやすいため、栽培に向いているよ。" },
  { emoji: "🌸", text: "ハオルチアは春〜初夏に細い花茎を伸ばし、小さな白い花を咲かせる。花の形は属の分類にも使われる重要な特徴。" },
  { emoji: "🧊", text: "「氷砂糖」などの名前はコレクターや愛好家がつけた日本独自の品種名。海外では別名で流通していることが多い。" },
  { emoji: "🔆", text: "強すぎる直射日光はハオルチアにとってNG。窓越しの明るい光が理想で、夏場の西日は特に葉焼けの原因になりやすい。" },
  { emoji: "🪴", text: "「糊斑（のりふ）」は斑が葉の縁ではなく中央に入るタイプ。通常の錦とは異なる発色パターンで、コレクター人気が高い。" },
  { emoji: "🌡️", text: "ハオルチアは5℃以上あれば越冬できる種が多い。ただし0℃以下になると凍害のリスクがあるため、室内管理が基本。" },
  { emoji: "🔭", text: "軟葉系ハオルチアの「窓」の模様や透明度は個体差が大きく、同じ品種でも1株ごとに顔が違う。それがコレクター心をくすぐる理由のひとつ。" },
  { emoji: "🧬", text: "ハオルチアの交配は比較的容易で、愛好家による個人交配品が多数流通している。「血統書」として親株情報を公開するブリーダーも多い。" },
  { emoji: "🌊", text: "軟葉系の葉はほとんどが水分。パンパンに張っているほど健康な証拠で、しぼみ始めたらそろそろ水やりのサイン。" },
  { emoji: "🗾", text: "日本はハオルチアの一大コレクション市場。国内ブリーダーが作出した品種が海外に「逆輸出」されるケースも増えている。" },
  { emoji: "🧩", text: "ハオルチアの属名は南アフリカの植物学者エイドリアン・ハウォース（Adrian Hardy Haworth）に由来する。" },
  { emoji: "💰", text: "希少なハオルチアはオークションで数万〜数十万円になることも。「旧氷砂糖」など古くからの名品は特に高値がつきやすい。" },
  { emoji: "🌲", text: "ハオルチアの自生地・南アフリカは季節が日本と逆。現地の雨季（冬〜春）が成長期にあたり、日本の管理カレンダーとは少しズレがある。" },
  { emoji: "🫧", text: "葉の表面に細かいツブツブ（疣＝いぼ）があるタイプを「疣系」と呼ぶ。触り心地もまた独特で、ファンが多い。" },
  { emoji: "🔄", text: "ハオルチアはCAM型光合成を行う。夜間に気孔を開いてCO₂を取り込み、昼間は気孔を閉じて水分蒸散を防ぐ砂漠適応の仕組み。" },
  { emoji: "📷", text: "同じ株でも季節・光加減・水分量によって色や透明感が大きく変わる。成長記録の写真を撮り続けると、その変化が楽しめる。" },
  { emoji: "🌙", text: "ハオルチアは夏の直射日光を嫌うが、秋〜冬の弱い日差しはむしろ歓迎。日光に当てると葉が締まり、締まった株ほど丈夫になる。" },
];
const todayTrivia = TRIVIA[todaySeed % TRIVIA.length];

export default function Home() {
  const [lightResult, setLightResult] = useState(null);
  const [showLightModal, setShowLightModal] = useState(false);
  const [lightDragOver, setLightDragOver] = useState(false);
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

  const processLightFile = (file) => {
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
        setShowLightModal(false);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const measureLight = (e) => {
    processLightFile(e.target.files[0]);
    e.target.value = "";
  };

  return (
    <main>
      <div className="container">
        <header style={{ marginBottom: "2rem" }}>
          <div className="home-hero">
            <div className="home-hero-bg" />
            <h1>ハオルチア研究室</h1>
            <p className="subtitle">～ あなただけの育成記録 ～</p>
          </div>
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

          {/* 今日のピックアップ */}
          <div className="home-section-label">今日のピックアップ</div>
          <div className="home-pickup-grid">
            {pickupSpecies.map(sp => (
              <Link key={sp.id} href={`/zukan/${sp.id}`} className="home-pickup-card">
                <img src={sp.gallery[0]} alt={sp.name} className="home-pickup-img" />
                <div className="home-pickup-name">{sp.name}</div>
                <div className="home-pickup-group">{sp.group}</div>
              </Link>
            ))}
          </div>

          {/* 雑学 */}
          <div className="home-trivia-card">
            <div className="home-trivia-label">ちょこっと雑学</div>
            <div className="home-trivia-body">
              <span className="home-trivia-emoji">{todayTrivia.emoji}</span>
              <p className="home-trivia-text">{todayTrivia.text}</p>
            </div>
          </div>

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
          <div className="home-nav-card home-nav-card--light" onClick={() => setShowLightModal(true)} style={{ cursor: "pointer" }}>
            <div className="home-nav-icon"><IconLight size={48} /></div>
            <div className="home-nav-body">
              <div className="home-nav-title">照度チェック</div>
              <div className="home-nav-desc">置き場所の明るさを写真で確認</div>
            </div>
            <div className="home-nav-arrow">›</div>
          </div>
          <input ref={lightInputRef} type="file" accept="image/*" onChange={measureLight} style={{ display: "none" }} />

          {showLightModal && (
            <div className="light-modal-overlay" onClick={() => setShowLightModal(false)}>
              <div className="light-modal" onClick={e => e.stopPropagation()}>
                <div className="light-modal-header">
                  <span className="light-modal-title">📷 照度チェック</span>
                  <button className="light-modal-close" onClick={() => setShowLightModal(false)}>✕</button>
                </div>

                <div className="light-modal-tips">
                  <div className="light-modal-tip-row">
                    <span className="light-modal-tip-icon">
                      <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                        {/* 茎 */}
                        <path d="M16,30 Q16,20 13,16" fill="none" stroke="#5a8a5c" strokeWidth="1.5" strokeLinecap="round"/>
                        {/* 左の葉 */}
                        <path d="M13,16 Q6,12 7,5 Q13,8 13,16 Z" fill="rgba(90,138,92,0.55)" stroke="#4a7a4c" strokeWidth="1" strokeLinejoin="round"/>
                        {/* 右の葉 */}
                        <path d="M13,16 Q20,10 20,4 Q14,8 13,16 Z" fill="rgba(110,160,112,0.5)" stroke="#4a7a4c" strokeWidth="1" strokeLinejoin="round"/>
                        {/* 芽の先 */}
                        <path d="M13,16 Q15,10 16,6 Q14,10 13,16 Z" fill="rgba(140,190,142,0.45)" stroke="#5a9a5c" strokeWidth="0.8"/>
                      </svg>
                    </span>
                    <span>ハオルチアを置く予定の場所を撮影してください。植物の写真ではなく<strong>置き場所そのもの</strong>を写すと正確に計測できます。</span>
                  </div>
                  <div className="light-modal-tip-row">
                    <span className="light-modal-tip-icon">
                      <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                        {/* 白い紙：折り目あり・光沢感 */}
                        <rect x="5" y="4" width="22" height="26" rx="2" fill="rgba(255,255,255,0.98)" stroke="#c0b8b0" strokeWidth="1.3"/>
                        {/* 折り目（右上コーナー） */}
                        <path d="M19,4 L27,12 L19,12 Z" fill="rgba(210,204,196,0.4)" stroke="#c0b8b0" strokeWidth="0.9"/>
                        {/* 光沢ハイライト */}
                        <rect x="8" y="7" width="7" height="2" rx="1" fill="rgba(255,255,255,0.9)" opacity="0.7"/>
                      </svg>
                    </span>
                    <span><strong>白い紙を置いて撮影</strong>すると精度が上がります。白は光を均一に反射するため、明るさの基準として最適です。黒い背景は光を吸収してしまい、実際より暗く判定されることがあります。</span>
                  </div>
                  <div className="light-modal-tip-row">
                    <span className="light-modal-tip-icon">
                      <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="5.5" fill="rgba(220,200,140,0.28)" stroke="#c8b870" strokeWidth="1.4"/>
                        {[0,45,90,135,180,225,270,315].map((a, i) => {
                          const rad = a * Math.PI / 180;
                          return <line key={i} x1={16 + 7.5*Math.cos(rad)} y1={16 + 7.5*Math.sin(rad)} x2={16 + 10.5*Math.cos(rad)} y2={16 + 10.5*Math.sin(rad)} stroke="#c8b870" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>;
                        })}
                      </svg>
                    </span>
                    <span>フラッシュはオフにして、自然光の状態で撮影してください。</span>
                  </div>
                </div>

                {/* 撮り方イラスト（正確な構図：窓＝左、紙＝中央、カメラ＝右斜め上） */}
                <div className="light-howto-illust">
                  <svg viewBox="0 0 300 155" width="100%" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: 300 }}>
                    {/* 背景 */}
                    <rect width="300" height="155" rx="10" fill="rgba(248,246,242,0.92)"/>

                    {/* ===== 窓（左）===== */}
                    <rect x="10" y="18" width="56" height="76" rx="3" fill="rgba(190,225,250,0.28)" stroke="#9a8e84" strokeWidth="1.4"/>
                    <line x1="10" y1="56" x2="66" y2="56" stroke="#9a8e84" strokeWidth="1" opacity="0.5"/>
                    <line x1="38" y1="18" x2="38" y2="94" stroke="#9a8e84" strokeWidth="1" opacity="0.5"/>
                    <rect x="6" y="13" width="64" height="7" rx="2" fill="rgba(160,148,136,0.2)" stroke="#9a8e84" strokeWidth="1"/>
                    {/* 太陽 */}
                    <circle cx="25" cy="38" r="8.5" fill="rgba(220,200,130,0.38)" stroke="#c8b870" strokeWidth="1.2"/>
                    {[0,60,120,180,240,300].map((a,i)=>{const r=Math.PI*a/180;return <line key={i} x1={25+11*Math.cos(r)} y1={38+11*Math.sin(r)} x2={25+14*Math.cos(r)} y2={38+14*Math.sin(r)} stroke="#c8b870" strokeWidth="1.1" strokeLinecap="round" opacity="0.75"/>;})}
                    <text x="38" y="112" textAnchor="middle" fontSize="7.5" fill="#b89830" fontFamily="sans-serif">自然光</text>

                    {/* ===== 光の筋（窓→紙へ水平に）===== */}
                    {/* 光はカメラを避けて紙に届く（カメラは右側にある） */}
                    <line x1="66" y1="52" x2="118" y2="52" stroke="#c8b870" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                    <line x1="66" y1="63" x2="118" y2="63" stroke="#c8b870" strokeWidth="2.4" strokeLinecap="round" opacity="0.55"/>
                    <line x1="66" y1="74" x2="118" y2="74" stroke="#c8b870" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
                    {/* 矢印先端 */}
                    <polyline points="114,48 119,52 114,56" fill="none" stroke="#c8b870" strokeWidth="1.3" strokeLinecap="round" opacity="0.7"/>
                    <polyline points="114,59 119,63 114,67" fill="none" stroke="#c8b870" strokeWidth="1.3" strokeLinecap="round" opacity="0.75"/>
                    <polyline points="114,70 119,74 114,78" fill="none" stroke="#c8b870" strokeWidth="1.3" strokeLinecap="round" opacity="0.65"/>

                    {/* ===== 台・棚 ===== */}
                    <rect x="86" y="97" width="205" height="8" rx="2.5" fill="rgba(160,148,136,0.22)" stroke="#9a8e84" strokeWidth="1.2"/>

                    {/* ===== 白い紙（台の上・中央）===== */}
                    <rect x="108" y="78" width="58" height="19" rx="2" fill="rgba(255,255,255,0.98)" stroke="#c0b8b0" strokeWidth="1.3"/>
                    {/* 折り目 */}
                    <path d="M152,78 L166,78 L166,92" fill="none" stroke="#d0c8c0" strokeWidth="0.9" opacity="0.5"/>
                    <text x="137" y="92" textAnchor="middle" fontSize="7.5" fill="#a89e94" fontFamily="sans-serif">白い紙</text>

                    {/* ===== スマホ（右側・横向き・左端のレンズが紙に向く）===== */}
                    {/* rotate(18) で左端（カメラ側）が少し下がり、紙に向く */}
                    <g transform="translate(222,62) rotate(18)">
                      {/* 本体 */}
                      <rect x="-30" y="-13" width="60" height="26" rx="5" fill="rgba(100,92,82,0.18)" stroke="#9a8e84" strokeWidth="1.4"/>
                      {/* カメラレンズ（左端） */}
                      <circle cx="-23" cy="0" r="5.5" fill="rgba(55,65,78,0.25)" stroke="#8a9ea8" strokeWidth="1"/>
                      <circle cx="-23" cy="0" r="2.8" fill="rgba(45,75,108,0.22)" stroke="#8ab0c0" strokeWidth="0.7"/>
                      <circle cx="-24.5" cy="-1.5" r="0.9" fill="rgba(255,255,255,0.65)"/>
                      {/* 画面 */}
                      <rect x="-13" y="-9" width="36" height="18" rx="2" fill="rgba(200,220,240,0.18)" stroke="#b0a898" strokeWidth="0.8"/>
                    </g>

                    {/* カメラレンズから紙へ向かう点線矢印 */}
                    {/* レンズ位置（rotate(18)後の(-23,0)＋translate(222,62)） */}
                    {/* cos(18)≈0.951, sin(18)≈0.309 → (-23*0.951-0*0.309+222, -23*(-0.309)+0*0.951+62) = (200.1, 69.1) */}
                    <line x1="200" y1="69" x2="163" y2="82" stroke="#9a8e84" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="3,2.5"/>
                    <polyline points="167,79 162,83 167,86" fill="none" stroke="#9a8e84" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>

                    {/* ===== フラッシュOFFバッジ ===== */}
                    <g transform="translate(261,38)">
                      <circle cx="0" cy="0" r="10" fill="rgba(250,248,245,0.95)" stroke="#c07070" strokeWidth="1.3"/>
                      <polygon points="1,-5.5 -2,0 1.5,0 -1.5,5.5 2.5,0 -1,0 2,-5.5" fill="rgba(200,170,60,0.45)" stroke="#c8a830" strokeWidth="0.7"/>
                      <line x1="-7" y1="-7" x2="7" y2="7" stroke="#c07070" strokeWidth="1.7" strokeLinecap="round"/>
                    </g>
                    <text x="261" y="54" textAnchor="middle" fontSize="6.5" fill="#c07070" fontFamily="sans-serif">フラッシュOFF</text>
                  </svg>
                </div>

                <div
                  className={`light-drop-area${lightDragOver ? " drag-over" : ""}`}
                  onClick={() => lightInputRef.current.click()}
                  onDragOver={e => { e.preventDefault(); setLightDragOver(true); }}
                  onDragLeave={() => setLightDragOver(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setLightDragOver(false);
                    processLightFile(e.dataTransfer.files[0]);
                  }}
                >
                  <svg viewBox="0 0 48 48" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="8" width="40" height="32" rx="4" fill="rgba(160,148,136,0.15)" stroke="#9a8e84" strokeWidth="1.6"/>
                    <circle cx="13" cy="17" r="3" fill="rgba(200,178,138,0.35)" stroke="#b8a878" strokeWidth="1"/>
                    <polyline points="4,34 14,22 22,30 30,20 44,34" fill="none" stroke="#b8aca0" strokeWidth="1.4" strokeLinejoin="round"/>
                    <line x1="24" y1="22" x2="24" y2="38" stroke="#9a8e84" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
                    <polyline points="19,27 24,22 29,27" fill="none" stroke="#9a8e84" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                  </svg>
                  <div className="light-drop-text">ここに写真をドロップ</div>
                  <div className="light-drop-sub">または</div>
                  <div className="light-drop-btn">ファイルを選ぶ</div>
                </div>
              </div>
            </div>
          )}
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
          <div className="home-grid-3">
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
            <Link href="/column" className="home-grid-card">
              <div className="home-grid-icon"><IconColumn size={36} /></div>
              <div className="home-grid-title">コラム</div>
              <div className="home-grid-desc">育て方・豆知識</div>
            </Link>
          </div>

          {/* つながる */}
          <div className="home-section-label">つながる</div>
          <div className="home-grid-2">
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
