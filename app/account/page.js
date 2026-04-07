"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nickname, setNickname] = useState("");
  const [nickLoading, setNickLoading] = useState(false);
  const [nickMessage, setNickMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
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
      // ニックネーム読み込み
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("nickname")
        .eq("user_id", session.user.id)
        .single();
      if (profile?.nickname) setNickname(profile.nickname);
      setLoading(false);
    };
    init();
  }, []);

  const handleNickname = async (e) => {
    e.preventDefault();
    setNickLoading(true);
    setNickMessage("");
    await supabase.from("user_profiles").upsert({
      user_id: user.id,
      nickname: nickname.trim(),
      updated_at: new Date().toISOString(),
    });
    setNickMessage("保存しました");
    setNickLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwMessage("");
    if (!currentPassword) {
      setPwError("現在のパスワードを入力してください");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("新しいパスワードは6文字以上で入力してください");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("新しいパスワードが一致しません");
      return;
    }
    setPwLoading(true);
    // 現在のパスワードで再認証
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) {
      setPwError("現在のパスワードが正しくありません");
      setPwLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwError("変更に失敗しました：" + error.message);
    } else {
      setPwMessage("パスワードを変更しました");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPwLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("本当に退会しますか？\n日記・写真・登録データがすべて削除されます。この操作は取り消せません。")) return;
    if (!confirm("最終確認：削除したデータは復元できません。退会してよろしいですか？")) return;

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/delete-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id }),
    });
    if (res.ok) {
      await supabase.auth.signOut();
      router.push("/");
    } else {
      alert("退会処理に失敗しました。お問い合わせフォームよりご連絡ください。");
    }
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
          <div className="diary-section-title">ニックネーム</div>
          <form className="auth-form" onSubmit={handleNickname}>
            <div className="auth-form-row">
              <label className="auth-label">ニックネーム</label>
              <input
                className="auth-input"
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="例：めぐみ"
                maxLength={20}
              />
            </div>
            {nickMessage && <div className="auth-message">{nickMessage}</div>}
            <button className="auth-submit-btn" type="submit" disabled={nickLoading}>
              {nickLoading ? "保存中..." : "ニックネームを保存"}
            </button>
          </form>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <div className="diary-section-title">パスワードを変更</div>
          <form className="auth-form" onSubmit={handlePasswordChange}>
            <div className="auth-form-row">
              <label className="auth-label">現在のパスワード</label>
              <input
                className="auth-input"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="現在のパスワード"
                autoComplete="current-password"
              />
            </div>
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

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button
            onClick={handleDeleteAccount}
            style={{ fontSize: "0.72rem", color: "#c8a0a0", background: "none", border: "1px solid rgba(200,160,160,0.3)", borderRadius: "20px", padding: "0.4rem 1rem", cursor: "pointer" }}
          >
            退会する
          </button>
        </div>
      </div>
    </main>
  );
}
