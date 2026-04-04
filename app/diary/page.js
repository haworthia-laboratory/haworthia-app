"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { species } from "../zukan/data";
import { supabase } from "../../lib/supabase";

function today() { return new Date().toISOString().slice(0, 10); }

const emptyEntryForm = () => ({ date: today(), plantId: "", note: "", photos: [] });
const emptyPlantForm = () => ({ name: "", speciesId: "", acquiredDate: today(), acquiredType: "purchase", memo: "", photos: [] });

const ACQUIRED_TYPES = [
  { id: "purchase", label: "購入" },
  { id: "divide", label: "株分け" },
  { id: "gift", label: "もらった" },
  { id: "seed", label: "実生" },
  { id: "other", label: "その他" },
];

export default function DiaryPage() {
  const [entries, setEntries] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 日記フォーム
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [entryForm, setEntryForm] = useState(emptyEntryForm());
  const fileInputRef = useRef(null);
  const plantFileInputRef = useRef(null);

  // 株フォーム
  const [showPlantForm, setShowPlantForm] = useState(false);
  const [editingPlantId, setEditingPlantId] = useState(null);
  const [plantForm, setPlantForm] = useState(emptyPlantForm());
  const [plantSpeciesQuery, setPlantSpeciesQuery] = useState("");
  const [showPlantSpeciesList, setShowPlantSpeciesList] = useState(false);
  const plantSpeciesRef = useRef(null);

  // フィルター・ソート
  const [filterPlantId, setFilterPlantId] = useState(null);
  const [plantSort, setPlantSort] = useState("species");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    if (supabase) {
      const [{ data: e }, { data: p }] = await Promise.all([
        supabase.from("diary_entries").select("*").order("date", { ascending: false }),
        supabase.from("plants").select("*").order("created_at", { ascending: true }),
      ]);
      setEntries(e || []);
      setPlants(p || []);
    } else {
      try { setEntries(JSON.parse(localStorage.getItem("diary") || "[]")); } catch { setEntries([]); }
      try { setPlants(JSON.parse(localStorage.getItem("plants") || "[]")); } catch { setPlants([]); }
    }
    setLoading(false);
  };

  // ---- 株 CRUD ----
  const openNewPlant = () => {
    setEditingPlantId(null);
    setPlantForm(emptyPlantForm());
    setPlantSpeciesQuery("");
    setShowPlantForm(true);
  };

  const openEditPlant = (plant) => {
    setEditingPlantId(plant.id);
    const sp = species.find(s => s.id === plant.species_id);
    setPlantForm({
      name: plant.name,
      speciesId: plant.species_id || "",
      acquiredDate: plant.acquired_date || today(),
      acquiredType: plant.acquired_type || "purchase",
      memo: plant.memo || "",
      photos: [],
    });
    setPlantSpeciesQuery(sp ? sp.name : "");
    setShowPlantForm(true);
  };

  const savePlant = async () => {
    const speciesObj = species.find(s => s.id === plantForm.speciesId);
    const defaultName = speciesObj ? speciesObj.name : "名前なし";
    const payload = {
      name: plantForm.name.trim() || defaultName,
      species_id: plantForm.speciesId || null,
      species_name: speciesObj ? speciesObj.name : null,
      acquired_date: plantForm.acquiredDate || null,
      acquired_type: plantForm.acquiredType || null,
      memo: plantForm.memo || null,
    };

    if (supabase) {
      if (editingPlantId) {
        await supabase.from("plants").update(payload).eq("id", editingPlantId);
      } else {
        const { data: newPlant } = await supabase.from("plants").insert(payload).select().single();
        if (newPlant && plantForm.photos.length > 0) {
          await supabase.from("diary_entries").insert({
            date: plantForm.acquiredDate || today(),
            plant_id: newPlant.id,
            plant_name: newPlant.name,
            species_id: newPlant.species_id,
            species_name: newPlant.species_name,
            note: "",
            photos: plantForm.photos,
          });
        }
      }
      await fetchAll();
    } else {
      const newId = Date.now().toString();
      let updatedPlants;
      if (editingPlantId) {
        updatedPlants = plants.map(p => p.id === editingPlantId ? { ...p, ...payload } : p);
      } else {
        updatedPlants = [...plants, { id: newId, created_at: new Date().toISOString(), ...payload }];
        if (plantForm.photos.length > 0) {
          const newEntry = {
            id: (Date.now() + 1).toString(),
            created_at: new Date().toISOString(),
            date: plantForm.acquiredDate || today(),
            plant_id: newId,
            plant_name: plantForm.name,
            species_id: payload.species_id,
            species_name: payload.species_name,
            note: "",
            photos: plantForm.photos,
          };
          const updatedEntries = [newEntry, ...entries];
          setEntries(updatedEntries);
          localStorage.setItem("diary", JSON.stringify(updatedEntries));
        }
      }
      setPlants(updatedPlants);
      localStorage.setItem("plants", JSON.stringify(updatedPlants));
    }
    setShowPlantForm(false);
    setEditingPlantId(null);
  };

  const handlePlantPhoto = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const maxSize = 800;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) { height = Math.round(height * maxSize / width); width = maxSize; }
            else { width = Math.round(width * maxSize / height); height = maxSize; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width; canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          setPlantForm(f => ({ ...f, photos: [...f.photos, canvas.toDataURL("image/jpeg", 0.8)] }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const deletePlant = async (id) => {
    if (supabase) {
      await supabase.from("plants").delete().eq("id", id);
    } else {
      const updated = plants.filter(p => p.id !== id);
      localStorage.setItem("plants", JSON.stringify(updated));
      setPlants(updated);
      return;
    }
    setPlants(prev => prev.filter(p => p.id !== id));
    if (filterPlantId === id) setFilterPlantId(null);
  };

  const filteredPlantSpecies = plantSpeciesQuery
    ? species.filter(s =>
        s.name.includes(plantSpeciesQuery) ||
        s.scientific.toLowerCase().includes(plantSpeciesQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  // ---- 日記 CRUD ----
  const openNewEntry = (plantId = null) => {
    setEditingEntryId(null);
    setEntryForm({ ...emptyEntryForm(), plantId: plantId || "" });
    setShowEntryForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditEntry = (entry) => {
    setEditingEntryId(entry.id);
    setEntryForm({
      date: entry.date,
      plantId: entry.plant_id || "",
      note: entry.note || "",
      photos: entry.photos || [],
    });
    setShowEntryForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEntry = () => {
    setShowEntryForm(false);
    setEditingEntryId(null);
    setEntryForm(emptyEntryForm());
  };

  const handlePhoto = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const maxSize = 800;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) { height = Math.round(height * maxSize / width); width = maxSize; }
            else { width = Math.round(width * maxSize / height); height = maxSize; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width; canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          setEntryForm(f => ({ ...f, photos: [...f.photos, canvas.toDataURL("image/jpeg", 0.8)] }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (index) => {
    setEntryForm(f => ({ ...f, photos: f.photos.filter((_, i) => i !== index) }));
  };

  const saveEntry = async () => {
    if (!entryForm.note.trim() && entryForm.photos.length === 0) return;
    const plant = plants.find(p => p.id === entryForm.plantId);
    const payload = {
      date: entryForm.date,
      plant_id: entryForm.plantId || null,
      plant_name: plant ? plant.name : null,
      species_id: plant?.species_id || null,
      species_name: plant?.species_name || null,
      note: entryForm.note,
      photos: entryForm.photos,
    };

    if (supabase) {
      if (editingEntryId) {
        await supabase.from("diary_entries").update(payload).eq("id", editingEntryId);
      } else {
        await supabase.from("diary_entries").insert(payload);
      }
      await fetchAll();
    } else {
      let updated;
      if (editingEntryId) {
        updated = entries.map(e => e.id === editingEntryId ? { ...e, ...payload } : e);
      } else {
        updated = [{ id: Date.now().toString(), created_at: new Date().toISOString(), ...payload }, ...entries];
      }
      setEntries(updated);
      localStorage.setItem("diary", JSON.stringify(updated));
    }
    cancelEntry();
  };

  const deleteEntry = async (id) => {
    if (supabase) {
      await supabase.from("diary_entries").delete().eq("id", id);
    } else {
      const updated = entries.filter(e => e.id !== id);
      localStorage.setItem("diary", JSON.stringify(updated));
    }
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  // ---- derived ----
  const sortedPlants = [...plants].sort((a, b) => {
    if (plantSort === "acquired") {
      const dateA = a.acquired_date || "9999";
      const dateB = b.acquired_date || "9999";
      return dateA.localeCompare(dateB);
    }
    const nameA = a.species_name || "zzz";
    const nameB = b.species_name || "zzz";
    if (nameA !== nameB) return nameA.localeCompare(nameB, "ja");
    return (a.name || "").localeCompare(b.name || "", "ja");
  });

  const selectedPlant = filterPlantId ? plants.find(p => p.id === filterPlantId) : null;
  const visibleEntries = filterPlantId
    ? entries.filter(e => e.plant_id === filterPlantId)
    : entries;

  const lastDateByPlant = {};
  const thumbByPlant = {};
  entries.forEach(e => {
    if (!e.plant_id) return;
    if (!lastDateByPlant[e.plant_id] || e.date > lastDateByPlant[e.plant_id]) {
      lastDateByPlant[e.plant_id] = e.date;
    }
  });
  [...entries].reverse().forEach(e => {
    if (e.plant_id && e.photos?.length > 0 && !thumbByPlant[e.plant_id]) {
      thumbByPlant[e.plant_id] = e.photos[0];
    }
  });

  const acquiredTypeLabel = (type) => ACQUIRED_TYPES.find(t => t.id === type)?.label || "";

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>成長日記</h1>
          <p className="subtitle">{loading ? "読み込み中..." : `${entries.length}件の記録`}</p>
        </header>

        {/* はじめかたガイド */}
        {!loading && plants.length === 0 && !showPlantForm && (
          <div className="diary-guide">
            <div className="diary-guide-step">
              <span className="diary-guide-num">①</span>
              <div>
                <div className="diary-guide-label">株を登録する</div>
                <div className="diary-guide-desc">新しく入手した個体・株分けした株を登録</div>
              </div>
            </div>
            <div className="diary-guide-arrow">↓</div>
            <div className="diary-guide-step diary-guide-step--muted">
              <span className="diary-guide-num diary-guide-num--muted">②</span>
              <div>
                <div className="diary-guide-label diary-guide-label--muted">記録を追加する</div>
                <div className="diary-guide-desc">登録した株の成長・作業を記録</div>
              </div>
            </div>
          </div>
        )}

        {/* 株一覧 */}
        <div className="diary-section-title">
          登録株
          <div className="plant-sort-group">
            <button
              className={`plant-sort-btn${plantSort === "species" ? " active" : ""}`}
              onClick={() => setPlantSort("species")}
            >品種順</button>
            <button
              className={`plant-sort-btn${plantSort === "acquired" ? " active" : ""}`}
              onClick={() => setPlantSort("acquired")}
            >入手日順</button>
          </div>
        </div>

        {showPlantForm && (
          <div className="diary-form-card">
            <div className="diary-form-row">
              <label className="diary-form-label">株の名前</label>
              <input
                type="text"
                className="diary-date-input"
                placeholder="例：ノリピア1号、親株"
                value={plantForm.name}
                onChange={e => setPlantForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">品種</label>
              <div className="species-search-wrap">
                <input
                  ref={plantSpeciesRef}
                  type="text"
                  className="diary-date-input"
                  placeholder="品種名で検索..."
                  value={plantSpeciesQuery}
                  onChange={e => {
                    setPlantSpeciesQuery(e.target.value);
                    setPlantForm(f => ({ ...f, speciesId: "" }));
                    setShowPlantSpeciesList(true);
                  }}
                  onFocus={() => setShowPlantSpeciesList(true)}
                  onBlur={() => setTimeout(() => setShowPlantSpeciesList(false), 150)}
                />
                {plantForm.speciesId && (
                  <button className="species-clear-btn" onClick={() => {
                    setPlantForm(f => ({ ...f, speciesId: "" }));
                    setPlantSpeciesQuery("");
                    plantSpeciesRef.current?.focus();
                  }}>×</button>
                )}
                {showPlantSpeciesList && filteredPlantSpecies.length > 0 && (
                  <div className="species-dropdown">
                    {filteredPlantSpecies.map(s => (
                      <div key={s.id} className="species-dropdown-item"
                        onMouseDown={() => {
                          setPlantForm(f => ({ ...f, speciesId: s.id }));
                          setPlantSpeciesQuery(s.name);
                          setShowPlantSpeciesList(false);
                        }}
                      >
                        <span className="species-dropdown-name">{s.name}</span>
                        <span className="species-dropdown-sci">{s.scientific}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">入手・株分け日</label>
              <input
                type="date"
                className="diary-date-input"
                value={plantForm.acquiredDate}
                onChange={e => setPlantForm(f => ({ ...f, acquiredDate: e.target.value }))}
              />
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">入手方法</label>
              <div className="acquired-type-group">
                {ACQUIRED_TYPES.map(t => (
                  <button
                    key={t.id}
                    className={`acquired-type-btn${plantForm.acquiredType === t.id ? " active" : ""}`}
                    onClick={() => setPlantForm(f => ({ ...f, acquiredType: t.id }))}
                  >{t.label}</button>
                ))}
              </div>
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">メモ</label>
              <textarea
                className="diary-textarea"
                placeholder="購入場所、入手経緯など"
                value={plantForm.memo}
                onChange={e => setPlantForm(f => ({ ...f, memo: e.target.value }))}
              />
            </div>
            {!editingPlantId && (
              <div className="diary-form-row">
                <label className="diary-form-label">写真（入手時）</label>
                <div>
                  <button className="diary-photo-btn" onClick={() => plantFileInputRef.current.click()}>
                    ＋ 写真を追加
                  </button>
                  <input ref={plantFileInputRef} type="file" accept="image/*" multiple onChange={handlePlantPhoto} style={{ display: "none" }} />
                  {plantForm.photos.length > 0 && (
                    <div className="diary-photo-grid">
                      {plantForm.photos.map((src, i) => (
                        <div key={i} className="diary-photo-thumb-wrap">
                          <img src={src} alt={`preview ${i}`} className="diary-photo-thumb" />
                          <button className="diary-photo-remove" onClick={() => setPlantForm(f => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }))}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button className="diary-save-btn" style={{ flex: 1 }} onClick={savePlant}>
                {editingPlantId ? "変更を保存" : "登録する"}
              </button>
              <button className="diary-cancel-btn" onClick={() => { setShowPlantForm(false); setEditingPlantId(null); }}>
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* 編集中の株への記録追加 */}
        {editingPlantId && !showEntryForm && (
          <button
            className="diary-add-record-inline"
            onClick={() => {
              openNewEntry(editingPlantId);
              setShowPlantForm(false);
              setEditingPlantId(null);
            }}
          >
            ＋ この株の記録を追加
          </button>
        )}

        <div className="diary-individual-list">
          {sortedPlants.map(plant => (
            <div
              key={plant.id}
              className={`diary-individual-card${filterPlantId === plant.id ? " selected" : ""}`}
              onClick={() => setFilterPlantId(filterPlantId === plant.id ? null : plant.id)}
            >
              <div className="diary-individual-thumb">
                {thumbByPlant[plant.id]
                  ? <img src={thumbByPlant[plant.id]} alt={plant.name} />
                  : <span className="diary-individual-placeholder">🌿</span>
                }
              </div>
              <div className="diary-individual-info">
                <div className="diary-individual-name">{plant.name}</div>
                {plant.species_name && <div className="diary-individual-species">{plant.species_name}</div>}
                <div className="diary-individual-last">
                  {plant.acquired_date && `${acquiredTypeLabel(plant.acquired_type)} ${plant.acquired_date.replace(/-/g, ".")}`}
                  {lastDateByPlant[plant.id] && ` · 最終記録 ${lastDateByPlant[plant.id].replace(/-/g, ".")}`}
                </div>
              </div>
              <div className="diary-individual-actions" onClick={e => e.stopPropagation()}>
                <button className="diary-edit-btn" onClick={() => openEditPlant(plant)}>編集</button>
                <button className="diary-delete-btn" onClick={() => deletePlant(plant.id)}>×</button>
              </div>
            </div>
          ))}
          {!showPlantForm && (
            <button className="diary-add-individual-btn" onClick={openNewPlant}>＋ 株を登録</button>
          )}
        </div>

        {/* 記録一覧 */}
        <div className="diary-section-title" style={{ marginTop: "1.8rem" }}>
          {selectedPlant ? `${selectedPlant.name} の記録` : "すべての記録"}
          {filterPlantId && (
            <button className="diary-clear-filter" onClick={() => setFilterPlantId(null)}>× 全表示</button>
          )}
        </div>

        <button className="identify-btn" onClick={showEntryForm ? cancelEntry : () => openNewEntry(filterPlantId)}>
          {showEntryForm ? "キャンセル" : "＋ 記録を追加"}
        </button>

        {showEntryForm && (
          <div className="diary-form-card">
            <div className="diary-form-row">
              <label className="diary-form-label">日付</label>
              <input
                type="date"
                className="diary-date-input"
                value={entryForm.date}
                onChange={e => setEntryForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">株</label>
              <select
                className="diary-select"
                value={entryForm.plantId}
                onChange={e => setEntryForm(f => ({ ...f, plantId: e.target.value }))}
              >
                <option value="">選択しない</option>
                {plants.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.species_name ? `（${p.species_name}）` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">写真</label>
              <div>
                <button className="diary-photo-btn" onClick={() => fileInputRef.current.click()}>
                  ＋ 写真を追加
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhoto} style={{ display: "none" }} />
                {entryForm.photos.length > 0 && (
                  <div className="diary-photo-grid">
                    {entryForm.photos.map((src, i) => (
                      <div key={i} className="diary-photo-thumb-wrap">
                        <img src={src} alt={`preview ${i}`} className="diary-photo-thumb" />
                        <button className="diary-photo-remove" onClick={() => removePhoto(i)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">メモ</label>
              <textarea
                className="diary-textarea"
                placeholder="今日の様子、気づいたこと..."
                value={entryForm.note}
                onChange={e => setEntryForm(f => ({ ...f, note: e.target.value }))}
              />
            </div>
            <button className="diary-save-btn" onClick={saveEntry}>
              {editingEntryId ? "変更を保存" : "保存する"}
            </button>
          </div>
        )}

        {/* 光量マップ */}
        {plants.length > 0 && (() => {
          const plantsWithLight = plants
            .map(p => ({ ...p, lightBar: species.find(s => s.id === p.species_id)?.lightBar }))
            .filter(p => p.lightBar != null)
            .sort((a, b) => b.lightBar - a.lightBar);

          if (plantsWithLight.length === 0) return null;

          return (
            <div style={{ marginTop: "2rem", marginBottom: "1.4rem" }}>
              <div className="diary-section-title">光量マップ</div>
              <div className="light-map-card">
                <div className="light-map-axis" style={{ marginBottom: "0.8rem" }}>
                  <span>☀️ 明るい</span><span>🌿 暗め</span>
                </div>
                <div className="light-map-rows">
                  {plantsWithLight.map(p => (
                    <div key={p.id} className="light-map-row">
                      <div className="light-map-label" style={{ width: "110px", flexShrink: 0 }}>
                        <div className="light-map-plant-name">{p.name}</div>
                        {p.species_name && p.species_name !== p.name && (
                          <div className="light-map-species-name">{p.species_name}</div>
                        )}
                      </div>
                      <div className="light-map-row-bar">
                        <div className="light-map-row-dot" style={{ left: `${p.lightBar}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="light-map-zones">
                  <div className="light-map-zone" style={{ width: "40%" }}>直射日光・窓際最前列</div>
                  <div className="light-map-zone" style={{ width: "30%" }}>明るい日陰・前列</div>
                  <div className="light-map-zone" style={{ width: "30%" }}>半日陰・後列</div>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="diary-list">
          {!loading && visibleEntries.length === 0 && (
            <div className="gallery-empty"><p>まだ記録がありません</p></div>
          )}
          {visibleEntries.map(entry => (
            <div key={entry.id} className="diary-entry-card">
              <div className="diary-entry-header">
                <div>
                  <div className="diary-entry-date">{entry.date.replace(/-/g, ".")}</div>
                  {entry.plant_name && (
                    <div className="diary-entry-individual">{entry.plant_name}</div>
                  )}
                  {entry.species_name && (
                    <Link href={`/zukan/${entry.species_id}`} className="diary-entry-species">
                      {entry.species_name}
                    </Link>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <button className="diary-edit-btn" onClick={() => openEditEntry(entry)}>編集</button>
                  <button className="diary-delete-btn" onClick={() => deleteEntry(entry.id)}>×</button>
                </div>
              </div>
              {entry.photos && entry.photos.length > 0 && (
                entry.photos.length === 1
                  ? <img src={entry.photos[0]} alt="記録写真" className="diary-entry-photo" />
                  : <div className="diary-entry-photo-grid">
                      {entry.photos.map((src, i) => (
                        <img key={i} src={src} alt={`記録写真 ${i + 1}`} className="diary-entry-photo-thumb" />
                      ))}
                    </div>
              )}
              {entry.note && <p className="diary-entry-note">{entry.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
