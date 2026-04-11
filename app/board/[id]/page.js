"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function BoardPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
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
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    if (supabase) {
      const [{ data: postData }, { data: replyData }] = await Promise.all([
        supabase.from("board_posts").select("*").eq("id", id).single(),
        supabase.from("board_replies").select("*").eq("post_id", id).order("created_at", { ascending: true }),
      ]);
      setPost(postData);
      setReplies(replyData || []);
    }
    setLoading(false);
  }

  async function handleReply(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    if (supabase) {
      const { error } = await supabase.from("board_replies").insert({
        post_id: id,
        body: body.trim(),
        display_name: displayName.trim() || "名無しさん",
        user_id: session?.user?.id || null,
      });
      if (!error) {
        // reply_count をインクリメント
        await supabase.rpc("increment_reply_count", { post_id: id });
        setBody("");
        await loadData();
      }
    }
    setSubmitting(false);
  }

  function formatDate(str) {
    const d = new Date(str);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  if (loading) return (
    <main><div className="container">
      <Link href="/board" className="back-link">← 掲示板に戻る</Link>
      <p style={{ textAlign: "center", marginTop: "2rem", color: "#aaa" }}>読み込み中…</p>
    </div></main>
  );

  if (!post) return (
    <main><div className="container">
      <Link href="/board" className="back-link">← 掲示板に戻る</Link>
      <p style={{ textAlign: "center", marginTop: "2rem", color: "#c87a7a" }}>スレッドが見つかりませんでした</p>
    </div></main>
  );

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/board" className="back-link">← 掲示板に戻る</Link>
        </header>

        {/* 元スレ */}
        <div className="board-post-card">
          <div className="board-post-title">{post.title}</div>
          <div className="board-post-meta">
            <span className="board-card-name">{post.display_name || "名無しさん"}</span>
            <span className="board-card-date">{formatDate(post.created_at)}</span>
          </div>
          <div className="board-post-body">{post.body}</div>
        </div>

        {/* 返信一覧 */}
        {replies.length > 0 && (
          <div className="board-replies">
            {replies.map((r, i) => (
              <div key={r.id} className="board-reply-card">
                <div className="board-reply-num">#{i + 1}</div>
                <div className="board-reply-meta">
                  <span className="board-card-name">{r.display_name || "名無しさん"}</span>
                  <span className="board-card-date">{formatDate(r.created_at)}</span>
                </div>
                <div className="board-reply-body">{r.body}</div>
              </div>
            ))}
          </div>
        )}

        {/* 返信フォーム */}
        <div className="board-reply-form-wrap">
          <div className="board-reply-form-title">返信する</div>
          <form className="board-form" onSubmit={handleReply}>
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
              <label className="board-form-label">本文 <span style={{ color: "#c87a7a" }}>*</span></label>
              <textarea
                className="board-form-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="返信を入力してください"
                maxLength={1000}
                required
                rows={4}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <button className="board-submit-btn" type="submit" disabled={submitting}>
                {submitting ? "送信中…" : "返信する"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
