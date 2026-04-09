"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (err) {
      setError("送信に失敗しました：" + err.message);
    } else {
      setMessage("パスワード再設定メールを送信しました。メールをご確認ください。");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!supabase) {
      setError("Supabase が設定されていません");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message);
      } else if (data?.user?.identities?.length === 0) {
        setError("このメールアドレスはすでに登録されています。ログインタブからログインしてください。");
      } else {
        setMessage("アカウントを作成しました。ログインタブからログインしてください。");
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError("メールアドレスかパスワードが違います");
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  };

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>
            {mode === "login" ? "ログイン" : "アカウント作成"}
          </h1>
          <p className="subtitle">成長日記の記録・管理</p>
        </header>

        <div className="auth-tabs">
          <button
            className={`auth-tab${mode === "login" ? " active" : ""}`}
            onClick={() => { setMode("login"); setError(""); setMessage(""); }}
          >ログイン</button>
          <button
            className={`auth-tab${mode === "signup" ? " active" : ""}`}
            onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
          >新規登録</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-row">
            <label className="auth-label">メールアドレス</label>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="auth-form-row">
            <label className="auth-label">パスワード</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "6文字以上" : "パスワード"}
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-message">{message}</div>}
          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? "処理中..." : mode === "login" ? "ログイン" : "アカウントを作成"}
          </button>
          {mode === "login" && (
            <button
              type="button"
              onClick={handleResetPassword}
              style={{ marginTop: "0.8rem", fontSize: "0.78rem", color: "#a0b8a2", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", width: "100%" }}
            >
              パスワードをお忘れの方
            </button>
          )}
        </form>

        <p className="auth-note">
          成長日記はログインしたユーザーだけが見られます。<br />
          図鑑・品種診断はログインなしでも使えます。
        </p>
      </div>
    </main>
  );
}
