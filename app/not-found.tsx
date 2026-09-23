"use client";
export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#071428", flexDirection: "column", gap: 20, padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 80, fontWeight: 800, color: "#2563EB", fontFamily: "Georgia, serif" }}>404</div>
      <h1 style={{ color: "#fff", fontSize: 28, fontFamily: "Georgia, serif", margin: 0 }}>Page Not Found</h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 400 }}>The page you're looking for doesn't exist. Go back to the homepage.</p>
      <a href="/" style={{ background: "linear-gradient(135deg,#2563EB,#1A4A8A)", color: "#fff", padding: "14px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
        Go to Homepage
      </a>
    </div>
  );
}
