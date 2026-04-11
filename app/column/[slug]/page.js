import Link from "next/link";
import { columns } from "../data";
import { species } from "../../zukan/data";
import { shopLinks } from "../../zukan/shop-links";

export function generateStaticParams() {
  return columns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const col = columns.find((c) => c.slug === params.slug);
  if (!col) return {};
  return {
    title: col.title,
    description: col.lead,
    openGraph: {
      title: col.title,
      description: col.lead,
      type: "article",
      publishedTime: col.date,
    },
  };
}

// 品種名をリンクに変換
function linkifySpecies(text) {
  const sorted = [...species].sort((a, b) => b.name.length - a.name.length);
  const parts = [];
  let remaining = text;

  while (remaining.length > 0) {
    let matched = false;
    for (const sp of sorted) {
      const idx = remaining.indexOf(sp.name);
      if (idx !== -1) {
        if (idx > 0) parts.push(remaining.slice(0, idx));
        parts.push(
          <Link key={`${sp.id}-${idx}-${parts.length}`} href={`/zukan/${sp.id}`} className="column-species-link">
            {sp.name}
          </Link>
        );
        remaining = remaining.slice(idx + sp.name.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      parts.push(remaining);
      break;
    }
  }
  return parts;
}

function renderBody(body) {
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
          <span key={j}>
            {linkifySpecies(line)}
            {j < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

export default function ColumnDetailPage({ params }) {
  const col = columns.find((c) => c.slug === params.slug);

  if (!col) return (
    <main><div className="container">
      <Link href="/column" className="back-link">← コラムに戻る</Link>
      <p style={{ marginTop: "2rem", color: "#c87a7a", textAlign: "center" }}>記事が見つかりませんでした</p>
    </div></main>
  );

  const relatedLinks = (col.relatedSpecies || []).map((id) => {
    const sp = species.find((s) => s.id === id);
    const links = shopLinks[id] || [];
    return { sp, links };
  }).filter(({ links }) => links.length > 0);

  const hasAffiliate = relatedLinks.length > 0 || (col.shopHtml || []).length > 0;

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

        {/* 紹介した品種 */}
        {relatedLinks.length > 0 && (
          <div className="column-affiliate-section">
            <div className="column-affiliate-title">紹介した品種</div>
            <p className="column-affiliate-note">※ 以下のリンクはアフィリエイトリンクです</p>
            {relatedLinks.map(({ sp, links }) => (
              <div key={sp?.id} className="column-affiliate-item">
                {sp && (
                  <div className="column-affiliate-label">
                    <Link href={`/zukan/${sp.id}`} className="column-species-link">
                      {sp.aliases?.[0] ?? sp.name}
                    </Link>
                  </div>
                )}
                {links.map((link, i) => (
                  <div key={i} dangerouslySetInnerHTML={{ __html: link.html }} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* おすすめ商品 */}
        {(col.shopHtml || []).length > 0 && (
          <div className="column-affiliate-section">
            <div className="column-affiliate-title">おすすめ商品</div>
            <p className="column-affiliate-note">※ 以下のリンクはアフィリエイトリンクです</p>
            {col.shopHtml.map((html, i) => (
              <div key={i} className="column-affiliate-item" dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </div>
        )}

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link href="/column" className="back-link">← コラム一覧に戻る</Link>
        </div>
      </div>
    </main>
  );
}
