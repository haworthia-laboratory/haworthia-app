"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabaseがメールリンクからセッションを復元するのを待つ
    if (!supabase) return;
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) {
      setError("変更に失敗しました：" + err.message);
    } else {
      setMessage("パスワードを変更しました");
      setTimeout(() => router.push("/"), 2000);
    }
    setLoading(false);
  };

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← トップに戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>パスワード再設定</h1>
        </header>

        {!ready ? (
          <p style={{ marginTop: "2rem", color: "#7a9a7c", textAlign: "center" }}>
            メールのリンクから開いてください
          </p>
        ) : (
          <form className="auth-form" style={{ marginTop: "1.5rem" }} onSubmit={handleSubmit}>
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
            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-message">{message}</div>}
            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? "変更中..." : "パスワードを変更する"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
