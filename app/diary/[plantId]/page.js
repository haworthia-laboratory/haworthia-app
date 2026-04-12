"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { species } from "../../zukan/data";
import { supabase } from "../../../lib/supabase";

function today() { return new Date().toISOString().slice(0, 10); }
const emptyEntryForm = () => ({ date: today(), note: "", photos: [] });

const ACQUIRED_TYPES = [
  { id: "purchase", label: "購入" },
  { id: "divide", label: "株分け" },
  { id: "gift", label: "もらった" },
  { id: "seed", label: "実生" },
  { id: "other", label: "その他" },
];

export default function PlantTimelinePage() {
  const { plantId } = useParams();
  const router = useRouter();

  const [plant, setPlant] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyEntryForm());
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const fileInputRef = useRef(null);

  const [thumbOverrides, setThumbOverrides] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, label }

  useEffect(() => {
    const init = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }
      }
      fetchData();
      try {
        setThumbOverrides(JSON.parse(localStorage.getItem("plantThumbnails") || "{}"));
      } catch { setThumbOverrides({}); }
    };
    init();
  }, [plantId]);

  const fetchData = async () => {
    setLoading(true);
    if (supabase) {
      const [{ data: p }, { data: e }] = await Promise.all([
        supabase.from("plants").select("*").eq("id", plantId).single(),
        supabase.from("diary_entries").select("*").eq("plant_id", plantId).order("date", { ascending: false }),
      ]);
      setPlant(p);
      setEntries(e || []);
    } else {
      const plants = JSON.parse(localStorage.getItem("plants") || "[]");
      const allEntries = JSON.parse(localStorage.getItem("diary") || "[]");
      setPlant(plants.find(p => p.id === plantId) || null);
      setEntries(allEntries.filter(e => e.plant_id === plantId).sort((a, b) => b.date.localeCompare(a.date)));
    }
    setLoading(false);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyEntryForm());
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (entry) => {
    setEditingId(entry.id);
    setForm({ date: entry.date, note: entry.note || "", photos: entry.photos || [] });
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyEntryForm());
    setError("");
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
          setForm(f => ({ ...f, photos: [...f.photos, canvas.toDataURL("image/jpeg", 0.8)] }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (i) => setForm(f => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }));

  const save = async () => {
    setError("");
    if (!form.note.trim() && form.photos.length === 0) {
      setError("メモか写真のどちらかを入力してください");
      return;
    }
    const payload = {
      date: form.date,
      plant_id: plantId,
      plant_name: plant?.name || null,
      species_id: plant?.species_id || null,
      species_name: plant?.species_name || null,
      note: form.note,
      photos: form.photos,
    };
    if (supabase) {
      if (!editingId) {
        try {
          const { data } = await supabase.auth.getSession();
          payload.user_id = data?.session?.user?.id;
        } catch {}
      }
      const { error: err } = editingId
        ? await supabase.from("diary_entries").update(payload).eq("id", editingId)
        : await supabase.from("diary_entries").insert(payload);
      if (err) {
        if (err.message?.includes("too large") || err.code === "54000") {
          setError("写真のサイズが大きすぎます。枚数を減らして試してください");
        } else {
          setError(`保存に失敗しました：${err.message}`);
        }
        return;
      }
      await fetchData();
      setToast(editingId ? "記録を更新しました" : "記録を保存しました");
      setTimeout(() => setToast(""), 2500);
    } else {
      const allEntries = JSON.parse(localStorage.getItem("diary") || "[]");
      let updated;
      if (editingId) {
        updated = allEntries.map(e => e.id === editingId ? { ...e, ...payload } : e);
      } else {
        updated = [{ id: Date.now().toString(), created_at: new Date().toISOString(), ...payload }, ...allEntries];
      }
      localStorage.setItem("diary", JSON.stringify(updated));
      setEntries(updated.filter(e => e.plant_id === plantId).sort((a, b) => b.date.localeCompare(a.date)));
      setToast(editingId ? "記録を更新しました" : "記録を保存しました");
      setTimeout(() => setToast(""), 2500);
    }
    cancel();
  };

  const togglePublic = async (entry) => {
    const next = !entry.is_public;
    if (supabase) {
      await supabase.from("diary_entries").update({ is_public: next }).eq("id", entry.id);
    }
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, is_public: next } : e));
    setToast(next ? "ギャラリーに公開しました" : "非公開にしました");
    setTimeout(() => setToast(""), 2500);
  };

  const deleteEntry = async (id) => {
    if (supabase) {
      await supabase.from("diary_entries").delete().eq("id", id);
    } else {
      const allEntries = JSON.parse(localStorage.getItem("diary") || "[]");
      localStorage.setItem("diary", JSON.stringify(allEntries.filter(e => e.id !== id)));
    }
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const setThumbnail = (src) => {
    const next = { ...thumbOverrides, [plantId]: src };
    setThumbOverrides(next);
    localStorage.setItem("plantThumbnails", JSON.stringify(next));
  };

  const currentThumb = thumbOverrides[plantId] || entries.find(e => e.photos?.length > 0)?.photos[0];
  const acquiredLabel = ACQUIRED_TYPES.find(t => t.id === plant?.acquired_type)?.label || "";
  const sp = plant?.species_id ? species.find(s => s.id === plant.species_id) : null;

  if (loading) return (
    <main><div className="container">
      <Link href="/diary" className="back-link">← 成長日記に戻る</Link>
      <p style={{ marginTop: "2rem", color: "#7a9a7c", textAlign: "center" }}>読み込み中...</p>
    </div></main>
  );

  if (!plant) return (
    <main><div className="container">
      <Link href="/diary" className="back-link">← 成長日記に戻る</Link>
      <p style={{ marginTop: "2rem", color: "#c87a7a", textAlign: "center" }}>株が見つかりませんでした</p>
    </div></main>
  );

  return (
    <main>
      {toast && <div className="diary-toast">{toast}</div>}
      {deleteConfirm && (
        <div className="confirm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-sheet" onClick={e => e.stopPropagation()}>
            <p className="confirm-msg">「{deleteConfirm.label}」を削除しますか？</p>
            <p className="confirm-sub">この操作は取り消せません</p>
            <div className="confirm-btns">
              <button className="confirm-cancel" onClick={() => setDeleteConfirm(null)}>キャンセル</button>
              <button className="confirm-ok" onClick={() => { deleteEntry(deleteConfirm.id); setDeleteConfirm(null); }}>削除する</button>
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <header>
          <Link href="/diary" className="back-link">← 成長日記に戻る</Link>

          {/* 株ヘッダー */}
          <div className="plant-header">
            <div className="plant-header-thumb">
              {currentThumb
                ? <img src={currentThumb} alt={plant.name} />
                : <span className="diary-individual-placeholder">🌿</span>
              }
            </div>
            <div className="plant-header-info">
              <div className="plant-header-name">{plant.name}</div>
              {plant.species_name && (
                sp
                  ? <Link href={`/zukan/${plant.species_id}`} className="plant-header-species">{plant.species_name}</Link>
                  : <div className="plant-header-species">{plant.species_name}</div>
              )}
              {plant.acquired_date && (
                <div className="plant-header-meta">
                  {acquiredLabel} {plant.acquired_date.replace(/-/g, ".")}
                </div>
              )}
              {plant.memo && <div className="plant-header-memo">{plant.memo}</div>}
            </div>
          </div>
        </header>

        {/* 記録フォーム */}
        {showForm && (
          <div className="diary-form-card">
            <div className="diary-form-row">
              <label className="diary-form-label">日付</label>
              <input type="date" className="diary-date-input" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">写真</label>
              <div>
                {form.photos.length > 0 && (
                  <div className="diary-photo-grid" style={{ marginBottom: "0.5rem" }}>
                    {form.photos.map((src, i) => (
                      <div key={i} className="diary-photo-thumb-wrap">
                        <img src={src} alt={`preview ${i}`} className="diary-photo-thumb" />
                        <button className="diary-photo-remove" onClick={() => removePhoto(i)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <button className="diary-photo-btn" onClick={() => fileInputRef.current.click()}>
                  ＋ 写真を追加
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhoto} style={{ display: "none" }} />
              </div>
            </div>
            <div className="diary-form-row">
              <label className="diary-form-label">メモ</label>
              <textarea className="diary-textarea" placeholder="今日の様子、気づいたこと..."
                value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
            </div>
            {error && <div className="diary-error">{error}</div>}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button className="diary-save-btn" style={{ flex: 1 }} onClick={save}>
                {editingId ? "変更を保存" : "保存する"}
              </button>
              <button className="diary-cancel-btn" onClick={cancel}>キャンセル</button>
            </div>
          </div>
        )}

        {!showForm && (
          <button className="timeline-add-btn" onClick={openNew}>＋ 記録を追加</button>
        )}

        {/* タイムライン */}
        <div className="timeline">
          {entries.length === 0 && !showForm && (
            <div className="gallery-empty"><p>まだ記録がありません</p></div>
          )}
          {entries.map((entry, idx) => (
            <div key={entry.id} className="timeline-entry">
              <div className="timeline-dot" />
              {idx < entries.length - 1 && <div className="timeline-line" />}
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-date">{entry.date.replace(/-/g, ".")}</div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="diary-edit-btn" onClick={() => openEdit(entry)}>編集</button>
                    <button className="diary-delete-btn" onClick={() => setDeleteConfirm({ id: entry.id, label: entry.date.replace(/-/g, ".") + "の記録" })}>×</button>
                  </div>
                </div>
                {entry.photos?.length > 0 && (
                  <div className={entry.photos.length === 1 ? "" : "diary-entry-photo-grid"}>
                    {entry.photos.map((src, i) => (
                      <div key={i} className="diary-entry-photo-wrap">
                        <img src={src} alt={`写真 ${i + 1}`}
                          className={entry.photos.length === 1 ? "diary-entry-photo" : "diary-entry-photo-thumb"} />
                        <button
                          className={`diary-thumb-btn${currentThumb === src ? " active" : ""}`}
                          onClick={() => setThumbnail(src)}
                          title="サムネイルに設定"
                        >{currentThumb === src ? "★" : "☆"}</button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className={`diary-public-btn${entry.is_public ? " active" : ""}`}
                  onClick={() => togglePublic(entry)}
                  title={entry.is_public ? "ギャラリーに公開中" : "ギャラリーに公開する"}
                >
                  {entry.is_public ? "🌿 公開中" : "公開する"}
                </button>
                {entry.note && <p className="diary-entry-note">{entry.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
