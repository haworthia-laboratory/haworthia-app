"use client";

import Link from "next/link";
import { columns } from "./data";

const CATEGORIES = ["すべて", "育て方", "豆知識", "品種紹介", "楽しみ方"];

export default function ColumnPage() {
  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>コラム</h1>
          <p className="subtitle">ハオルチアのある暮らし</p>
        </header>

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
