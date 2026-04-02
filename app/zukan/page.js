"use client";

import Link from "next/link";
import { useState } from "react";
import { species } from "./data";

export default function ZukanPage() {
  const [sort, setSort] = useState("name-asc");
  const [query, setQuery] = useState("");

  const filtered = query
    ? species.filter((s) =>
        s.name.includes(query) || s.scientific.toLowerCase().includes(query.toLowerCase())
      )
    : species;

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name, "ja");
    if (sort === "name-desc") return b.name.localeCompare(a.name, "ja");
    if (sort === "sci-asc") return a.scientific.localeCompare(b.scientific);
    if (sort === "sci-desc") return b.scientific.localeCompare(a.scientific);
    return 0;
  });

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>図鑑</h1>
          <p className="subtitle">登録品種 {species.length}種</p>
        </header>

        <input
          className="zukan-search"
          type="text"
          placeholder="品種名・学名で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="sort-bar">
          <button className={`sort-btn${sort === "name-asc" ? " active" : ""}`} onClick={() => setSort("name-asc")}>和名 ↑</button>
          <button className={`sort-btn${sort === "name-desc" ? " active" : ""}`} onClick={() => setSort("name-desc")}>和名 ↓</button>
          <button className={`sort-btn${sort === "sci-asc" ? " active" : ""}`} onClick={() => setSort("sci-asc")}>学名 ↑</button>
          <button className={`sort-btn${sort === "sci-desc" ? " active" : ""}`} onClick={() => setSort("sci-desc")}>学名 ↓</button>
        </div>

        <div className="zukan-grid">
          {sorted.map((s) => (
            <Link key={s.id} href={`/zukan/${s.id}`} className="zukan-card" style={{ "--accent": s.accent }}>
              <div className="zukan-card-accent" />
              <div className="zukan-card-body">
                <span className="zukan-type-badge">{s.type}</span>
                <div className="zukan-name">{s.name}</div>
                <div className="zukan-scientific">{s.scientific}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
