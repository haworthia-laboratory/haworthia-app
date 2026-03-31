"use client";

import { useState, useRef } from "react";

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
          <div className="header-deco">🪟</div>
          <h1>ハオルチア雑録</h1>
          <p>透明窓と薬草と植物たち</p>
        </header>

        <div
          className="upload-card"
          onClick={() => !image && fileInputRef.current.click()}
        >
          {image ? (
            <img src={image} alt="選択した画像" className="preview" />
          ) : (
            <div className="upload-placeholder">
              <span className="upload-icon">🌿</span>
              <p>写真をタップして選択</p>
              <p className="sub">カメラまたはアルバムから</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>

        {image && !loading && !result && (
          <button className="identify-btn" onClick={identify}>
            識別する
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
                  <div className="result-label">識別結果</div>
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
      </div>
    </main>
  );
}
