"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function GalleryPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("date"); // "date" | "species"
  const [openStrip, setOpenStrip] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState({});
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => { setGroups(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const sortedGroups = [...groups].sort((a, b) => {
    if (sortOrder === "species") {
      return (a.speciesName || "").localeCompare(b.speciesName || "", "ja");
    }
    return (b.latestDate || "").localeCompare(a.latestDate || "");
  });

  const getKey = (g) => g.plantId || `${g.plantName}_${g.speciesName}`;

  const getCurrentPhoto = (g) => {
    const key = getKey(g);
    return selectedPhoto[key] || g.photos[0];
  };

  const handleMoreClick = (g) => {
    const key = getKey(g);
    setOpenStrip(openStrip === key ? null : key);
  };

  const handlePhotoSelect = (g, src) => {
    const key = getKey(g);
    setSelectedPhoto(prev => ({ ...prev, [key]: src }));
    setOpenStrip(null);
  };

  // ライトボックス: スクロール禁止
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

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
        ) : groups.length === 0 ? (
          <div style={{ textAlign: "center", color: "#a0b8a2", marginTop: "3rem" }}>
            <p>まだ公開された写真がありません</p>
          </div>
        ) : (
          <>
          <div className="gallery-sort-group">
            <button
              className={`gallery-sort-btn${sortOrder === "date" ? " active" : ""}`}
              onClick={() => setSortOrder("date")}
            >投稿順</button>
            <button
              className={`gallery-sort-btn${sortOrder === "species" ? " active" : ""}`}
              onClick={() => setSortOrder("species")}
            >品種順</button>
          </div>
          <div className="gallery-grid">
            {sortedGroups.map((g) => {
              const key = getKey(g);
              const currentSrc = getCurrentPhoto(g);
              const isStripOpen = openStrip === key;
              return (
                <div key={key} className="gallery-item">
                  <div className="gallery-img-wrap" onClick={() => setLightbox(currentSrc)}>
                    <img src={currentSrc} alt={g.plantName || "ハオルチア"} className="gallery-img" loading="lazy" decoding="async" />
                    <div className="gallery-expand-hint">🔍</div>
                  </div>
                  <div className="gallery-item-body">
                    {g.speciesName && <div className="gallery-plant-name">{g.speciesName}</div>}
                    <div className="gallery-date">{g.latestDate?.replace(/-/g, ".")}</div>
                    {g.latestNote && <div className="gallery-note">{g.latestNote}</div>}
                    {g.photos.length > 1 && (
                      <button
                        className={`gallery-more-btn${isStripOpen ? " open" : ""}`}
                        onClick={() => handleMoreClick(g)}
                      >
                        {isStripOpen ? "閉じる" : `他の投稿された写真をみる（${g.photos.length}枚）`}
                      </button>
                    )}
                    {isStripOpen && (
                      <div className="gallery-photo-strip">
                        {g.photos.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            className={`gallery-photo-option${currentSrc === src ? " selected" : ""}`}
                            onClick={() => handlePhotoSelect(g, src)}
                            alt={`写真 ${i + 1}`}
                            loading="lazy"
                            decoding="async"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          </>
        )}
      </div>

      {/* ライトボックス */}
      {lightbox && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <button className="gallery-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img
            src={lightbox}
            className="gallery-lightbox-img"
            onClick={e => e.stopPropagation()}
            alt="拡大表示"
          />
        </div>
      )}
    </main>
  );
}
