"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>お問い合わせ</h1>
          <p className="subtitle">ご意見・ご要望はこちらから</p>
        </header>

        <div style={{ marginTop: "1.5rem", marginBottom: "1rem", fontSize: "0.8rem", color: "#7a9b7c", lineHeight: 1.7 }}>
          <p>不具合の報告・機能の要望・その他お気づきの点がございましたら、お気軽にお送りください。</p>
          <p style={{ marginTop: "0.5rem" }}>通常2〜3日以内にご返信いたします。</p>
        </div>

        <div className="contact-form-wrap">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSe7c_l1qQsF3t1KtRfSFLH2fzJW8YlHlLWqRmccWc7HDpkNJA/viewform?embedded=true"
            width="100%"
            height="720"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            style={{ borderRadius: "16px" }}
          >
            読み込んでいます…
          </iframe>
        </div>
      </div>
    </main>
  );
}
