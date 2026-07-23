"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useSession";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const session = useSession();
  const router = useRouter();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [bio, setBio] = useState("");
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    if (!session) return;

    async function loadProfile() {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!error && data) {
        setRole(data.role);
        setName(data.name || "");
        setSubject(data.subject || "");
        setBio(data.bio || "");
        setContact(data.contact || "");
      }
      setLoadingProfile(false);
    }

    loadProfile();
  }, [session]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const { error } = await supabase.from("profiles").upsert({
      id: session.user.id,
      role,
      name,
      subject,
      bio,
      contact,
    });

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("프로필이 저장되었습니다.");
  }

  if (session === undefined || loadingProfile) {
    return (
      <div className="container">
        <p className="subtitle">불러오는 중...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container">
      <h1>내 프로필</h1>
      <p className="subtitle">선생님 또는 학생으로 등록하고 정보를 입력해주세요.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          역할 선택
          <div className="role-toggle">
            <button
              type="button"
              className={role === "teacher" ? "active" : ""}
              onClick={() => setRole("teacher")}
            >
              선생님
            </button>
            <button
              type="button"
              className={role === "student" ? "active" : ""}
              onClick={() => setRole("student")}
            >
              학생
            </button>
          </div>
        </label>

        <label>
          이름 / 닉네임
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 김과외"
          />
        </label>

        <label>
          {role === "teacher" ? "가르칠 수 있는 과목" : "배우고 싶은 과목"}
          <input
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="예: 중등 수학, 고등 영어"
          />
        </label>

        <label>
          소개
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={
              role === "teacher"
                ? "경력, 수업 방식 등을 소개해주세요."
                : "원하는 수업 방식, 목표 등을 적어주세요."
            }
          />
        </label>

        <label>
          연락처 (선택)
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="카카오톡 ID, 전화번호 등"
          />
        </label>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button className="primary" type="submit" disabled={saving}>
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </form>
    </div>
  );
}
