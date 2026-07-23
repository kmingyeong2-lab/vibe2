"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useSession";
import { supabase } from "@/lib/supabaseClient";

const STATUS_LABEL = {
  pending: "대기중",
  accepted: "수락됨",
  rejected: "거절됨",
};

export default function RequestsPage() {
  const session = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  useEffect(() => {
    if (session === null) router.push("/login");
  }, [session, router]);

  const loadData = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError("");

    const [receivedRes, sentRes] = await Promise.all([
      supabase
        .from("lesson_requests")
        .select("*")
        .eq("target_id", session.user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("lesson_requests")
        .select("*")
        .eq("requester_id", session.user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (receivedRes.error || sentRes.error) {
      setError((receivedRes.error || sentRes.error).message);
      setLoading(false);
      return;
    }

    const otherIds = new Set();
    (receivedRes.data || []).forEach((r) => otherIds.add(r.requester_id));
    (sentRes.data || []).forEach((r) => otherIds.add(r.target_id));

    let profileMap = {};
    if (otherIds.size > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", Array.from(otherIds));
      (profiles || []).forEach((p) => {
        profileMap[p.id] = p;
      });
    }

    setReceived(
      (receivedRes.data || []).map((r) => ({ ...r, other: profileMap[r.requester_id] }))
    );
    setSent((sentRes.data || []).map((r) => ({ ...r, other: profileMap[r.target_id] })));
    setLoading(false);
  }, [session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function updateStatus(id, status) {
    setActingId(id);
    const { error } = await supabase
      .from("lesson_requests")
      .update({ status })
      .eq("id", id);
    setActingId(null);
    if (!error) loadData();
  }

  if (session === undefined) {
    return (
      <div className="container">
        <p className="subtitle">불러오는 중...</p>
      </div>
    );
  }

  const list = tab === "received" ? received : sent;

  return (
    <div className="container">
      <h1>수업 신청 내역</h1>
      <p className="subtitle">받은 신청과 보낸 신청을 확인하세요.</p>

      <div className="tabs">
        <button className={tab === "received" ? "active" : ""} onClick={() => setTab("received")}>
          받은 신청 ({received.length})
        </button>
        <button className={tab === "sent" ? "active" : ""} onClick={() => setTab("sent")}>
          보낸 신청 ({sent.length})
        </button>
      </div>

      {loading && <p className="subtitle">불러오는 중...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && list.length === 0 && <p className="empty">신청 내역이 없습니다.</p>}

      {list.map((r) => (
        <div className="card" key={r.id}>
          <div>
            <strong>{r.other ? r.other.name : "알 수 없음"}</strong>
            {r.other && (
              <span className={`badge ${r.other.role === "student" ? "student" : ""}`}>
                {r.other.role === "teacher" ? "선생님" : "학생"}
              </span>
            )}
            <span className={`badge ${r.status}`}>{STATUS_LABEL[r.status]}</span>
          </div>
          {r.other && <p className="subtitle" style={{ margin: "6px 0" }}>{r.other.subject}</p>}
          {r.message && <p style={{ fontSize: 14, margin: "6px 0" }}>{r.message}</p>}

          {tab === "received" && r.status === "pending" && (
            <div className="card-actions">
              <button
                className="primary"
                disabled={actingId === r.id}
                onClick={() => updateStatus(r.id, "accepted")}
              >
                수락
              </button>
              <button
                className="ghost"
                disabled={actingId === r.id}
                onClick={() => updateStatus(r.id, "rejected")}
              >
                거절
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
