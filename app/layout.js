import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "과외 매칭 - 선생님과 학생을 연결해요",
  description: "간단한 개인 과외 선생님/학생 매칭 서비스",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
