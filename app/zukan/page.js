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

const GROUP_FILTERS = [
  { id: "all",          label: "全系統" },
  { id: "オブツーサ系",    label: "オブツーサ系" },
  { id: "万象・玉扇系",   label: "万象・玉扇系" },
  { id: "クーペリー系",   label: "クーペリー系" },
  { id: "コンプトニアナ系", label: "コンプトニアナ系" },
  { id: "ボエルゲリー系",  label: "ボエルゲリー系" },
  { id: "軟葉系",        label: "軟葉系" },
  { id: "硬葉系",        label: "硬葉系" },
];

function getColorGroup(s) {
  return s.colorGroup || "green";
}

function DropdownFilter({ id, label, options, value, onChange, colorDot, openDropdown, setOpenDropdown }) {
  const selected = options.find(o => o.id === value);
  const isActive = value !== "all";
  const isOpen = openDropdown === id;
  const buttonLabel = isActive ? selected?.label : (label || selected?.label);
  return (
    <div className="fd-wrap">
      <button
        className={`fd-btn${isActive ? " active" : ""}`}
        onMouseDown={e => { e.preventDefault(); setOpenDropdown(isOpen ? null : id); }}
      >
        {colorDot && isActive && <span className="filter-dot" style={{ background: selected?.dot }} />}
        {buttonLabel}
        <span className="fd-arrow">▾</span>
      </button>
      {isOpen && (
        <div className="fd-menu">
          {options.map(o => (
            <button
              key={o.id}
              className={`fd-item${value === o.id ? " active" : ""}`}
              onMouseDown={e => { e.preventDefault(); onChange(o.id); setOpenDropdown(null); }}
            >
              {o.dot && <span className="filter-dot" style={{ background: o.dot }} />}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ZukanPage() {
  const [sort, setSort] = useState("name-asc");
  const [query, setQuery] = useState("");
  const [colorFilter, setColorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [markFilter, setMarkFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [owned, setOwned] = useState(new Set());
  const [wishlist, setWishlist] = useState(new Set());
  const [fromPhoto, setFromPhoto] = useState(false);
  const [diaryPhotos, setDiaryPhotos] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const color = params.get("color");
    if (color) {
      setColorFilter(color);
      setFromPhoto(true);
    }

    // 戻ったときの状態復元
    try {
      const saved = sessionStorage.getItem("zukanState");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.sort) setSort(s.sort);
        if (s.query) setQuery(s.query);
        if (s.colorFilter && !color) setColorFilter(s.colorFilter);
        if (s.typeFilter) setTypeFilter(s.typeFilter);
        if (s.markFilter) setMarkFilter(s.markFilter);
        if (s.groupFilter) setGroupFilter(s.groupFilter);
        if (s.viewMode) setViewMode(s.viewMode);
        sessionStorage.removeItem("zukanState");
        // スクロール位置復元
        if (s.scrollY) setTimeout(() => window.scrollTo(0, s.scrollY), 100);
      }
    } catch {}


    const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(new Set(w));

    const loadAll = async () => {
      const localOwned = JSON.parse(localStorage.getItem("owned") || "[]");
      const thumbOverrides = JSON.parse(localStorage.getItem("plantThumbnails") || "{}");
      if (supabase) {
        const [{ data: plants }, { data: entries }] = await Promise.all([
          supabase.from("plants").select("id, species_id"),
          supabase.from("diary_entries").select("species_id, photos").not("species_id", "is", null),
        ]);
        const plantSpeciesIds = (plants || []).map(p => p.species_id).filter(Boolean);
        setOwned(new Set([...localOwned, ...plantSpeciesIds]));
        const photoMap = {};
        for (const e of (entries || [])) {
          if (e.species_id && e.photos?.length > 0 && !photoMap[e.species_id]) {
            photoMap[e.species_id] = e.photos[0];
          }
        }
        // ★で選んだ写真を優先
        for (const p of (plants || [])) {
          if (p.id && p.species_id && thumbOverrides[p.id]) {
            photoMap[p.species_id] = thumbOverrides[p.id];
          }
        }
        setDiaryPhotos(photoMap);
      } else {
        setOwned(new Set(localOwned));
        const allEntries = JSON.parse(localStorage.getItem("diary") || "[]");
        const allPlants = JSON.parse(localStorage.getItem("plants") || "[]");
        const photoMap = {};
        for (const e of allEntries) {
          if (e.species_id && e.photos?.length > 0 && !photoMap[e.species_id]) {
            photoMap[e.species_id] = e.photos[0];
          }
        }
        // ★で選んだ写真を優先
        for (const p of allPlants) {
          if (p.id && p.species_id && thumbOverrides[p.id]) {
            photoMap[p.species_id] = thumbOverrides[p.id];
          }
        }
        setDiaryPhotos(photoMap);
      }
    };
    loadAll();
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
    if (query) {
      const q = query.toLowerCase();
      const hit = s.name.includes(query)
        || s.scientific.toLowerCase().includes(q)
        || (s.yomi && s.yomi.includes(query))
        || (s.aliases || []).some(a => a.includes(query));
      if (!hit) return false;
    }
    if (colorFilter !== "all" && getColorGroup(s) !== colorFilter) return false;
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (groupFilter !== "all" && s.group !== groupFilter) return false;
    if (markFilter === "owned" && !owned.has(s.id)) return false;
    if (markFilter === "wishlist" && !wishlist.has(s.id)) return false;
    return true;
  });

  const displayName = (s) => s.aliases?.[0] || s.name;

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "name-asc") return displayName(a).localeCompare(displayName(b), "ja");
    if (sort === "name-desc") return displayName(b).localeCompare(displayName(a), "ja");
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
          <p className="subtitle">登録品種 {species.length} 種</p>
          <p className="zukan-legend"><span className="new-badge" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>NEW</span> 新しく追加した品種</p>
        </header>

        <input
          className="zukan-search"
          type="text"
          placeholder="品種名・学名で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {fromPhoto && (
          <div className="photo-filter-banner">
            <span>
              写真の色味：<strong>{COLOR_GROUPS.find(c => c.id === colorFilter)?.label}</strong> で絞り込み中
            </span>
            <button className="photo-filter-clear" onClick={() => { setColorFilter("all"); setFromPhoto(false); }}>✕ 解除</button>
          </div>
        )}

        <div className="filter-bar-compact">
          <DropdownFilter id="type" label="タイプ" options={TYPE_GROUPS} value={typeFilter} onChange={setTypeFilter} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
          <DropdownFilter id="group" label="系統" options={GROUP_FILTERS} value={groupFilter} onChange={setGroupFilter} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
          <DropdownFilter id="color" label="カラー" options={COLOR_GROUPS} value={colorFilter} onChange={setColorFilter} colorDot openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
          <span className="filter-sep" />
          <button
            className={`filter-btn${markFilter === "owned" ? " active" : ""}`}
            onClick={() => setMarkFilter(markFilter === "owned" ? "all" : "owned")}
          >✓ 持っている</button>
          <button
            className={`filter-btn${markFilter === "wishlist" ? " active" : ""}`}
            onClick={() => setMarkFilter(markFilter === "wishlist" ? "all" : "wishlist")}
          >☆ 欲しい</button>
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
              <Link key={s.id} href={`/zukan/${s.id}`} className="zukan-card" style={{ "--accent": s.accent }}
                onClick={() => {
                  try {
                    sessionStorage.setItem("zukanState", JSON.stringify({
                      sort, query, colorFilter, typeFilter, markFilter, groupFilter, viewMode,
                      scrollY: window.scrollY,
                    }));
                  } catch {}
                }}
              >
                <div className="zukan-card-accent" />
                <div className="zukan-card-body">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <span className="zukan-type-badge" style={{ margin: 0 }}>{s.type}</span>
                    <span className="card-color-dot" style={{ background: COLOR_DOT_MAP[getColorGroup(s)] }} />
                    {s.isNew && <span className="new-badge">NEW</span>}
                  </div>
                  <div className="zukan-name">
                    {s.aliases?.[0] ?? s.name}
                    {s.aliases?.[0] && (
                      <span className="zukan-alias">（{s.name}）</span>
                    )}
                  </div>
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
              <Link key={s.id} href={`/zukan/${s.id}`} className="zukan-grid-card" style={{ "--accent": s.accent }}
                onClick={() => {
                  try {
                    sessionStorage.setItem("zukanState", JSON.stringify({
                      sort, query, colorFilter, typeFilter, markFilter, groupFilter, viewMode,
                      scrollY: window.scrollY,
                    }));
                  } catch {}
                }}
              >
                <div className="zukan-grid-img-wrap">
                  {(s.gallery && s.gallery[0]) || diaryPhotos[s.id] ? (
                    <img src={s.gallery?.[0] || diaryPhotos[s.id]} alt={s.name} className="zukan-grid-img" />
                  ) : (
                    <svg className="zukan-grid-placeholder" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="40" r="28" stroke="#5a8a5c" strokeWidth="2"/>
                      <ellipse cx="50" cy="75" rx="18" ry="8" stroke="#5a8a5c" strokeWidth="1.5"/>
                    </svg>
                  )}
                </div>
                <div className="zukan-grid-body">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div className="zukan-grid-name">
                      {s.aliases?.[0] ?? s.name}
                      {s.aliases?.[0] && (
                        <span className="zukan-alias">（{s.name}）</span>
                      )}
                    </div>
                    {s.isNew && <span className="new-badge">NEW</span>}
                  </div>
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
