"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { species } from "../zukan/data";
import { supabase } from "../../lib/supabase";

function today() { return new Date().toISOString().slice(0, 10); }

const emptyEntryForm = () => ({ date: today(), plantId: "", note: "", photos: [] });
const emptyPlantForm = () => ({ name: "", speciesIds: [], acquiredDate: today(), acquiredType: "purchase", memo: "", photos: [] });

const ACQUIRED_TYPES = [
  { id: "purchase", label: "購入" },
  { id: "divide", label: "株分け" },
  { id: "gift", label: "もらった" },
  { id: "seed", label: "実生" },
  { id: "other", label: "その他" },
];

export default function DiaryPage() {
  const router = useRouter();
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
  const [viewMode, setViewMode] = useState("list");
  const [openPhotoSelect, setOpenPhotoSelect] = useState(null);

  // サムネイル上書き
  const [thumbOverrides, setThumbOverrides] = useState({});

  // エラー
  const [entryError, setEntryError] = useState("");
  const [plantError, setPlantError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, label }
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      setThumbOverrides(JSON.parse(localStorage.getItem("plantThumbnails") || "{}"));
    } catch { setThumbOverrides({}); }

    const init = async () => {
      if (supabase) {
        // セッション確認と株データを並列取得→先に表示
        const [{ data: { session } }, { data: p }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.from("plants").select("*").order("created_at", { ascending: true }),
        ]);
        if (!session) { router.push("/login"); return; }
        setUserId(session.user.id);
        setPlants(p || []);
        setLoading(false);
        // 写真は後からバックグラウンドで取得（サムネイル用に1枚目だけ）
        supabase
          .from("diary_entries")
          .select("id, date, plant_id, photos")
          .order("date", { ascending: false })
          .then(({ data: e }) => {
            setEntries((e || []).map(entry => ({
              ...entry,
              photos: entry.photos?.slice(0, 1) || [],
            })));
          });
      } else {
        try { setEntries(JSON.parse(localStorage.getItem("diary") || "[]")); } catch { setEntries([]); }
        try { setPlants(JSON.parse(localStorage.getItem("plants") || "[]")); } catch { setPlants([]); }
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchAll = async () => {
    if (supabase) {
      const [{ data: e }, { data: p }] = await Promise.all([
        supabase.from("diary_entries").select("id, date, plant_id, photos").order("date", { ascending: false }),
        supabase.from("plants").select("*").order("created_at", { ascending: true }),
      ]);
      setEntries((e || []).map(entry => ({ ...entry, photos: entry.photos?.slice(0, 1) || [] })));
      setPlants(p || []);
    } else {
      try { setEntries(JSON.parse(localStorage.getItem("diary") || "[]")); } catch { setEntries([]); }
      try { setPlants(JSON.parse(localStorage.getItem("plants") || "[]")); } catch { setPlants([]); }
    }
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
    const ids = plant.species_ids || (plant.species_id ? [plant.species_id] : []);
    setPlantForm({
      name: plant.name,
      speciesIds: ids,
      acquiredDate: plant.acquired_date || today(),
      acquiredType: plant.acquired_type || "purchase",
      memo: plant.memo || "",
      photos: [],
    });
    setShowPlantForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const savePlant = async () => {
    setPlantError("");
    const selectedSpecies = plantForm.speciesIds.map(id => species.find(s => s.id === id)).filter(Boolean);
    const defaultName = selectedSpecies.length > 0
      ? selectedSpecies.map(s => s.name).join(" × ")
      : "名前なし";
    const payload = {
      name: plantForm.name.trim() || defaultName,
      species_id: plantForm.speciesIds[0] || null,
      species_name: selectedSpecies.length > 0 ? selectedSpecies.map(s => s.name).join(" × ") : null,
      species_ids: plantForm.speciesIds,
      species_names: selectedSpecies.map(s => s.name),
      acquired_date: plantForm.acquiredDate || null,
      acquired_type: plantForm.acquiredType || null,
      memo: plantForm.memo || null,
    };

    if (supabase) {
      if (editingPlantId) {
        const { error } = await supabase.from("plants").update(payload).eq("id", editingPlantId);
        if (error) { setPlantError(`保存に失敗しました：${error.message}`); return; }
      } else {
        const { data: newPlant, error: plantErr } = await supabase.from("plants").insert({ ...payload, user_id: userId }).select().single();
        if (plantErr) { setPlantError(`登録に失敗しました：${plantErr.message}`); return; }
        if (newPlant && plantForm.photos.length > 0) {
          const { error: entryErr } = await supabase.from("diary_entries").insert({
            date: plantForm.acquiredDate || today(),
            plant_id: newPlant.id,
            plant_name: newPlant.name,
            species_id: newPlant.species_id,
            species_name: newPlant.species_name,
            note: "",
            photos: plantForm.photos,
            user_id: userId,
          });
          if (entryErr) { setPlantError("株は登録できましたが写真の保存に失敗しました。写真のサイズが大きすぎる可能性があります"); return; }
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

  const togglePlantPublic = async (e, plant) => {
    e.stopPropagation();
    const next = !plant.is_public;
    if (supabase) {
      await supabase.from("plants").update({ is_public: next }).eq("id", plant.id);
    }
    setPlants(prev => prev.map(p => p.id === plant.id ? { ...p, is_public: next } : p));
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
    setEntryError("");
    if (!entryForm.note.trim() && entryForm.photos.length === 0) {
      setEntryError("メモか写真のどちらかを入力してください");
      return;
    }
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
      if (!editingEntryId) {
        const { data: { session: s } } = await supabase.auth.getSession();
        payload.user_id = s?.user?.id || userId;
      }
      const { error } = editingEntryId
        ? await supabase.from("diary_entries").update(payload).eq("id", editingEntryId)
        : await supabase.from("diary_entries").insert(payload);
      if (error) {
        if (error.message?.includes("too large") || error.code === "54000") {
          setEntryError("写真のサイズが大きすぎます。枚数を減らすか、1枚ずつ試してみてください");
        } else {
          setEntryError(`保存に失敗しました：${error.message}`);
        }
        return;
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

  const setThumbnail = (plantId, photoSrc) => {
    const next = { ...thumbOverrides, [plantId]: photoSrc };
    setThumbOverrides(next);
    localStorage.setItem("plantThumbnails", JSON.stringify(next));
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
  // ユーザーが選んだサムネイルで上書き
  Object.assign(thumbByPlant, thumbOverrides);

  const acquiredTypeLabel = (type) => ACQUIRED_TYPES.find(t => t.id === type)?.label || "";

  const photosByPlant = {};
  entries.forEach(e => {
    if (e.plant_id && e.photos?.length > 0) {
      if (!photosByPlant[e.plant_id]) photosByPlant[e.plant_id] = [];
      photosByPlant[e.plant_id].push(...e.photos);
    }
  });

  return (
    <main>
      {deleteConfirm && (
        <div className="confirm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-sheet" onClick={e => e.stopPropagation()}>
            <p className="confirm-msg">「{deleteConfirm.label}」を削除しますか？</p>
            <p className="confirm-sub">記録ごとすべて削除されます。この操作は取り消せません</p>
            <div className="confirm-btns">
              <button className="confirm-cancel" onClick={() => setDeleteConfirm(null)}>キャンセル</button>
              <button className="confirm-ok" onClick={() => { deletePlant(deleteConfirm.id); setDeleteConfirm(null); }}>削除する</button>
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <div className="home-hero" style={{ marginTop: "0.8rem" }}>
            <div className="home-hero-bg" />
            <h1>成長日記</h1>
            <p className="subtitle">{loading ? "読み込み中..." : `${plants.length}株 · ${entries.length}件の記録`}</p>
          </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
            <button className={`view-btn${viewMode === "list" ? " active" : ""}`} onClick={() => setViewMode("list")}>☰</button>
            <button className={`view-btn${viewMode === "grid" ? " active" : ""}`} onClick={() => setViewMode("grid")}>⊞</button>
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
              <label className="diary-form-label">品種（複数可）</label>
              {plantForm.speciesIds.length > 0 && (
                <div className="species-tags">
                  {plantForm.speciesIds.map((id, i) => {
                    const sp = species.find(s => s.id === id);
                    return (
                      <div key={id} className="species-tag">
                        {i > 0 && <span className="species-tag-cross">×</span>}
                        <span>{sp ? sp.name : id}</span>
                        <button className="species-tag-remove" onClick={() =>
                          setPlantForm(f => ({ ...f, speciesIds: f.speciesIds.filter((_, j) => j !== i) }))
                        }>×</button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="species-search-wrap">
                <input
                  ref={plantSpeciesRef}
                  type="text"
                  className="diary-date-input"
                  placeholder={plantForm.speciesIds.length === 0 ? "品種名で検索..." : "＋ 品種を追加..."}
                  value={plantSpeciesQuery}
                  onChange={e => {
                    setPlantSpeciesQuery(e.target.value);
                    setShowPlantSpeciesList(true);
                  }}
                  onFocus={() => setShowPlantSpeciesList(true)}
                  onBlur={() => setTimeout(() => setShowPlantSpeciesList(false), 150)}
                />
                {showPlantSpeciesList && filteredPlantSpecies.length > 0 && (
                  <div className="species-dropdown">
                    {filteredPlantSpecies
                      .filter(s => !plantForm.speciesIds.includes(s.id))
                      .map(s => (
                        <div key={s.id} className="species-dropdown-item"
                          onMouseDown={() => {
                            setPlantForm(f => ({ ...f, speciesIds: [...f.speciesIds, s.id] }));
                            setPlantSpeciesQuery("");
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
            {plantError && <div className="diary-error">{plantError}</div>}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button className="diary-save-btn" style={{ flex: 1, background: "linear-gradient(135deg, #a0a8a0, #b0b8b0)" }} onClick={savePlant}>
                {editingPlantId ? "変更を保存" : "登録する"}
              </button>
              <button className="diary-cancel-btn" onClick={() => { setShowPlantForm(false); setEditingPlantId(null); setPlantError(""); }}>
                キャンセル
              </button>
            </div>
            {editingPlantId && (
              <button
                className="diary-save-btn"
                style={{ marginTop: "0.6rem", background: "linear-gradient(135deg, #4a7a6c, #5a9a8c)" }}
                onClick={() => {
                  setShowPlantForm(false);
                  setEditingPlantId(null);
                  router.push(`/diary/${editingPlantId}`);
                }}
              >＋ この株の記録を追加</button>
            )}
          </div>
        )}


        {viewMode === "grid" ? (
          <div>
            {!showPlantForm && (
              <button className="diary-add-individual-btn" onClick={openNewPlant}>＋ 株を登録</button>
            )}
            <div className="diary-plant-grid">
              {sortedPlants.map(plant => (
                <div
                  key={plant.id}
                  className="diary-plant-grid-card"
                >
                  <div
                    className="diary-plant-grid-img-wrap"
                    onClick={() => { setOpenPhotoSelect(null); router.push(`/diary/${plant.id}`); }}
                    style={{ cursor: "pointer" }}
                  >
                    {thumbByPlant[plant.id]
                      ? <img src={thumbByPlant[plant.id]} alt={plant.name} className="diary-plant-grid-img" />
                      : <div className="diary-plant-grid-placeholder">🌿</div>
                    }
                  </div>
                  <div className="diary-plant-grid-body">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.3rem" }}>
                      <div className="diary-plant-grid-name" style={{ flex: 1 }}>{plant.name}</div>
                      {photosByPlant[plant.id]?.length > 1 && (
                        <button
                          className={`diary-grid-photo-toggle${openPhotoSelect === plant.id ? " open" : ""}`}
                          onClick={e => { e.stopPropagation(); setOpenPhotoSelect(openPhotoSelect === plant.id ? null : plant.id); }}
                          title="表示する写真を選ぶ"
                        >⊞</button>
                      )}
                    </div>
                    {plant.species_name && plant.species_name !== plant.name && (
                      <div className="diary-plant-grid-species">{plant.species_name}</div>
                    )}
                    {openPhotoSelect === plant.id && (
                      <div className="diary-grid-photo-strip" onClick={e => e.stopPropagation()}>
                        {photosByPlant[plant.id].map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            className={`diary-grid-photo-option${thumbByPlant[plant.id] === src ? " selected" : ""}`}
                            onClick={() => { setThumbnail(plant.id, src); setOpenPhotoSelect(null); }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="diary-individual-list">
            {!showPlantForm && (
              <button className="diary-add-individual-btn" onClick={openNewPlant}>＋ 株を登録</button>
            )}
            {sortedPlants.map(plant => (
              <div
                key={plant.id}
                className="diary-individual-card"
                onClick={() => router.push(`/diary/${plant.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="diary-individual-thumb">
                  {thumbByPlant[plant.id]
                    ? <img src={thumbByPlant[plant.id]} alt={plant.name} />
                    : <span className="diary-individual-placeholder">🌿</span>
                  }
                </div>
                <div className="diary-individual-info">
                  <div className="diary-individual-name">{plant.name}</div>
                  {plant.species_name && (
                    plant.species_id
                      ? <Link href={`/zukan/${plant.species_id}`} className="diary-individual-species diary-species-link" onClick={e => e.stopPropagation()}>{plant.species_name} →</Link>
                      : <div className="diary-individual-species">{plant.species_name}</div>
                  )}
                  <div className="diary-individual-last">
                    {plant.acquired_date && `${acquiredTypeLabel(plant.acquired_type)} ${plant.acquired_date.replace(/-/g, ".")}`}
                    {lastDateByPlant[plant.id] && ` · 最終記録 ${lastDateByPlant[plant.id].replace(/-/g, ".")}`}
                  </div>
                </div>
                <div className="diary-individual-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className={`diary-public-btn${plant.is_public ? " active" : ""}`}
                    onClick={(e) => togglePlantPublic(e, plant)}
                    title={plant.is_public ? "公開中" : "公開する"}
                  >{plant.is_public ? "🌿" : "公開"}</button>
                  <button className="diary-edit-btn" onClick={() => openEditPlant(plant)}>編集</button>
                  <button className="diary-delete-btn" onClick={() => setDeleteConfirm({ id: plant.id, label: plant.name })}>×</button>
                </div>
              </div>
            ))}
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
            <div style={{ marginTop: "1.4rem", marginBottom: "0.5rem" }}>
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
      </div>
    </main>
  );
}
