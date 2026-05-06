"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { columns } from "./data";

const CATEGORY_CLASS = {
  "育て方": "column-card-category--ikate",
  "豆知識": "column-card-category--mame",
  "品種紹介": "column-card-category--hinshu",
  "楽しみ方": "column-card-category--tanoshimi",
  "品種図鑑": "column-card-category--zukan",
};

const CATEGORY_ORDER = ["育て方", "品種紹介", "豆知識", "楽しみ方", "品種図鑑"];
const PINNED = { "育て方": "hajimete-no-haworthia" };

function sortByPin(items, cat) {
  const pinned = PINNED[cat];
  if (!pinned) return items;
  return [...items.filter((c) => c.slug === pinned), ...items.filter((c) => c.slug !== pinned)];
}

function ColumnCard({ col, featured }) {
  return (
    <Link href={`/column/${col.slug}`} className={`column-card${featured ? " column-card--featured" : ""}`}>
      <div className={`column-card-category ${CATEGORY_CLASS[col.category] || ""}`}>{col.category}</div>
      <div className="column-card-title">{col.title}</div>
      <div className="column-card-lead">{col.lead}</div>
      <div className="column-card-date">{col.date.replace(/-/g, ".")}</div>
    </Link>
  );
}

function CategoryCell({ cat, items }) {
  const [idx, setIdx] = useState(0);
  const col = items[idx];

  return (
    <div className="column-cell">
      <div className="column-section-header">
        <div className={`column-card-category ${CATEGORY_CLASS[cat] || ""}`} style={{ marginBottom: 0 }}>{cat}</div>
        <Link href={`/column?cat=${encodeURIComponent(cat)}`} className="column-section-more">一覧 →</Link>
      </div>

      <Link href={`/column/${col.slug}`} className="column-hcard">
        <div className="column-hcard-title">{col.title}</div>
        <div className="column-hcard-date">{col.date.replace(/-/g, ".")}</div>
      </Link>

      {items.length > 1 && (
        <div className="column-cell-nav">
          <button
            className="column-cell-nav-btn"
            onClick={(e) => { e.preventDefault(); setIdx((idx - 1 + items.length) % items.length); }}
          >←</button>
          <span className="column-cell-nav-count">{idx + 1} / {items.length}</span>
          <button
            className="column-cell-nav-btn"
            onClick={(e) => { e.preventDefault(); setIdx((idx + 1) % items.length); }}
          >→</button>
        </div>
      )}
    </div>
  );
}

function ColumnPageInner() {
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat");

  if (activeCat) {
    const items = columns.filter((c) => c.category === activeCat);
    const sorted = sortByPin(items, activeCat);
    return (
      <div>
        <Link href="/column" className="column-back-link">← コラム一覧に戻る</Link>
        <div className="column-section-label" style={{ marginBottom: "1rem" }}>{activeCat}</div>
        <div className="column-list">
          {sorted.map((col) => <ColumnCard key={col.slug} col={col} />)}
        </div>
      </div>
    );
  }

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = columns.filter((c) => c.category === cat);
    if (items.length > 0) acc[cat] = sortByPin(items, cat);
    return acc;
  }, {});

  const [featuredEntry, ...restEntries] = Object.entries(grouped);

  return (
    <div>
      {featuredEntry && (
        <div className="column-section">
          <div className="column-section-header">
            <div className="column-section-label">{featuredEntry[0]}</div>
            {featuredEntry[1].length > 1 && (
              <Link href={`/column?cat=${encodeURIComponent(featuredEntry[0])}`} className="column-section-more">
                一覧を見る（{featuredEntry[1].length}件）→
              </Link>
            )}
          </div>
          <ColumnCard col={featuredEntry[1][0]} featured />
        </div>
      )}

      {restEntries.length > 0 && (
        <div className="column-sub-grid">
          {restEntries.map(([cat, items]) => (
            <CategoryCell key={cat} cat={cat} items={items} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ColumnPage() {
  return (
    <main>
      <div className="container">
        <div className="home-hero">
          <div className="home-hero-bg" style={{ backgroundImage: "url('/images/column-hero.webp')", opacity: 0.35 }} />
          <Link href="/" className="back-link" style={{ color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.8)", fontWeight: "700", background: "rgba(0,0,0,0.25)", padding: "2px 10px", borderRadius: "20px" }}>← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>コラム</h1>
          <p className="subtitle">ハオルチアのある暮らし</p>
        </div>
        <Suspense>
          <ColumnPageInner />
        </Suspense>
      </div>
    </main>
  );
}
