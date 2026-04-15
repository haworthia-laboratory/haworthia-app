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
    const allIds = [params.id, ...(s?.mergedFrom || [])];
    const imgs = allIds.flatMap(id =>
      JSON.parse(localStorage.getItem(`gallery_${id}`) || "[]")
    );

    const loadDiaryPhotos = async () => {
      let diaryPhotos = [];
      if (supabase) {
        const { data } = await supabase
          .from("diary_entries")
          .select("photos")
          .in("species_id", allIds);
        diaryPhotos = (data || []).flatMap(e => e.photos || []);
      } else {
        const allEntries = JSON.parse(localStorage.getItem("diary") || "[]");
        diaryPhotos = allEntries
          .filter(e => allIds.includes(e.species_id))
          .flatMap(e => e.photos || []);
      }
      setUserGallery([...imgs, ...diaryPhotos]);
    };
    loadDiaryPhotos();
  }, [params.id]);

  if (!s) notFound();

  const allGallery = [...(s.gallery || []).slice(1), ...userGallery];

  // 似た品種：同じgroupから画像あり優先で最大4件
  const related = species
    .filter(sp => sp.id !== s.id && sp.group === s.group)
    .sort((a, b) => (b.gallery?.length || 0) - (a.gallery?.length || 0))
    .slice(0, 4);

  return (
    <main>
      <div className="container">
        <Link href="/zukan" className="back-link">← 図鑑に戻る</Link>

        <div className="detail-header" style={{ "--accent": s.accent }}>
          <div className="detail-accent-bar" />
          <div className="detail-title-wrap">
            <span className="zukan-type-badge">{s.type}</span>
            <h1 className="detail-name">{s.name}</h1>
            {s.yomi && <p className="detail-yomi">（{s.yomi}）</p>}
            {s.aliases?.length > 0 && <p className="detail-yomi">（別名：{s.aliases.join("/")}）</p>}
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
            <div className="shop-links-wrap" style={{ marginBottom: "1.5rem" }}>
              {sShopLinks.map((link, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: link.html }} style={{ marginBottom: "0.8rem" }} />
              ))}
            </div>
          </>
        )}

        {related.length > 0 && (
          <>
            <div className="detail-section-title">似た品種</div>
            <div className="related-species-grid">
              {related.map(sp => (
                <Link key={sp.id} href={`/zukan/${sp.id}`} className="related-species-card">
                  {sp.gallery?.[0]
                    ? <img src={sp.gallery[0]} alt={sp.name} className="related-species-img" />
                    : <div className="related-species-placeholder">🌿</div>
                  }
                  <div className="related-species-name">{sp.name}</div>
                  <div className="related-species-type">{sp.type}</div>
                </Link>
              ))}
            </div>
          </>
        )}

        <Link
          href={`/diary?addSpecies=${s.id}&speciesName=${encodeURIComponent(s.name)}`}
          className="zukan-link"
          style={{ marginBottom: "0.6rem", background: "linear-gradient(135deg, rgba(90,138,92,0.12), rgba(120,168,122,0.08))", fontWeight: "600" }}
        >
          ＋ この品種を日記に追加
        </Link>
        <Link href="/gallery" className="zukan-link" style={{ marginBottom: "2rem", background: "rgba(90,138,92,0.06)", color: "#5a8a5c" }}>
          みんなのギャラリーを見る
        </Link>

      </div>
    </main>
  );
}
