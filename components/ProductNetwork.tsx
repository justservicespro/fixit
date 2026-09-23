// components/ProductNetwork.tsx
"use client";

import { useState } from "react";
import { PRODUCTS_DATA } from "@/lib/constants";
import { getProductBrand } from "@/lib/productBrands";
import ProductMark, { MarkType } from "@/components/ProductMark";

// Two alternating orbit distances — keeps the connector lines from being a
// perfectly rigid wheel, gives neighbouring labels breathing room, and reads
// as a more organic, "alive" network rather than a static diagram.
const RADIUS_A = 34;
const RADIUS_B = 45;

function pos(i: number, total: number) {
  const angle = -90 + i * (360 / total);
  const rad = (angle * Math.PI) / 180;
  const radius = i % 2 === 0 ? RADIUS_A : RADIUS_B;
  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 + radius * Math.sin(rad),
  };
}

export default function ProductNetwork() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = PRODUCTS_DATA.find((p) => p.id === activeId) || null;
  const activeBrand = active ? getProductBrand(active) : null;

  return (
    <div className="jspnet">
      <div className="jspnet-stage">
        {/* decorative orbit field */}
        <svg className="jspnet-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r={RADIUS_A} fill="none" stroke="#2563EB" strokeOpacity="0.14" strokeWidth="0.45" strokeDasharray="0.5 3" />
          <circle cx="50" cy="50" r={RADIUS_B} fill="none" stroke="#2563EB" strokeOpacity="0.1" strokeWidth="0.45" strokeDasharray="0.5 3.6" />
        </svg>

        {/* connector lines + live signal pulses */}
        <svg className="jspnet-lines" viewBox="0 0 100 100" aria-hidden="true">
          {PRODUCTS_DATA.map((p, i) => {
            const { x, y } = pos(i, PRODUCTS_DATA.length);
            const brand = getProductBrand(p);
            const isActive = activeId === p.id;
            const path = `M50,50 L${x},${y}`;
            return (
              <g key={p.id}>
                <line
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke={isActive ? brand.accentColor : "#94A3B8"}
                  strokeWidth={isActive ? 0.55 : 0.28}
                  strokeOpacity={activeId ? (isActive ? 0.9 : 0.14) : 0.3}
                  strokeLinecap="round"
                  className={isActive ? "jspnet-line-active" : ""}
                  style={{ transition: "stroke-opacity 0.35s ease, stroke 0.35s ease" }}
                />
                {!isActive && (
                  <circle r="0.85" fill={brand.accentColor} className="jspnet-pulse" opacity="0.85">
                    <animateMotion dur="3.2s" begin={`${i * 0.35}s`} repeatCount="indefinite" path={path} />
                    <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.08;0.85;1" dur="3.2s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* central hub */}
        <div className="jspnet-hub">
          <div className="jspnet-hub-glow" />
          <div className="jspnet-hub-ring2" />
          <div className="jspnet-hub-ring" />
          <img src="/icon.png" alt="JustServicesPro" className="jspnet-hub-logo" />
        </div>

        {/* orbs */}
        {PRODUCTS_DATA.map((p, i) => {
          const { x, y } = pos(i, PRODUCTS_DATA.length);
          const brand = getProductBrand(p);
          const isActive = activeId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`jspnet-orb${isActive ? " jspnet-orb-active" : ""}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${i * 0.3}s`,
                ["--orb-glow" as any]: brand.accentColor,
              }}
              onClick={() => setActiveId(isActive ? null : p.id)}
              aria-label={`View ${p.name} — ${p.tagline}`}
              aria-pressed={isActive}
            >
              <span className="jspnet-orb-shell-wrap">
                <span className="jspnet-orb-ping" style={{ animationDelay: `${i * 0.3}s` }} />
                <span
                  className="jspnet-orb-shell"
                  style={{
                    background: brand.mark
                      ? `radial-gradient(circle at 32% 24%, rgba(255,255,255,0.95), rgba(255,255,255,0) 55%), #EEF2F7`
                      : `radial-gradient(circle at 32% 24%, rgba(255,255,255,0.8), rgba(255,255,255,0) 46%), ${brand.logoColor}`,
                  }}
                >
                  {brand.mark ? (
                    <ProductMark mark={brand.mark as MarkType} color={brand.logoTextColor || "#fff"} letter={brand.logoLetter} bg={brand.logoColor} />
                  ) : (
                    <span style={{ color: brand.logoTextColor || "#fff", position: "relative" }}>{brand.logoLetter || p.name[0]}</span>
                  )}
                </span>
              </span>
              <span className="jspnet-orb-label">{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* detail panel */}
      <div className={`jspnet-panel${active ? " jspnet-panel-open" : ""}`}>
        {active && activeBrand ? (
          <>
            <button type="button" className="jspnet-panel-close" onClick={() => setActiveId(null)} aria-label="Close">
              ×
            </button>
            <div className="jspnet-panel-head">
              <span
                className="jspnet-panel-badge"
                style={{ background: activeBrand.mark ? "#EEF2F7" : activeBrand.logoColor, color: activeBrand.logoTextColor || "#fff" }}
              >
                {activeBrand.mark ? (
                  <ProductMark mark={activeBrand.mark as MarkType} color={activeBrand.logoTextColor || "#fff"} letter={activeBrand.logoLetter} bg={activeBrand.logoColor} />
                ) : (
                  activeBrand.logoLetter
                )}
              </span>
              <div>
                <div className="jspnet-panel-name">{active.name}</div>
                <div className="jspnet-panel-tagline" style={{ color: activeBrand.accentColor }}>
                  {active.tagline}
                </div>
              </div>
            </div>
            <p className="jspnet-panel-desc">{active.description}</p>
            <div className="jspnet-panel-cta">
              <button type="button" className="jspnet-btn-primary" onClick={() => (window.location.href = `/products/${active.id}`)}>
                Read More
              </button>
              <button
                type="button"
                className="jspnet-btn-outline"
                onClick={() => window.open(active.url, "_blank", "noopener,noreferrer")}
              >
                Visit Portal ↗
              </button>
            </div>
          </>
        ) : (
          <div className="jspnet-hint">
            <span className="jspnet-hint-dot" />
            Tap a node to explore the platform
          </div>
        )}
      </div>
    </div>
  );
}
