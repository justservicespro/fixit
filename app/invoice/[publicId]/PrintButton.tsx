"use client";
export default function PrintButton() {
  return (
    <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 50, background: "#0B1E3D", padding: "14px 20px", display: "flex", justifyContent: "center", gap: 12 }}>
      <button
        onClick={() => window.print()}
        style={{ background: "linear-gradient(135deg,#2563EB,#1A4A8A)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
      >
        Print / Save as PDF
      </button>
    </div>
  );
}
