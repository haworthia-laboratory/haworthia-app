"use client";

import { useState, useRef } from "react";

function HaworthiaIcon() {
  return (
    <svg viewBox="0 0 120 120" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
      {[0,45,90,135,180,225,270,315].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 60 60)`}>
          <ellipse cx="60" cy="28" rx="9" ry="22" fill="#5a8f5c" opacity="0.85" />
          <ellipse cx="60" cy="20" rx="5" ry="10" fill="rgba(200,235,200,0.55)" />
        </g>
      ))}
      {[22,112,202,292].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 60 60)`}>
          <ellipse cx="60" cy="36" rx="7" ry="16" fill="#4a7a4c" opacity="0.9" />
          <ellipse cx="60" cy="30" rx="4" ry="8" fill="rgba(200,235,200,0.6)" />
        </g>
      ))}
      <circle cx="60" cy="60" r="10" fill="#3a6b3c" />
      <circle cx="60" cy="60" r="6" fill="rgba(200,235,200,0.7)" />
    </svg>
  );
}

export default function Home() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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

  return (
    <main>
      <div className="container">
        <header>
          <h1>ハオルチア研究室</h1>
          <p className="subtitle">撮影→鑑定→記録　あなただけの育成記録</p>
          <div className="steps">
            <div className="step">
              <span className="step-icon">📷</span>
              <span className="step-label">撮影</span>
            </div>
            <span className="step-arrow">→</span>
            <div className="step">
              <span className="step-icon">🔍</span>
              <span className="step-label">鑑定</span>
            </div>
            <span className="step-arrow">→</span>
            <div className="step">
              <span className="step-icon">📓</span>
              <span className="step-label">記録</span>
            </div>
          </div>
        </header>

        <div className="upload-card" onClick={() => !image && fileInputRef.current.click()}>
          {image ? (
            <img src={image} alt="選択した画像" className="preview" />
          ) : (
            <div className="upload-placeholder">
              <HaworthiaIcon />
              <p>写真をタップして選択</p>
              <p className="sub">カメラまたはアルバムから</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ display: "none" }} />
        </div>

        {image && !loading && !result && (
          <button className="identify-btn" onClick={identify}>鑑定する</button>
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
            <button className="retry-btn" onClick={reset}>別の写真を試す</button>
          </>
        )}
      </div>
    </main>
  );
}
