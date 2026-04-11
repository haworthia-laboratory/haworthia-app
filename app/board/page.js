"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function BoardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session) {
          supabase.from("user_profiles").select("nickname").eq("user_id", session.user.id).single()
            .then(({ data }) => { if (data?.nickname) setDisplayName(data.nickname); });
        }
      });
    }
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    if (supabase) {
      const { data } = await supabase
        .from("board_posts")
        .select("id, title, display_name, created_at, reply_count")
        .order("created_at", { ascending: false });
      setPosts(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    if (supabase) {
      const { error } = await supabase.from("board_posts").insert({
        title: title.trim(),
        body: body.trim(),
        display_name: displayName.trim() || "名無しさん",
        user_id: session?.user?.id || null,
      });
      if (!error) {
        setTitle("");
        setBody("");
        setShowForm(false);
        await loadPosts();
      }
    }
    setSubmitting(false);
  }

  function formatDate(str) {
    const d = new Date(str);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  }

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>掲示板</h1>
          <p className="subtitle">質問・雑談・情報交換はこちら</p>
        </header>

        <div style={{ textAlign: "right", marginBottom: "1rem" }}>
          <button
            className="board-new-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "キャンセル" : "＋ 新しいスレッドを立てる"}
          </button>
        </div>

        {showForm && (
          <form className="board-form" onSubmit={handleSubmit}>
            <div className="board-form-row">
              <label className="board-form-label">なまえ</label>
              <input
                className="board-form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="名無しさん"
                maxLength={20}
              />
            </div>
            <div className="board-form-row">
              <label className="board-form-label">タイトル <span style={{ color: "#c87a7a" }}>*</span></label>
              <input
                className="board-form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：オブツーサの葉が赤くなってきました"
                maxLength={60}
                required
              />
            </div>
            <div className="board-form-row">
              <label className="board-form-label">本文 <span style={{ color: "#c87a7a" }}>*</span></label>
              <textarea
                className="board-form-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="質問や情報をどうぞ。"
                maxLength={1000}
                required
                rows={5}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <button className="board-submit-btn" type="submit" disabled={submitting}>
                {submitting ? "送信中…" : "投稿する"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "#aaa", marginTop: "2rem" }}>読み込み中…</p>
        ) : posts.length === 0 ? (
          <div className="board-empty">
            <p>まだスレッドがありません。</p>
            <p style={{ fontSize: "0.82rem", color: "#aaa" }}>最初の投稿をしてみましょう！</p>
          </div>
        ) : (
          <div className="board-list">
            {posts.map((post) => (
              <Link key={post.id} href={`/board/${post.id}`} className="board-card">
                <div className="board-card-title">{post.title}</div>
                <div className="board-card-meta">
                  <span className="board-card-name">{post.display_name || "名無しさん"}</span>
                  <span className="board-card-date">{formatDate(post.created_at)}</span>
                  {post.reply_count > 0 && (
                    <span className="board-card-replies">返信 {post.reply_count}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
