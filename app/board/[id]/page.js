"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { shopLinks } from "../../zukan/shop-links";
import { species } from "../../zukan/data";
import { supplies } from "../supplies";

const CATEGORIES = {
  soudan: "ハオルチア相談室",
  "hao-info": "通販リンクまとめ",
};

const PLACEHOLDERS = {
  soudan: "例：オブツーサの葉が赤くなってきました",
  "hao-info": "例：vistajapanにかわいい万象が入荷していました",
};

function timeAgo(str) {
  const diff = Date.now() - new Date(str).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "たった今";
  if (mins < 60) return `${mins}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 30) return `${days}日前`;
  const d = new Date(str);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function CategoryPage() {
  const { id: categorySlug } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categoryName = CATEGORIES[categorySlug] || "コミュニティ";

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        supabase
          .from("user_profiles")
          .select("nickname")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data }) => {
            setDisplayName(data?.nickname || session.user.email.slice(0, 3) + "***");
          });
      }
    });
    loadTopics();
  }, [categorySlug]);

  async function loadTopics() {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase
      .from("forum_topics")
      .select("id, title, display_name, created_at")
      .eq("category_slug", categorySlug)
      .order("created_at", { ascending: false });

    const topicsWithCounts = await Promise.all(
      (data || []).map(async (t) => {
        const [{ count: replyCount }, { count: likeCount }] = await Promise.all([
          supabase.from("forum_replies").select("id", { count: "exact", head: true }).eq("topic_id", t.id),
          supabase.from("forum_likes").select("id", { count: "exact", head: true }).eq("target_id", t.id),
        ]);
        return { ...t, replyCount: replyCount || 0, likeCount: likeCount || 0 };
      })
    );
    setTopics(topicsWithCounts);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !session) return;
    setSubmitting(true);
    const { error } = await supabase.from("forum_topics").insert({
      category_slug: categorySlug,
      title: title.trim(),
      body: body.trim(),
      user_id: session.user.id,
      display_name: displayName,
    });
    if (!error) {
      setTitle("");
      setBody("");
      setShowForm(false);
      await loadTopics();
    }
    setSubmitting(false);
  }

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/board" className="back-link">← コミュニティに戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>{categoryName}</h1>
        </header>

        {categorySlug === "hao-info" && (
          <aside className="supplies-sidebar">
            {supplies.map((s) => (
              <div key={s.id} className="supplies-card-wrap">
                {s.sectionLabel && <p className="supplies-section-label">{s.sectionLabel}</p>}
                <a href={s.href} target="_blank" rel="nofollow sponsored noopener" className="supplies-card">
                  <img src={s.img} alt={s.label} className="supplies-card-img" />
                  <div className="supplies-card-label">{s.label}</div>
                  <div className="supplies-card-category">{s.category}</div>
                </a>
              </div>
            ))}
          </aside>
        )}

        {categorySlug !== "hao-info" && (
          <div style={{ marginBottom: "1rem", textAlign: "right" }}>
            {session ? (
              <button className="forum-new-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "キャンセル" : "＋ 投稿する"}
              </button>
            ) : (
              <Link href="/login" className="forum-login-prompt">ログインして投稿する →</Link>
            )}
          </div>
        )}

        {showForm && (
          <form className="forum-form" onSubmit={handleSubmit}>
            <div className="forum-form-name">{displayName} として投稿</div>
            <input
              className="forum-form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={PLACEHOLDERS[categorySlug] || "タイトルを入力"}
              maxLength={60}
              required
            />
            <textarea
              className="forum-form-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="詳しい内容を書いてください"
              maxLength={2000}
              required
              rows={5}
            />
            <div style={{ textAlign: "right" }}>
              <button className="forum-submit-btn" type="submit" disabled={submitting}>
                {submitting ? "送信中…" : "投稿する"}
              </button>
            </div>
          </form>
        )}

        {categorySlug === "hao-info" && (() => {
          const linkedSpecies = Object.entries(shopLinks)
            .filter(([, links]) => links && links.length > 0)
            .map(([id, links]) => {
              const s = species.find((sp) => sp.id === id);
              return { id, name: s?.name || id, links };
            });
          if (linkedSpecies.length === 0) return null;
          return (
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontSize: "0.78rem", color: "#8aaa8c", marginBottom: "0.8rem", letterSpacing: "0.05em" }}>
                ── 運営セレクト ──
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {linkedSpecies.map(({ id, name, links }) => (
                  <div key={id} style={{ background: "rgba(255,255,255,0.6)", borderRadius: "1rem", padding: "0.8rem 1rem", border: "1px solid rgba(255,255,255,0.8)" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: "600", color: "#2c4a2d", marginBottom: "0.5rem" }}>
                      <Link href={`/zukan/${id}`} style={{ color: "inherit", textDecoration: "none" }}>{name}</Link>
                    </div>
                    {links.map((link, i) => (
                      <div key={i} dangerouslySetInnerHTML={{ __html: link.html }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {loading ? (
          <p style={{ textAlign: "center", color: "#aaa", marginTop: "2rem" }}>読み込み中…</p>
        ) : topics.length === 0 ? (
          categorySlug !== "hao-info" ? (
            <div className="forum-empty">
              <p>まだ投稿がありません</p>
              <p style={{ fontSize: "0.82rem", color: "#aaa" }}>最初の投稿をしてみましょう！</p>
            </div>
          ) : null
        ) : (
          <div className="forum-topics">
            {categorySlug === "hao-info" && (
              <p style={{ fontSize: "0.78rem", color: "#8aaa8c", marginBottom: "0.8rem", letterSpacing: "0.05em" }}>
                ── みんなの情報 ──
              </p>
            )}
            {topics.map((topic) => (
              <Link key={topic.id} href={`/board/${categorySlug}/${topic.id}`} className="forum-topic-card">
                <div className="forum-topic-avatar">{topic.display_name.charAt(0)}</div>
                <div className="forum-topic-content">
                  <div className="forum-topic-title">{topic.title}</div>
                  <div className="forum-topic-meta">
                    <span className="forum-topic-name">{topic.display_name}</span>
                    <span className="forum-topic-time">{timeAgo(topic.created_at)}</span>
                    {topic.replyCount > 0 && (
                      <span className="forum-topic-stat">返信 {topic.replyCount}</span>
                    )}
                    {topic.likeCount > 0 && (
                      <span className="forum-topic-stat">♡ {topic.likeCount}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
