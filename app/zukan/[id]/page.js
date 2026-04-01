import Link from "next/link";
import { species } from "../data";
import { notFound } from "next/navigation";

export default function SpeciesPage({ params }) {
  const s = species.find((sp) => sp.id === params.id);
  if (!s) notFound();

  return (
    <main>
      <div className="container">
        <Link href="/zukan" className="back-link">← 図鑑に戻る</Link>

        <div className="detail-header" style={{ "--accent": s.accent }}>
          <div className="detail-accent-bar" />
          <div className="detail-title-wrap">
            <span className="zukan-type-badge">{s.type}</span>
            <h1 className="detail-name">{s.name}</h1>
            <p className="detail-scientific">{s.scientific}</p>
          </div>
        </div>

        <div className="detail-card">
          <p className="detail-description">{s.description}</p>
        </div>

        <div className="detail-section-title">育て方</div>

        <div className="detail-card">
          <div className="care-row">
            <span className="care-label">水やり</span>
            <span className="care-value">{s.water}</span>
          </div>
          <div className="care-divider" />
          <div className="care-row">
            <span className="care-label">温度</span>
            <span className="care-value">{s.temperature}</span>
          </div>
          <div className="care-divider" />
          <div className="care-row">
            <span className="care-label">置き場所</span>
            <span className="care-value">{s.placement}</span>
          </div>
        </div>

        <div className="detail-section-title">おすすめ培養土</div>
        <div className="detail-card">
          <p className="care-value">{s.soil}</p>
        </div>

        <div className="detail-section-title">光量</div>
        <div className="detail-card">
          <div className="light-result-label" style={{ marginBottom: "0.5rem" }}>{s.light}</div>
          <div className="light-bar-wrap">
            <div className="light-bar" style={{ width: `${s.lightBar}%` }} />
          </div>
          <div className="light-desc" style={{ marginTop: "0.4rem" }}>{s.lightDesc}</div>
        </div>

        <div className="detail-section-title">交配情報</div>
        <div className="detail-card">
          {s.breeding ? (
            <p className="care-value">{s.breeding}</p>
          ) : (
            <p className="care-value detail-empty">記録なし（随時更新予定）</p>
          )}
        </div>

        <div className="detail-section-title">ギャラリー</div>
        <div className="gallery-wrap">
          {s.gallery && s.gallery.length > 0 ? (
            <div className="gallery-grid">
              {s.gallery.map((src, i) => (
                <img key={i} src={src} alt={`${s.name} ${i + 1}`} className="gallery-img" />
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              <p>写真はまだありません</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
