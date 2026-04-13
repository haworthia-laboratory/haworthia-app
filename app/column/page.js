"use client";

import Link from "next/link";
import { columns } from "./data";

const CATEGORIES = ["すべて", "育て方", "豆知識", "品種紹介", "楽しみ方"];

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

        <div className="column-list">
          {columns.map((col) => (
            <Link key={col.slug} href={`/column/${col.slug}`} className="column-card">
              <div className="column-card-category">{col.category}</div>
              <div className="column-card-title">{col.title}</div>
              <div className="column-card-lead">{col.lead}</div>
              <div className="column-card-date">{col.date.replace(/-/g, ".")}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
