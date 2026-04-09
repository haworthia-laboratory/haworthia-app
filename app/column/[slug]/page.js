"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { columns } from "../data";

export default function ColumnDetailPage() {
  const { slug } = useParams();
  const col = columns.find((c) => c.slug === slug);

  if (!col) return (
    <main><div className="container">
      <Link href="/column" className="back-link">← コラムに戻る</Link>
      <p style={{ marginTop: "2rem", color: "#c87a7a", textAlign: "center" }}>記事が見つかりませんでした</p>
    </div></main>
  );

  const renderBody = (body) => {
    return body.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="column-h2">{block.replace("## ", "")}</h2>;
      }
      if (block.startsWith("### ")) {
        return <h3 key={i} className="column-h3">{block.replace("### ", "")}</h3>;
      }
      const lines = block.split("\n").filter(Boolean);
      return (
        <p key={i} className="column-paragraph">
          {lines.map((line, j) => (
            <span key={j}>{line}{j < lines.length - 1 && <br />}</span>
          ))}
        </p>
      );
    });
  };

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/column" className="back-link">← コラムに戻る</Link>
          <div className="column-detail-category">{col.category}</div>
          <h1 className="column-detail-title">{col.title}</h1>
          <div className="column-detail-date">{col.date.replace(/-/g, ".")}</div>
        </header>

        <div className="column-detail-lead">{col.lead}</div>

        <div className="column-body">
          {renderBody(col.body)}
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link href="/column" className="back-link">← コラム一覧に戻る</Link>
        </div>
      </div>
    </main>
  );
}
