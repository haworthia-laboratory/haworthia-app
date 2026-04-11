"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { species } from "../data";
import { shopLinks } from "../shop-links";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function SpeciesPage({ params }) {
  const s = species.find((sp) => sp.id === params.id);
  const sShopLinks = shopLinks[params.id] || [];
  const [userGallery, setUserGallery] = useState([]);

  useEffect(() => {
    const imgs = JSON.parse(localStorage.getItem(`gallery_${params.id}`) || "[]");

    const loadDiaryPhotos = async () => {
      let diaryPhotos = [];
      if (supabase) {
        const { data } = await supabase
          .from("diary_entries")
          .select("photos")
          .eq("species_id", params.id);
        diaryPhotos = (data || []).flatMap(e => e.photos || []);
      } else {
        const allEntries = JSON.parse(localStorage.getItem("diary") || "[]");
        diaryPhotos = allEntries
          .filter(e => e.species_id === params.id)
          .flatMap(e => e.photos || []);
      }
      setUserGallery([...imgs, ...diaryPhotos]);
    };
    loadDiaryPhotos();
  }, [params.id]);

  if (!s) notFound();

  const allGallery = [...(s.gallery || []).slice(1), ...userGallery];

  return (
    <main>
      <div className="container">
        <Link href="/zukan" className="back-link">← 図鑑に戻る</Link>

        <div className="detail-header" style={{ "--accent": s.accent }}>
          <div className="detail-accent-bar" />
          <div className="detail-title-wrap">
            <span className="zukan-type-badge">{s.type}</span>
            <h1 className="detail-name">{s.aliases?.[0] ?? s.name}</h1>
            {s.aliases?.[0] && <p className="detail-yomi">（{s.name}）</p>}
            {s.yomi && <p className="detail-yomi">（{s.yomi}）</p>}
            <p className="detail-scientific">{s.scientific}</p>
          </div>
          {s.gallery && s.gallery[0] && (
            <img src={s.gallery[0]} alt={s.name} className="detail-illustration" />
          )}
        </div>

        <div className="detail-card">
          <p className="detail-description">{s.description}</p>
        </div>

        <div className="detail-section-title">育て方</div>

        <div className="detail-card">
          <div className="care-row">
            <span className="care-label">水やり</span>
            <span className="care-value">{s.water}</span>
          </div>
          <div className="care-divider" />
          <div className="care-row">
            <span className="care-label">温度</span>
            <span className="care-value">{s.temperature}</span>
          </div>
          <div className="care-divider" />
          <div className="care-row">
            <span className="care-label">置き場所</span>
            <span className="care-value">{s.placement}</span>
          </div>
        </div>

        <div className="detail-section-title">おすすめ培養土</div>
        <div className="detail-card">
          <p className="care-value">{s.soil}</p>
        </div>

        <div className="detail-section-title">光量</div>
        <div className="detail-card">
          <div className="light-result-label" style={{ marginBottom: "0.5rem" }}>{s.light}</div>
          <div className="light-bar-axis">
            <span>明</span><span>暗</span>
          </div>
          <div className="light-bar-wrap">
            <div className="light-bar" style={{ width: `${s.lightBar}%` }} />
          </div>
          <div className="light-desc" style={{ marginTop: "0.4rem" }}>{s.lightDesc}</div>
        </div>

        <div className="detail-section-title">相場価格</div>
        <div className="detail-card">
          {s.price ? (
            <div className="price-table">
              <div className="price-row">
                <span className="price-label">{s.price.isNishiki ? "この品種（錦）" : "通常品"}</span>
                <span className="price-value">{s.price.normal}</span>
              </div>
              {!s.price.isNishiki && s.price.nishiki && (
                <>
                  <div className="price-divider" />
                  <div className="price-row">
                    <span className="price-label">錦（斑入り）</span>
                    <span className="price-value">{s.price.nishiki}</span>
                  </div>
                </>
              )}
              {s.price.noribana && (
                <>
                  <div className="price-divider" />
                  <div className="price-row">
                    <span className="price-label">糊斑</span>
                    <span className="price-value">{s.price.noribana}</span>
                  </div>
                </>
              )}
              {!s.price.isNishiki && !s.price.nishiki && (
                <>
                  <div className="price-divider" />
                  <div className="price-row">
                    <span className="price-label">錦（斑入り）</span>
                    <span className="price-value detail-empty">この品種には錦個体の流通がほとんどない</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="care-value detail-empty">価格情報なし</p>
          )}
          <p className="price-note">※ 相場はネット・オークション等の参考値。個体差・時期により大きく変動します。</p>
        </div>

        <div className="detail-section-title">ギャラリー</div>
        <div className="gallery-wrap">
          {allGallery.length > 0 ? (
            <div className="gallery-grid">
              {allGallery.map((src, i) => (
                <img key={i} src={src} alt={`${s.name} ${i + 1}`} className="gallery-img" />
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              <p>写真はまだありません</p>
            </div>
          )}
        </div>

        {sShopLinks.length > 0 && (
          <>
            <div className="detail-section-title">購入する</div>
            <div style={{ marginBottom: "1.5rem" }}>
              {sShopLinks.map((link, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: link.html }} style={{ marginBottom: "0.8rem" }} />
              ))}
            </div>
          </>
        )}

        <Link href="/diary" className="zukan-link" style={{ marginBottom: "0.6rem" }}>
          成長日記を記録する
        </Link>
        <Link href="/gallery" className="zukan-link" style={{ marginBottom: "2rem", background: "rgba(90,138,92,0.06)", color: "#5a8a5c" }}>
          みんなのギャラリーを見る
        </Link>

      </div>
    </main>
  );
}
