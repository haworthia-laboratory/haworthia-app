"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const CATEGORIES = {
  soudan: "ハオルチア相談室",
  "hao-info": "買えるハオ・入荷情報",
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

export default function TopicPage() {
  const { id: categorySlug, topicId } = useParams();
  const router = useRouter();
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [topicLiked, setTopicLiked] = useState(false);
  const [topicLikeCount, setTopicLikeCount] = useState(0);
  const [likedIds, setLikedIds] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});

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
    loadData();
  }, [topicId]);

  async function loadData() {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }

    const [{ data: topicData }, { data: replyData }] = await Promise.all([
      supabase.from("forum_topics").select("*").eq("id", topicId).single(),
      supabase.from("forum_replies").select("*").eq("topic_id", topicId).order("created_at", { ascending: true }),
    ]);

    setTopic(topicData);
    setReplies(replyData || []);

    const allIds = [topicId, ...(replyData || []).map((r) => r.id)];
    const { data: likesData } = await supabase
      .from("forum_likes")
      .select("target_id, user_id")
      .in("target_id", allIds);

    const counts = {};
    allIds.forEach((id) => (counts[id] = 0));
    (likesData || []).forEach((l) => { counts[l.target_id] = (counts[l.target_id] || 0) + 1; });

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const myLikes = new Set(
        (likesData || []).filter((l) => l.user_id === session.user.id).map((l) => l.target_id)
      );
      setLikedIds(myLikes);
      setTopicLiked(myLikes.has(topicId));
    }

    setTopicLikeCount(counts[topicId] || 0);
    const replyCounts = {};
    (replyData || []).forEach((r) => (replyCounts[r.id] = counts[r.id] || 0));
    setLikeCounts(replyCounts);
    setLoading(false);
  }

  async function toggleLike(targetId, isReply = false) {
    if (!session) return;
    const isLiked = isReply ? likedIds.has(targetId) : topicLiked;

    if (isLiked) {
      await supabase.from("forum_likes").delete()
        .eq("target_id", targetId).eq("user_id", session.user.id);
    } else {
      await supabase.from("forum_likes").insert({
        target_id: targetId,
        target_type: isReply ? "reply" : "topic",
        user_id: session.user.id,
      });
    }

    if (isReply) {
      setLikedIds((prev) => {
        const next = new Set(prev);
        isLiked ? next.delete(targetId) : next.add(targetId);
        return next;
      });
      setLikeCounts((prev) => ({ ...prev, [targetId]: (prev[targetId] || 0) + (isLiked ? -1 : 1) }));
    } else {
      setTopicLiked(!isLiked);
      setTopicLikeCount((prev) => prev + (isLiked ? -1 : 1));
    }
  }

  async function handleDelete(targetId, type) {
    if (!confirm("削除しますか？")) return;
    const isAdmin = session?.user?.email === ADMIN_EMAIL;

    if (isAdmin) {
      const { data: { session: s } } = await supabase.auth.getSession();
      await fetch("/api/forum-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${s.access_token}`,
        },
        body: JSON.stringify({ targetId, type }),
      });
    } else {
      if (type === "topic") {
        await supabase.from("forum_topics").delete().eq("id", targetId);
      } else {
        await supabase.from("forum_replies").delete().eq("id", targetId);
      }
    }

    if (type === "topic") {
      router.push(`/board/${categorySlug}`);
    } else {
      await loadData();
    }
  }

  async function handleReply(e) {
    e.preventDefault();
    if (!body.trim() || !session) return;
    setSubmitting(true);
    const { error } = await supabase.from("forum_replies").insert({
      topic_id: topicId,
      body: body.trim(),
      user_id: session.user.id,
      display_name: displayName,
    });
    if (!error) {
      setBody("");
      await loadData();
    }
    setSubmitting(false);
  }

  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  if (loading) return (
    <main><div className="container">
      <Link href={`/board/${categorySlug}`} className="back-link">← {CATEGORIES[categorySlug] || "戻る"}</Link>
      <p style={{ textAlign: "center", marginTop: "2rem", color: "#aaa" }}>読み込み中…</p>
    </div></main>
  );

  if (!topic) return (
    <main><div className="container">
      <Link href={`/board/${categorySlug}`} className="back-link">← {CATEGORIES[categorySlug] || "戻る"}</Link>
      <p style={{ textAlign: "center", marginTop: "2rem", color: "#c87a7a" }}>投稿が見つかりませんでした</p>
    </div></main>
  );

  const canDeleteTopic = isAdmin || topic.user_id === session?.user?.id;

  return (
    <main>
      <div className="container">
        <header>
          <Link href={`/board/${categorySlug}`} className="back-link">← {CATEGORIES[categorySlug] || "コミュニティ"}</Link>
        </header>

        {/* 元投稿 */}
        <div className="forum-post-card">
          <div className="forum-post-header">
            <div className="forum-post-avatar">{topic.display_name.charAt(0)}</div>
            <div className="forum-post-author-info">
              <span className="forum-post-author">{topic.display_name}</span>
              <span className="forum-post-time">{timeAgo(topic.created_at)}</span>
            </div>
            {canDeleteTopic && (
              <button className="forum-delete-btn" onClick={() => handleDelete(topic.id, "topic")}>削除</button>
            )}
          </div>
          <div className="forum-post-title">{topic.title}</div>
          <div className="forum-post-body">{topic.body}</div>
          <div className="forum-post-footer">
            <button
              className={`forum-like-btn${topicLiked ? " liked" : ""}`}
              onClick={() => toggleLike(topic.id, false)}
              disabled={!session}
              title={session ? "" : "ログインするとハートを押せます"}
            >
              {topicLiked ? "♥" : "♡"} {topicLikeCount > 0 ? topicLikeCount : ""}
            </button>
          </div>
        </div>

        {/* 返信一覧 */}
        {replies.length > 0 && (
          <div className="forum-replies">
            {replies.map((r) => {
              const canDelete = isAdmin || r.user_id === session?.user?.id;
              return (
                <div key={r.id} className="forum-reply-card">
                  <div className="forum-post-header">
                    <div className="forum-reply-avatar">{r.display_name.charAt(0)}</div>
                    <div className="forum-post-author-info">
                      <span className="forum-post-author">{r.display_name}</span>
                      <span className="forum-post-time">{timeAgo(r.created_at)}</span>
                    </div>
                    {canDelete && (
                      <button className="forum-delete-btn" onClick={() => handleDelete(r.id, "reply")}>削除</button>
                    )}
                  </div>
                  <div className="forum-reply-body">{r.body}</div>
                  <div className="forum-post-footer">
                    <button
                      className={`forum-like-btn${likedIds.has(r.id) ? " liked" : ""}`}
                      onClick={() => toggleLike(r.id, true)}
                      disabled={!session}
                      title={session ? "" : "ログインするとハートを押せます"}
                    >
                      {likedIds.has(r.id) ? "♥" : "♡"} {likeCounts[r.id] > 0 ? likeCounts[r.id] : ""}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 返信フォーム */}
        {session ? (
          <div className="forum-reply-form-wrap">
            <div className="forum-reply-form-title">返信する</div>
            <form onSubmit={handleReply}>
              <div className="forum-form-name">{displayName} として返信</div>
              <textarea
                className="forum-form-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="返信を入力してください"
                maxLength={2000}
                required
                rows={4}
              />
              <div style={{ textAlign: "right" }}>
                <button className="forum-submit-btn" type="submit" disabled={submitting}>
                  {submitting ? "送信中…" : "返信する"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="forum-login-cta">
            <Link href="/login">ログインして返信する →</Link>
          </div>
        )}
      </div>
    </main>
  );
}
