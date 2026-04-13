"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { shopLinks } from "../zukan/shop-links";

const CATEGORIES = [
  {
    slug: "soudan",
    name: "ハオルチア相談室",
    desc: "うちの子が元気ない、この品種の育て方は？\n気軽に質問してください",
  },
  {
    slug: "hao-info",
    name: "通販リンクまとめ",
    desc: "オンラインショップの入荷情報を随時載せています。\nお気に入りのハオと出会えるかも...!",
  },
];

function timeAgo(str) {
  if (!str) return "";
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

export default function CommunityPage() {
  const [counts, setCounts] = useState({});
  const [latests, setLatests] = useState({});

  useEffect(() => {
    if (!supabase) return;
    Promise.all(
      CATEGORIES.map((cat) =>
        Promise.all([
          supabase
            .from("forum_topics")
            .select("id", { count: "exact", head: true })
            .eq("category_slug", cat.slug),
          supabase
            .from("forum_topics")
            .select("title, created_at, display_name")
            .eq("category_slug", cat.slug)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ])
      )
    ).then((results) => {
      const c = {};
      const l = {};
      CATEGORIES.forEach((cat, i) => {
        c[cat.slug] = results[i][0].count || 0;
        l[cat.slug] = results[i][1].data || null;
      });
      setCounts(c);
      setLatests(l);
    });
  }, []);

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>コミュニティ</h1>
          <p className="subtitle">ハオルチア愛好家の集まる場所</p>
        </header>

        <div className="forum-categories">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/board/${cat.slug}`} className="forum-category-card">
              <div className="forum-category-name">{cat.name}</div>
              <div className="forum-category-desc" style={{ whiteSpace: "pre-line" }}>{cat.desc}</div>
              <div className="forum-category-footer">
                <span className="forum-category-count">
                  {cat.slug === "hao-info"
                    ? `${Object.values(shopLinks).filter(l => l && l.length > 0).length} 件のリンク`
                    : `${counts[cat.slug] || 0} 件の投稿`}
                </span>
                {latests[cat.slug] && (
                  <span className="forum-category-latest">
                    {latests[cat.slug].display_name} · {timeAgo(latests[cat.slug].created_at)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
