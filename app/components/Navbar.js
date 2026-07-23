"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useSession";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const session = useSession();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand">과외매칭</Link>
        <div className="nav-links">
          {session === undefined ? null : session ? (
            <>
              <Link href="/teachers">선생님 찾기</Link>
              <Link href="/students">학생 찾기</Link>
              <Link href="/requests">신청 내역</Link>
              <Link href="/profile">내 프로필</Link>
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link href="/login">로그인</Link>
              <Link href="/signup">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
