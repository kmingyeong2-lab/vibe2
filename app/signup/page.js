"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push("/profile");
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="container">
        <div className="center-box">
          <h1>이메일을 확인해주세요</h1>
          <p className="subtitle">가입 확인 메일을 보냈어요. 메일 인증 후 로그인해주세요.</p>
          <Link href="/login">
            <button className="primary">로그인 하러 가기</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>회원가입</h1>
      <p className="subtitle">이메일과 비밀번호로 간단하게 가입하세요.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          비밀번호 (6자 이상)
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primary" type="submit" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>
      <p className="subtitle" style={{ marginTop: 16 }}>
        이미 계정이 있으신가요? <Link href="/login">로그인</Link>
      </p>
    </div>
  );
}
