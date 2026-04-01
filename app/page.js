"use client";

import { useState, useRef } from "react";

function CameraIcon() {
  return (
    <svg viewBox="0 0 64 64" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="f1" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      {/* ボディ */}
      <path d="M8 22 Q7 21 9 20 L55 20 Q57 20 56 22 L56 52 Q56 54 54 54 L10 54 Q8 54 8 52 Z"
        fill="rgba(160,148,136,0.2)" stroke="#b0a498" strokeWidth="1.8" strokeLinejoin="round" filter="url(#f1)" />
      <path d="M8 22 Q7 21 9 20 L55 20 Q57 20 56 22 L56 52 Q56 54 54 54 L10 54 Q8 54 8 52 Z"
        fill="none" stroke="#887870" strokeWidth="1.2" strokeLinejoin="round" strokeDasharray="1,0" opacity="0.7"/>
      {/* ファインダー */}
      <path d="M22 20 Q22 13 26 13 L38 13 Q42 13 42 20"
        fill="rgba(160,148,136,0.15)" stroke="#b0a498" strokeWidth="1.6" strokeLinejoin="round" />
      {/* レンズ外側 */}
      <circle cx="32" cy="37" r="11" fill="rgba(210,200,195,0.25)" stroke="#b0a498" strokeWidth="1.8" filter="url(#f1)" />
      {/* レンズ内側 */}
      <circle cx="32" cy="37" r="7" fill="rgba(220,210,205,0.35)" stroke="#887870" strokeWidth="1.2" />
      {/* レンズ光沢 */}
      <circle cx="29" cy="34" r="2.5" fill="rgba(255,255,255,0.55)" />
      {/* シャッター */}
      <circle cx="48" cy="26" r="3" fill="rgba(160,148,136,0.25)" stroke="#b0a498" strokeWidth="1.2" />
    </svg>
  );
}

function MagnifyIcon() {
  return (
    <svg viewBox="0 0 64 64" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="f2" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      {/* レンズ */}
      <circle cx="26" cy="26" r="17" fill="rgba(210,200,195,0.2)" stroke="#b0a498" strokeWidth="1.8" filter="url(#f2)" />
      <circle cx="26" cy="26" r="17" fill="none" stroke="#887870" strokeWidth="1.2" opacity="0.8" />
      {/* 内側 */}
      <circle cx="26" cy="26" r="12" fill="rgba(220,212,208,0.18)" stroke="#c4b8b0" strokeWidth="0.8" />
      {/* 光沢 */}
      <path d="M18 18 Q20 15 24 16" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round" />
      {/* グリップ */}
      <path d="M38 38 Q41 41 48 50 Q50 53 48 54 Q46 56 44 53 Q36 45 33 41"
        fill="rgba(160,148,136,0.18)" stroke="#b0a498" strokeWidth="3.5" strokeLinecap="round" filter="url(#f2)" />
      <path d="M38 38 Q41 41 48 50 Q50 53 48 54 Q46 56 44 53 Q36 45 33 41"
        fill="none" stroke="#887870" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 64 64" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="f3" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      {/* ノート本体 */}
      <path d="M14 10 Q13 9 15 9 L49 9 Q51 9 51 11 L51 55 Q51 56 49 56 L15 56 Q13 56 14 54 Z"
        fill="rgba(160,148,136,0.18)" stroke="#b0a498" strokeWidth="1.8" strokeLinejoin="round" filter="url(#f3)" />
      <path d="M14 10 Q13 9 15 9 L49 9 Q51 9 51 11 L51 55 Q51 56 49 56 L15 56 Q13 56 14 54 Z"
        fill="none" stroke="#887870" strokeWidth="1.2" strokeLinejoin="round" opacity="0.8" />
      {/* スパイラル */}
      {[14, 22, 30, 38, 46].map((y, i) => (
        <path key={i} d={`M11 ${y} Q9 ${y+2} 11 ${y+4} Q13 ${y+6} 11 ${y+8}`}
          fill="none" stroke="#c4b8b0" strokeWidth="1.4" strokeLinecap="round" />
      ))}
      {/* 罫線 */}
      <line x1="20" y1="22" x2="45" y2="22" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <line x1="20" y1="30" x2="45" y2="30" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <line x1="20" y1="38" x2="45" y2="38" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <line x1="20" y1="46" x2="38" y2="46" stroke="#c4b8b0" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* 小さな葉っぱ */}
      <path d="M39 44 Q44 40 46 44 Q44 48 39 44Z" fill="rgba(160,148,136,0.45)" stroke="#b0a498" strokeWidth="0.8" />
    </svg>
  );
}

function HaworthiaIcon() {
  return (
    <svg viewBox="0 0 160 160" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
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
        <radialGradient id="lg2" cx="45%" cy="80%" r="65%">
          <stop offset="0%" stopColor="#ccecd4" stopOpacity="0.85"/>
          <stop offset="60%" stopColor="#98c8a2" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#78b082" stopOpacity="0.55"/>
        </radialGradient>
        <radialGradient id="win" cx="50%" cy="15%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98"/>
          <stop offset="50%" stopColor="#f0faf2" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#d8f0dc" stopOpacity="0.1"/>
        </radialGradient>
      </defs>
      <g filter="url(#wc)">
        {/* 外側8枚 */}
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 80 80)`}>
            <path d="M80,73 C71,65 65,47 68,27 Q74,17 80,15 Q86,17 92,27 C95,47 89,65 80,73Z"
              fill={i%2===0?"url(#lg1)":"url(#lg2)"} stroke="#8aba94" strokeWidth="0.8" opacity={i%2===0?"0.9":"0.85"}/>
            <path d="M80,68 C74,61 71,48 73,31 Q78,22 80,19 Q82,22 87,31 C89,48 86,61 80,68Z"
              fill="url(#win)"/>
            {i%2===0 && <>
              <line x1="80" y1="16" x2="80" y2="11" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="77" y1="18" x2="74" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" strokeLinecap="round"/>
              <line x1="83" y1="18" x2="86" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" strokeLinecap="round"/>
            </>}
          </g>
        ))}
        {/* 中間5枚 */}
        {[22,94,166,238,310].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 80 80)`}>
            <path d="M80,75 C73,68 69,53 71,38 Q77,29 80,27 Q83,29 89,38 C91,53 87,68 80,75Z"
              fill={i%2===0?"url(#lg1)":"url(#lg2)"} stroke="#8aba94" strokeWidth="0.7" opacity={i%2===0?"0.9":"0.85"}/>
            <path d="M80,71 C75,65 73,54 75,41 Q79,33 80,31 Q81,33 85,41 C87,54 85,65 80,71Z"
              fill="url(#win)"/>
            {i%2===0 && <line x1="80" y1="28" x2="80" y2="23" stroke="rgba(255,255,255,0.9)" strokeWidth="1" strokeLinecap="round"/>}
          </g>
        ))}
        {/* 内側4枚 */}
        {[45,135,225,315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 80 80)`}>
            <path d="M80,77 C75,71 72,60 74,49 Q78,42 80,40 Q82,42 86,49 C88,60 85,71 80,77Z"
              fill={i%2===0?"url(#lg1)":"url(#lg2)"} stroke="#8aba94" strokeWidth="0.65" opacity={i%2===0?"0.9":"0.85"}/>
            <path d="M80,74 C77,69 75,61 77,52 Q79,46 80,44 Q81,46 83,52 C85,61 83,69 80,74Z"
              fill="url(#win)"/>
            {i%2===0 && <>
              <line x1="80" y1="41" x2="80" y2="37" stroke="rgba(255,255,255,0.95)" strokeWidth="1" strokeLinecap="round"/>
              <line x1="78" y1="43" x2="76" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="0.7" strokeLinecap="round"/>
              <line x1="82" y1="43" x2="84" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="0.7" strokeLinecap="round"/>
            </>}
          </g>
        ))}
        {/* 中心：ロゼット型の小葉5枚 */}
        {[0,72,144,216,288].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 80 80)`}>
            <path d="M80,80 C74,79 71,74 73,68 Q76,63 80,62 Q84,63 87,68 C89,74 86,79 80,80Z"
              fill={i%2===0?"#c0e4c8":"#cce8d4"} stroke="#8aba94" strokeWidth="0.55" opacity={i%2===0?"0.92":"0.87"}/>
            <path d="M80,79 C76,78 74,74 75,69 Q78,65 80,64 Q82,65 85,69 C86,74 84,78 80,79Z"
              fill="rgba(255,255,255,0.6)"/>
            {i%2===0 && <>
              <line x1="80" y1="63" x2="80" y2="59" stroke="rgba(255,255,255,0.9)" strokeWidth="0.9" strokeLinecap="round"/>
              <line x1="78" y1="64" x2="76" y2="61" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" strokeLinecap="round"/>
              <line x1="82" y1="64" x2="84" y2="61" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" strokeLinecap="round"/>
            </>}
          </g>
        ))}
        <circle cx="80" cy="80" r="3" fill="rgba(255,255,255,0.75)"/>
      </g>
    </svg>
  );
}

export default function Home() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lightResult, setLightResult] = useState(null);
  const fileInputRef = useRef(null);
  const lightInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      const base64 = reader.result.split(",")[1];
      setImageData(base64);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const identify = async () => {
    if (!imageData) return;
    setLoading(true);
    try {
      const response = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setImageData(null);
    setResult(null);
  };

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
        <header>
          <h1>ハオルチア研究室</h1>
          <p className="subtitle">撮影→鑑定→記録　あなただけの育成記録</p>
          <div className="steps">
            <div className="step">
              <CameraIcon />
              <span className="step-label">撮影</span>
            </div>
            <span className="step-arrow">→</span>
            <div className="step">
              <MagnifyIcon />
              <span className="step-label">鑑定</span>
            </div>
            <span className="step-arrow">→</span>
            <div className="step">
              <NoteIcon />
              <span className="step-label">記録</span>
            </div>
          </div>
        </header>

        <div
          className="upload-card"
          onClick={() => !image && fileInputRef.current.click()}
        >
          {image ? (
            <img src={image} alt="選択した画像" className="preview" />
          ) : (
            <div className="upload-placeholder">
              <HaworthiaIcon />
              <p>写真をタップして選択</p>
              <p className="sub">カメラまたはアルバムから</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>

        {image && !loading && !result && (
          <button className="identify-btn" onClick={identify}>
            鑑定する
          </button>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner" />
            <p>観察中...</p>
          </div>
        )}

        {result && !loading && (
          <>
            <div className="result-card">
              {result.error ? (
                <p className="not-found">エラーが発生しました。<br />もう一度お試しください。</p>
              ) : result.is_haworthia ? (
                <>
                  <div className="result-label">鑑定結果</div>
                  <div className="species-name">{result.species}</div>
                  <div className="scientific-name">{result.scientific_name}</div>
                  <div className="confidence-wrap">
                    <div className="confidence-bar">
                      <div className="bar" style={{ width: `${result.confidence}%` }} />
                    </div>
                    <div className="confidence-text">確信度 {result.confidence}%</div>
                  </div>
                  <div className="divider" />
                  <p className="description">{result.description}</p>
                </>
              ) : (
                <p className="not-found">ハオルチアが見つかりませんでした。<br />別の写真をお試しください。</p>
              )}
            </div>
            <button className="retry-btn" onClick={reset}>
              別の写真を試す
            </button>
          </>
        )}
        <div className="light-meter">
          <div className="light-meter-title">照度チェック</div>
          <p className="light-meter-sub">植物の置いている場所を撮影して明るさを確認</p>
          <button className="light-btn" onClick={() => lightInputRef.current.click()}>
            写真で測る
          </button>
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
        </div>

      </div>
    </main>
  );
}
