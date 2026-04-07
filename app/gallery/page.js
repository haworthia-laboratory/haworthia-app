"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => { setPhotos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>ギャラリー</h1>
          <p className="subtitle">みんなのハオルチア</p>
        </header>

        {loading ? (
          <p style={{ textAlign: "center", color: "#7a9a7c", marginTop: "2rem" }}>読み込み中...</p>
        ) : photos.length === 0 ? (
          <div style={{ textAlign: "center", color: "#a0b8a2", marginTop: "3rem" }}>
            <p>まだ公開された写真がありません</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {photos.map((p, i) => (
              <div key={i} className="gallery-item">
                <img src={p.src} alt={p.plantName || "ハオルチア"} className="gallery-img" />
                <div className="gallery-item-body">
                  {p.plantName && <div className="gallery-plant-name">{p.plantName}</div>}
                  {p.speciesName && p.speciesName !== p.plantName && (
                    <div className="gallery-species-name">{p.speciesName}</div>
                  )}
                  <div className="gallery-date">{p.date?.replace(/-/g, ".")}</div>
                  {p.note && <div className="gallery-note">{p.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
