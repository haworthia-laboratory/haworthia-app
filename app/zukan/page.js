import Link from "next/link";
import { species } from "./data";

export default function ZukanPage() {
  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>図鑑</h1>
          <p className="subtitle">登録品種 {species.length}種</p>
        </header>

        <div className="zukan-grid">
          {species.map((s) => (
            <Link key={s.id} href={`/zukan/${s.id}`} className="zukan-card" style={{ "--accent": s.accent }}>
              <div className="zukan-card-accent" />
              <div className="zukan-card-body">
                <span className="zukan-type-badge">{s.type}</span>
                <div className="zukan-name">{s.name}</div>
                <div className="zukan-scientific">{s.scientific}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
