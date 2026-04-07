"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (supabase) {
        // 公開株の最新写真を取得
        const { data: plants } = await supabase
          .from("plants")
          .select("id, name, species_name")
          .eq("is_public", true);

        if (!plants || plants.length === 0) {
          setLoading(false);
          return;
        }

        const plantIds = plants.map(p => p.id);
        const { data: entries } = await supabase
          .from("diary_entries")
          .select("plant_id, date, photos, note")
          .in("plant_id", plantIds)
          .order("date", { ascending: false });

        const flat = [];
        const seen = new Set();
        for (const entry of (entries || [])) {
          for (const src of (entry.photos || [])) {
            if (!seen.has(src)) {
              seen.add(src);
              const plant = plants.find(p => p.id === entry.plant_id);
              flat.push({
                src,
                date: entry.date,
                plantName: plant?.name,
                speciesName: plant?.species_name,
                note: entry.note,
              });
            }
          }
        }
        setPhotos(flat);
      }
      setLoading(false);
    };
    load();
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
