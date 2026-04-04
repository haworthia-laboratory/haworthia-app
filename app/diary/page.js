"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { species } from "../zukan/data";
import { supabase } from "../../lib/supabase";

function today() { return new Date().toISOString().slice(0, 10); }
const emptyForm = () => ({ date: today(), speciesId: "", note: "", photos: [] });

export default function DiaryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [showSpeciesList, setShowSpeciesList] = useState(false);
  const fileInputRef = useRef(null);
  const speciesInputRef = useRef(null);

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    setLoading(true);
    if (supabase) {
      const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .order("date", { ascending: false });
      if (!error) setEntries(data || []);
    } else {
      try { setEntries(JSON.parse(localStorage.getItem("diary") || "[]")); } catch { setEntries([]); }
    }
    setLoading(false);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setSpeciesQuery("");
    setShowForm(true);
  };

  const openEdit = (entry) => {
    setEditingId(entry.id);
    const sp = species.find(s => s.id === entry.species_id);
    setForm({
      date: entry.date,
      speciesId: entry.species_id || "",
      note: entry.note || "",
      photos: entry.photos || [],
    });
    setSpeciesQuery(sp ? sp.name : "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setSpeciesQuery("");
    setShowSpeciesList(false);
  };

  const filteredSpecies = speciesQuery
    ? species.filter(s =>
        s.name.includes(speciesQuery) ||
        s.scientific.toLowerCase().includes(speciesQuery.toLowerCase())
      ).slice(0, 8)
    : [];

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
          setForm(f => ({ ...f, photos: [...f.photos, canvas.toDataURL("image/jpeg", 0.8)] }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (index) => {
    setForm(f => ({ ...f, photos: f.photos.filter((_, i) => i !== index) }));
  };

  const save = async () => {
    if (!form.note.trim() && form.photos.length === 0) return;
    const speciesObj = species.find(s => s.id === form.speciesId);
    const payload = {
      date: form.date,
      species_id: form.speciesId || null,
      species_name: speciesObj ? speciesObj.name : null,
      note: form.note,
      photos: form.photos,
    };

    if (supabase) {
      if (editingId) {
        await supabase.from("diary_entries").update(payload).eq("id", editingId);
      } else {
        await supabase.from("diary_entries").insert(payload);
      }
      await fetchEntries();
    } else {
      let updated;
      if (editingId) {
        updated = entries.map(e => e.id === editingId ? { ...e, ...payload } : e);
      } else {
        updated = [{ id: Date.now().toString(), created_at: new Date().toISOString(), ...payload }, ...entries];
      }
      setEntries(updated);
      localStorage.setItem("diary", JSON.stringify(updated));
    }
    cancel();
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

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>成長日記</h1>
          <p className="subtitle">
            {loading ? "読み込み中..." : `${entries.length}件の記録`}
          </p>
        </header>

        <button className="identify-btn" onClick={showForm ? cancel : openNew}>
          {showForm ? "キャンセル" : "＋ 記録を追加"}
        </button>

        {showForm && (
          <div className="diary-form-card">
            <div className="diary-form-row">
              <label className="diary-form-label">日付</label>
              <input
                type="date"
                className="diary-date-input"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">品種</label>
              <div className="species-search-wrap">
                <input
                  ref={speciesInputRef}
                  type="text"
                  className="diary-date-input"
                  placeholder="品種名で検索..."
                  value={speciesQuery}
                  onChange={e => {
                    setSpeciesQuery(e.target.value);
                    setForm(f => ({ ...f, speciesId: "" }));
                    setShowSpeciesList(true);
                  }}
                  onFocus={() => setShowSpeciesList(true)}
                  onBlur={() => setTimeout(() => setShowSpeciesList(false), 150)}
                />
                {form.speciesId && (
                  <button className="species-clear-btn" onClick={() => {
                    setForm(f => ({ ...f, speciesId: "" }));
                    setSpeciesQuery("");
                    speciesInputRef.current?.focus();
                  }}>×</button>
                )}
                {showSpeciesList && filteredSpecies.length > 0 && (
                  <div className="species-dropdown">
                    {filteredSpecies.map(s => (
                      <div
                        key={s.id}
                        className="species-dropdown-item"
                        onMouseDown={() => {
                          setForm(f => ({ ...f, speciesId: s.id }));
                          setSpeciesQuery(s.name);
                          setShowSpeciesList(false);
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
              <label className="diary-form-label">写真</label>
              <div>
                <button className="diary-photo-btn" onClick={() => fileInputRef.current.click()}>
                  ＋ 写真を追加
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhoto} style={{ display: "none" }} />
                {form.photos.length > 0 && (
                  <div className="diary-photo-grid">
                    {form.photos.map((src, i) => (
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
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              />
            </div>
            <button className="diary-save-btn" onClick={save}>
              {editingId ? "変更を保存" : "保存する"}
            </button>
          </div>
        )}

        <div className="diary-list">
          {!loading && entries.length === 0 && (
            <div className="gallery-empty"><p>まだ記録がありません</p></div>
          )}
          {entries.map(entry => (
            <div key={entry.id} className="diary-entry-card">
              <div className="diary-entry-header">
                <div>
                  <div className="diary-entry-date">{entry.date.replace(/-/g, ".")}</div>
                  {entry.species_name && (
                    <Link href={`/zukan/${entry.species_id}`} className="diary-entry-species">
                      {entry.species_name}
                    </Link>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <button className="diary-edit-btn" onClick={() => openEdit(entry)}>編集</button>
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
