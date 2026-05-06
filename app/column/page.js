"use client";

import Link from "next/link";
import { columns } from "./data";

const CATEGORY_CLASS = {
  "育て方": "column-card-category--ikate",
  "豆知識": "column-card-category--mame",
  "品種紹介": "column-card-category--hinshu",
  "楽しみ方": "column-card-category--tanoshimi",
  "品種図鑑": "column-card-category--zukan",
};

const CATEGORY_ORDER = ["育て方", "豆知識", "品種紹介", "楽しみ方", "品種図鑑"];

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

export default function ColumnPage() {
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = columns.filter((c) => c.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const [featured, ...rest] = Object.entries(grouped);

  return (
    <main>
      <div className="container">
        <div className="home-hero">
          <div className="home-hero-bg" style={{ backgroundImage: "url('/images/column-hero.webp')", opacity: 0.35 }} />
          <Link href="/" className="back-link" style={{ color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.8)", fontWeight: "700", background: "rgba(0,0,0,0.25)", padding: "2px 10px", borderRadius: "20px" }}>← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>コラム</h1>
          <p className="subtitle">ハオルチアのある暮らし</p>
        </div>

        {/* 育て方：フル幅 */}
        {featured && (
          <div className="column-section column-section--featured">
            <div className="column-section-label" style={{ color: "#4a8a4c" }}>{featured[0]}</div>
            <div className="column-list">
              {featured[1].map((col) => <ColumnCard key={col.slug} col={col} />)}
            </div>
          </div>
        )}

        {/* その他：2列グリッド */}
        <div className="column-sub-grid">
          {rest.map(([cat, items]) => (
            <div key={cat} className="column-section">
              <div className={`column-section-label ${CATEGORY_CLASS[cat] || ""}`} style={{ background: "none", padding: 0, fontSize: "0.75rem" }}>{cat}</div>
              <div className="column-list">
                {items.map((col) => <ColumnCard key={col.slug} col={col} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
