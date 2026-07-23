"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useSession";
import { supabase } from "@/lib/supabaseClient";
import PersonCard from "@/app/components/PersonCard";

export default function StudentsPage() {
  const session = useSession();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session === null) router.push("/login");
  }, [session, router]);

  useEffect(() => {
    if (!session) return;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .neq("id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setStudents(data || []);
      setLoading(false);
    }

    load();
  }, [session]);

  if (session === undefined) {
    return (
      <div className="container">
        <p className="subtitle">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>학생 찾기</h1>
      <p className="subtitle">등록된 학생에게 수업을 신청해보세요.</p>

      {loading && <p className="subtitle">불러오는 중...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && students.length === 0 && (
        <p className="empty">아직 등록된 학생이 없습니다.</p>
      )}

      {students.map((s) => (
        <PersonCard
          key={s.id}
          person={s}
          currentUserId={session.user.id}
          roleLabel="학생"
          badgeClass="student"
        />
      ))}
    </div>
  );
}
