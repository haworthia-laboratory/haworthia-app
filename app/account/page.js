"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!supabase) { setLoading(false); return; }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);
      setLoading(false);
    };
    init();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwMessage("");
    if (newPassword.length < 6) {
      setPwError("パスワードは6文字以上で入力してください");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("パスワードが一致しません");
      return;
    }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwError("変更に失敗しました：" + error.message);
    } else {
      setPwMessage("パスワードを変更しました");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPwLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return (
    <main><div className="container">
      <p style={{ marginTop: "2rem", color: "#7a9a7c", textAlign: "center" }}>読み込み中...</p>
    </div></main>
  );

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>アカウント設定</h1>
        </header>

        <div className="auth-form" style={{ marginTop: "1.5rem" }}>
          <div className="auth-form-row">
            <label className="auth-label">メールアドレス</label>
            <div style={{ padding: "0.6rem 0.8rem", background: "rgba(255,255,255,0.5)", borderRadius: "12px", fontSize: "0.9rem", color: "#4a6a4c" }}>
              {user?.email}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <div className="diary-section-title">パスワードを変更</div>
          <form className="auth-form" onSubmit={handlePasswordChange}>
            <div className="auth-form-row">
              <label className="auth-label">新しいパスワード</label>
              <input
                className="auth-input"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="6文字以上"
                autoComplete="new-password"
              />
            </div>
            <div className="auth-form-row">
              <label className="auth-label">確認（もう一度）</label>
              <input
                className="auth-input"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="同じパスワードを入力"
                autoComplete="new-password"
              />
            </div>
            {pwError && <div className="auth-error">{pwError}</div>}
            {pwMessage && <div className="auth-message">{pwMessage}</div>}
            <button className="auth-submit-btn" type="submit" disabled={pwLoading}>
              {pwLoading ? "変更中..." : "パスワードを変更する"}
            </button>
          </form>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button
            onClick={handleLogout}
            style={{ fontSize: "0.78rem", color: "#a0b8a2", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            ログアウト
          </button>
        </div>

        <div style={{ marginTop: "0.8rem", textAlign: "center" }}>
          <Link href="/contact" style={{ fontSize: "0.72rem", color: "#c8a0a0", textDecoration: "none" }}>
            アカウントの削除はお問い合わせフォームへ
          </Link>
        </div>
      </div>
    </main>
  );
}
