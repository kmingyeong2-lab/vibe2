import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container">
      <div className="center-box">
        <h1 style={{ fontSize: 28 }}>과외 선생님과 학생을 이어드려요</h1>
        <p className="subtitle" style={{ fontSize: 15 }}>
          회원가입 후 선생님 또는 학생으로 등록하고, 원하는 상대에게 바로 수업을 신청해보세요.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/signup"><button className="primary">회원가입</button></Link>
          <Link href="/login"><button className="secondary">로그인</button></Link>
        </div>
      </div>
    </div>
  );
}
