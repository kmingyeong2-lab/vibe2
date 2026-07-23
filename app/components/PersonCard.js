"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PersonCard({ person, currentUserId, roleLabel, badgeClass }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    setError("");
    setSending(true);

    const { error } = await supabase.from("lesson_requests").insert({
      requester_id: currentUserId,
      target_id: person.id,
      message,
    });

    setSending(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
    setOpen(false);
  }

  return (
    <div className="card">
      <div>
        <strong>{person.name}</strong>
        <span className={`badge ${badgeClass}`}>{roleLabel}</span>
      </div>
      <p className="subtitle" style={{ margin: "6px 0" }}>{person.subject}</p>
      {person.bio && <p style={{ fontSize: 14, margin: "6px 0" }}>{person.bio}</p>}

      {sent ? (
        <p className="success">수업 신청을 보냈습니다.</p>
      ) : open ? (
        <form className="form" onSubmit={handleSend} style={{ marginTop: 10 }}>
          <textarea
            required
            placeholder="간단한 소개나 원하는 수업 내용을 적어주세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <div className="card-actions">
            <button className="primary" type="submit" disabled={sending}>
              {sending ? "전송 중..." : "신청 보내기"}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => setOpen(false)}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="card-actions">
          <button className="primary" onClick={() => setOpen(true)}>
            수업 신청하기
          </button>
        </div>
      )}
    </div>
  );
}
