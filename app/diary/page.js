"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { species } from "../zukan/data";

function getEntries() {
  try {
    return JSON.parse(localStorage.getItem("diary") || "[]");
  } catch { return []; }
}

function saveEntries(entries) {
  localStorage.setItem("diary", JSON.stringify(entries));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function DiaryPage() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: today(), speciesId: "", note: "", photo: null });
  const fileInputRef = useRef(null);

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
        setForm(f => ({ ...f, photo: canvas.toDataURL("image/jpeg", 0.8) }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!form.note && !form.photo) return;
    const speciesObj = species.find(s => s.id === form.speciesId);
    const entry = {
      id: Date.now().toString(),
      date: form.date,
      speciesId: form.speciesId || null,
      speciesName: speciesObj ? speciesObj.name : null,
      photo: form.photo,
      note: form.note,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    // 品種ギャラリーにも追加
    if (form.photo && form.speciesId) {
      const key = `gallery_${form.speciesId}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([...existing, form.photo]));
    }
    setForm({ date: today(), speciesId: "", note: "", photo: null });
    setShowForm(false);
  };

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
  };

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>成長日記</h1>
          <p className="subtitle">{entries.length}件の記録</p>
        </header>

        <button className="identify-btn" onClick={() => setShowForm(v => !v)}>
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
              <select
                className="diary-select"
                value={form.speciesId}
                onChange={e => setForm(f => ({ ...f, speciesId: e.target.value }))}
              >
                <option value="">選択しない</option>
                {species.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">写真</label>
              <div>
                <button className="diary-photo-btn" onClick={() => fileInputRef.current.click()}>
                  {form.photo ? "写真を変更" : "写真を選ぶ"}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                {form.photo && <img src={form.photo} alt="preview" className="diary-photo-preview" />}
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
            <button className="diary-save-btn" onClick={save}>保存する</button>
          </div>
        )}

        <div className="diary-list">
          {entries.length === 0 && (
            <div className="gallery-empty">
              <p>まだ記録がありません</p>
            </div>
          )}
          {entries.map(entry => (
            <div key={entry.id} className="diary-entry-card">
              <div className="diary-entry-header">
                <div>
                  <div className="diary-entry-date">{entry.date.replace(/-/g, ".")}</div>
                  {entry.speciesName && (
                    <Link href={`/zukan/${entry.speciesId}`} className="diary-entry-species">
                      {entry.speciesName}
                    </Link>
                  )}
                </div>
                <button className="diary-delete-btn" onClick={() => deleteEntry(entry.id)}>×</button>
              </div>
              {entry.photo && <img src={entry.photo} alt="記録写真" className="diary-entry-photo" />}
              {entry.note && <p className="diary-entry-note">{entry.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
