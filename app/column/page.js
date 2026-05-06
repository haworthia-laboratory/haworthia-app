"use client";

import Link from "next/link";
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

const CATEGORY_ORDER = ["育て方", "豆知識", "品種紹介", "楽しみ方", "品種図鑑"];
const PINNED = { "育て方": "hajimete-no-haworthia" };

function ColumnCard({ col }) {
  return (
    <Link href={`/column/${col.slug}`} className="column-card">
      <div className={`column-card-category ${CATEGORY_CLASS[col.category] || ""}`}>{col.category}</div>
      <div className="column-card-title">{col.title}</div>
      <div className="column-card-lead">{col.lead}</div>
      <div className="column-card-date">{col.date.replace(/-/g, ".")}</div>
    </Link>
  );
}

function ColumnPageInner() {
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat");

  if (activeCat) {
    const items = columns.filter((c) => c.category === activeCat);
    const pinned = PINNED[activeCat];
    const sorted = pinned
      ? [...items.filter((c) => c.slug === pinned), ...items.filter((c) => c.slug !== pinned)]
      : items;

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
    if (items.length === 0) return acc;
    const pinned = PINNED[cat];
    const sorted = pinned
      ? [...items.filter((c) => c.slug === pinned), ...items.filter((c) => c.slug !== pinned)]
      : items;
    acc[cat] = sorted;
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="column-section">
          <div className="column-section-header">
            <div className="column-section-label">{cat}</div>
            {items.length > 1 && (
              <Link href={`/column?cat=${encodeURIComponent(cat)}`} className="column-section-more">
                一覧を見る（{items.length}件）→
              </Link>
            )}
          </div>
          <ColumnCard col={items[0]} />
        </div>
      ))}
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
