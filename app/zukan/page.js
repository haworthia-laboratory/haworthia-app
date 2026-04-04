"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { species } from "./data";
import { supabase } from "../../lib/supabase";

const COLOR_GROUPS = [
  { id: "all", label: "すべて", dot: null },
  { id: "green", label: "グリーン", dot: "#7ab57c" },
  { id: "white", label: "ホワイト", dot: "#d8e8d8" },
  { id: "red", label: "レッド", dot: "#c87a7a" },
  { id: "purple", label: "パープル", dot: "#b87ab8" },
  { id: "blue", label: "ブルー", dot: "#7a9ab8" },
  { id: "gray", label: "グレー", dot: "#a8a8a8" },
  { id: "black", label: "ブラック", dot: "#4a4a4a" },
];

const COLOR_DOT_MAP = Object.fromEntries(COLOR_GROUPS.filter(c => c.dot).map(c => [c.id, c.dot]));

const TYPE_GROUPS = [
  { id: "all", label: "全タイプ" },
  { id: "原種", label: "原種" },
  { id: "園芸種", label: "園芸種" },
  { id: "交配種", label: "交配種" },
  { id: "選抜種", label: "選抜種" },
];

function getColorGroup(s) {
  const text = s.name + s.description;
  if (text.includes("黒") || text.includes("ブラック") || text.includes("黒紫") || text.includes("黒オブ")) return "black";
  if (text.includes("グレー") || text.includes("灰") || text.includes("シルバー") || text.includes("銀")) return "gray";
  if (text.includes("紫") || text.includes("パープル")) return "purple";
  if (text.includes("赤") || text.includes("紅") || text.includes("レッド") || text.includes("ピンク")) return "red";
  if (text.includes("白斑") || text.includes("白い斑") || text.includes("錦") || text.includes("乳白") || text.includes("白みがかった")) return "white";
  if (text.includes("青") || text.includes("ブルー") || text.includes("水色")) return "blue";
  return "green";
}

export default function ZukanPage() {
  const [sort, setSort] = useState("name-asc");
  const [query, setQuery] = useState("");
  const [colorFilter, setColorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [markFilter, setMarkFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [owned, setOwned] = useState(new Set());
  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(new Set(w));

    // 日記の登録株から持っている品種を取得
    const loadOwned = async () => {
      const localOwned = JSON.parse(localStorage.getItem("owned") || "[]");
      if (supabase) {
        const { data } = await supabase.from("plants").select("species_id");
        const plantSpeciesIds = (data || []).map(p => p.species_id).filter(Boolean);
        setOwned(new Set([...localOwned, ...plantSpeciesIds]));
      } else {
        setOwned(new Set(localOwned));
      }
    };
    loadOwned();
  }, []);

  const toggleOwned = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setOwned(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("owned", JSON.stringify([...next]));
      return next;
    });
  };

  const toggleWishlist = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("wishlist", JSON.stringify([...next]));
      return next;
    });
  };

  const filtered = species.filter((s) => {
    if (query && !s.name.includes(query) && !s.scientific.toLowerCase().includes(query.toLowerCase())) return false;
    if (colorFilter !== "all" && getColorGroup(s) !== colorFilter) return false;
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (markFilter === "owned" && !owned.has(s.id)) return false;
    if (markFilter === "wishlist" && !wishlist.has(s.id)) return false;
    return true;
  });

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

        <div className="filter-bar">
          {TYPE_GROUPS.map((t) => (
            <button
              key={t.id}
              className={`filter-btn${typeFilter === t.id ? " active" : ""}`}
              onClick={() => setTypeFilter(typeFilter === t.id && t.id !== "all" ? "all" : t.id)}
            >{t.label}</button>
          ))}
          <button
            className={`filter-btn${markFilter === "owned" ? " active" : ""}`}
            onClick={() => setMarkFilter(markFilter === "owned" ? "all" : "owned")}
          >✓ 持っている</button>
          <button
            className={`filter-btn${markFilter === "wishlist" ? " active" : ""}`}
            onClick={() => setMarkFilter(markFilter === "wishlist" ? "all" : "wishlist")}
          >☆ 欲しい</button>
        </div>

        <div className="filter-bar">
          {COLOR_GROUPS.map((c) => (
            <button
              key={c.id}
              className={`filter-btn${colorFilter === c.id ? " active" : ""}`}
              onClick={() => setColorFilter(colorFilter === c.id && c.id !== "all" ? "all" : c.id)}
            >
              {c.dot && <span className="filter-dot" style={{ background: c.dot }} />}
              {c.label}
            </button>
          ))}
        </div>

        <div className="sort-view-bar">
          <div className="sort-bar">
            <button
              className={`sort-btn${sort.startsWith("name") ? " active" : ""}`}
              onClick={() => setSort(sort === "name-asc" ? "name-desc" : "name-asc")}
            >
              和名 {sort === "name-asc" ? "↑" : sort === "name-desc" ? "↓" : ""}
            </button>
            <button
              className={`sort-btn${sort.startsWith("sci") ? " active" : ""}`}
              onClick={() => setSort(sort === "sci-asc" ? "sci-desc" : "sci-asc")}
            >
              学名 {sort === "sci-asc" ? "↑" : sort === "sci-desc" ? "↓" : ""}
            </button>
          </div>
          <button className={`view-btn${viewMode === "list" ? " active" : ""}`} onClick={() => setViewMode("list")}>☰</button>
          <button className={`view-btn${viewMode === "grid" ? " active" : ""}`} onClick={() => setViewMode("grid")}>⊞</button>
        </div>

        {viewMode === "list" ? (
          <div className="zukan-grid">
            {sorted.map((s) => (
              <Link key={s.id} href={`/zukan/${s.id}`} className="zukan-card" style={{ "--accent": s.accent }}>
                <div className="zukan-card-accent" />
                <div className="zukan-card-body">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <span className="zukan-type-badge" style={{ margin: 0 }}>{s.type}</span>
                    <span className="card-color-dot" style={{ background: COLOR_DOT_MAP[getColorGroup(s)] }} />
                  </div>
                  <div className="zukan-name">{s.name}</div>
                  <div className="zukan-scientific">{s.scientific}</div>
                </div>
                <div className="zukan-card-marks">
                  <button
                    className={`mark-btn${owned.has(s.id) ? " active-check" : ""}`}
                    onClick={(e) => toggleOwned(e, s.id)}
                    title="持っている"
                  >{owned.has(s.id) ? "☑" : "☐"}</button>
                  <button
                    className={`mark-btn mark-btn-star${wishlist.has(s.id) ? " active-star" : ""}`}
                    onClick={(e) => toggleWishlist(e, s.id)}
                    title="欲しい"
                  >☆</button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="zukan-grid-view">
            {sorted.map((s) => (
              <Link key={s.id} href={`/zukan/${s.id}`} className="zukan-grid-card" style={{ "--accent": s.accent }}>
                <div className="zukan-grid-img-wrap">
                  {s.gallery && s.gallery[0] ? (
                    <img src={s.gallery[0]} alt={s.name} className="zukan-grid-img" />
                  ) : (
                    <svg className="zukan-grid-placeholder" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="40" r="28" stroke="#5a8a5c" strokeWidth="2"/>
                      <ellipse cx="50" cy="75" rx="18" ry="8" stroke="#5a8a5c" strokeWidth="1.5"/>
                    </svg>
                  )}
                </div>
                <div className="zukan-grid-body">
                  <div className="zukan-grid-name">{s.name}</div>
                  <div className="zukan-grid-scientific">{s.scientific}</div>
                </div>
                <div className="zukan-grid-marks">
                  <button
                    className={`mark-btn${owned.has(s.id) ? " active-check" : ""}`}
                    onClick={(e) => toggleOwned(e, s.id)}
                    title="持っている"
                  >{owned.has(s.id) ? "☑" : "☐"}</button>
                  <button
                    className={`mark-btn mark-btn-star${wishlist.has(s.id) ? " active-star" : ""}`}
                    onClick={(e) => toggleWishlist(e, s.id)}
                    title="欲しい"
                  >☆</button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
