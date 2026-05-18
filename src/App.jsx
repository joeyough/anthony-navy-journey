import React, { useState, useEffect, useRef } from "react";
import dispatch01 from "./photos/dispatch-01-day13.jpg";

// ============================================================
//  THE DECODER — Division 931, Ship 3, RTC Great Lakes
//  A tactile mobile reveal for a Navy boot camp address
// ============================================================

const C = {
  cream: "#F1E8D2",
  creamDeep: "#E8DCBE",
  navy: "#0B1E3F",
  navyDeep: "#06122A",
  brass: "#B89968",
  brassBright: "#D4B575",
  ink: "#1A1612",
  crimson: "#8B2929",
  shadow: "rgba(11, 30, 63, 0.18)",
};

const F = {
  display: '"Bebas Neue", "Oswald", "Impact", sans-serif',
  serif: '"EB Garamond", "Cormorant Garamond", Georgia, serif',
  mono: '"JetBrains Mono", "IBM Plex Mono", "Courier New", monospace',
};

// ------------- Fonts + Texture (injected once) -------------
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');

      * { -webkit-tap-highlight-color: transparent; }

      .paper {
        background-color: ${C.cream};
        background-image:
          radial-gradient(at 20% 10%, rgba(184,153,104,0.10) 0%, transparent 50%),
          radial-gradient(at 80% 90%, rgba(11,30,63,0.06) 0%, transparent 50%),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.10 0 0 0 0 0.07 0 0 0 0 0.04 0 0 0 0.07 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      }
      .paper-navy {
        background-color: ${C.navy};
        background-image:
          radial-gradient(at 30% 0%, rgba(184,153,104,0.18) 0%, transparent 55%),
          radial-gradient(at 80% 100%, rgba(139,41,41,0.18) 0%, transparent 55%),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.90 0 0 0 0 0.78 0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      }

      .stamp {
        font-family: ${F.display};
        letter-spacing: 0.08em;
        border: 3px double currentColor;
        padding: 4px 10px 2px;
        display: inline-block;
        transform: rotate(-4deg);
        text-transform: uppercase;
      }

      .reveal-card {
        perspective: 1200px;
      }
      .reveal-inner {
        transition: transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1);
        transform-style: preserve-3d;
        position: relative;
      }
      .reveal-inner.flipped { transform: rotateY(180deg); }
      .reveal-face {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        border-radius: 6px;
        overflow: hidden;
      }
      .reveal-back { transform: rotateY(180deg); }

      .seal {
        background: radial-gradient(circle at 30% 30%, ${C.brassBright}, ${C.brass} 50%, #8a6d3f 100%);
        box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2);
      }

      .scroll-snap-x {
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
      }
      .scroll-snap-item { scroll-snap-align: center; }

      .hairline { background: ${C.brass}; height: 1px; opacity: 0.55; }
      .hairline-thick { background: ${C.brass}; height: 2px; opacity: 0.7; }

      .pulse-dot {
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.3); }
      }

      .slide-up {
        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .tap-hint {
        animation: tapHint 2.5s ease-in-out infinite;
      }
      @keyframes tapHint {
        0%, 90%, 100% { transform: scale(1); }
        45% { transform: scale(0.96); }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      button:focus-visible, [role="button"]:focus-visible {
        outline: 3px solid ${C.brassBright};
        outline-offset: 2px;
      }
    `}</style>
  );
}

// ------------- Small parts -------------
const Anchor = ({ size = 24, color = C.brass }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="4" r="2" stroke={color} strokeWidth="1.5" />
    <path d="M12 6v14M8 8h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 16c0 3 3 5 7 5s7-2 7-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M3 16h4M17 16h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Chevron = ({ count = 0 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
    {[...Array(count)].map((_, i) => (
      <div key={i} style={{
        width: 28, height: 8,
        background: C.brassBright,
        clipPath: "polygon(50% 0, 100% 100%, 50% 75%, 0 100%)",
      }} />
    ))}
    {count === 0 && (
      <div style={{ width: 28, height: 24, opacity: 0.3, fontFamily: F.mono, fontSize: 10, color: C.cream, display: "flex", alignItems: "center" }}>
        ——
      </div>
    )}
  </div>
);

const SectionLabel = ({ num, title, sub }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
      <span style={{
        fontFamily: F.mono, fontSize: 11, color: C.crimson, fontWeight: 600,
        letterSpacing: "0.15em",
      }}>{num}</span>
      <div className="hairline" style={{ flex: 1, marginBottom: 4 }} />
    </div>
    <h2 style={{
      fontFamily: F.display, fontSize: 38, lineHeight: 0.95, color: C.navy,
      letterSpacing: "0.01em", margin: "8px 0 4px", fontWeight: 400,
    }}>{title}</h2>
    {sub && <p style={{ fontFamily: F.serif, fontStyle: "italic", color: C.ink, opacity: 0.75, fontSize: 15 }}>{sub}</p>}
  </div>
);

// ============================================================
//  TIMELINE MATH — shared by DateStrip and TimelineDeep
// ============================================================
const SHIP_DATE = new Date("2026-05-05T00:00:00");
const GRAD_DATE = new Date("2026-07-09T00:00:00");
const TOTAL_DAYS = 66;

function useTimeline() {
  const today = new Date();
  const daysSinceShip = Math.max(0, Math.floor((today - SHIP_DATE) / 86400000) + 1);
  const daysToGrad = Math.max(0, Math.ceil((GRAD_DATE - today) / 86400000));
  const progressPct = Math.min(100, Math.round((daysSinceShip / TOTAL_DAYS) * 100));

  let phaseIdx;
  if (daysSinceShip <= 0) phaseIdx = -1;
  else if (daysSinceShip <= 5) phaseIdx = 0;
  else if (daysSinceShip <= 22) phaseIdx = 1;
  else if (daysSinceShip <= 42) phaseIdx = 2;
  else if (daysSinceShip <= 56) phaseIdx = 3;
  else if (daysSinceShip <= TOTAL_DAYS) phaseIdx = 4;
  else phaseIdx = 5;

  // Same-day check (compare year/month/date only, ignore time of day)
  const isGradDay =
    today.getFullYear() === GRAD_DATE.getFullYear() &&
    today.getMonth() === GRAD_DATE.getMonth() &&
    today.getDate() === GRAD_DATE.getDate();
  const isAfterGrad = today > GRAD_DATE && !isGradDay;
  const daysSinceGrad = isAfterGrad
    ? Math.floor((today - GRAD_DATE) / 86400000)
    : 0;

  return {
    daysSinceShip, daysToGrad, progressPct, phaseIdx,
    isGradDay, isAfterGrad, daysSinceGrad,
  };
}

// ============================================================
//  DATE STRIP — small ship/grad summary inside the Hero
// ============================================================
function DateStrip() {
  const { daysToGrad, isGradDay, isAfterGrad, daysSinceGrad } = useTimeline();

  let badgeText;
  if (isGradDay) badgeText = "◆ TODAY HE GRADUATES ◆";
  else if (isAfterGrad) badgeText = daysSinceGrad === 1
    ? "◆ A SAILOR — AS OF YESTERDAY ◆"
    : `◆ A SAILOR FOR ${daysSinceGrad} DAYS ◆`;
  else if (daysToGrad === 1) badgeText = "◆ 1 DAY TO GO ◆";
  else badgeText = `◆ ${daysToGrad} DAYS TO GO ◆`;

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center", gap: 14,
      }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.brass, letterSpacing: "0.22em" }}>SHIPPED</div>
          <div style={{ fontFamily: F.display, fontSize: 28, color: C.cream, lineHeight: 1, marginTop: 2 }}>05 MAY</div>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.brassBright, opacity: 0.7, letterSpacing: "0.1em", marginTop: 2 }}>2026 · TUE</div>
        </div>
        <div style={{ color: C.brass, fontSize: 22, fontFamily: F.display }}>→</div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.brass, letterSpacing: "0.22em" }}>
            {isAfterGrad ? "GRADUATED" : "GRADUATES"}
          </div>
          <div style={{ fontFamily: F.display, fontSize: 28, color: C.cream, lineHeight: 1, marginTop: 2 }}>09 JUL</div>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.brassBright, opacity: 0.7, letterSpacing: "0.1em", marginTop: 2 }}>2026 · THU</div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 18 }}>
        <span style={{
          fontFamily: F.mono, fontSize: 11,
          color: isGradDay || isAfterGrad ? C.cream : C.crimson,
          background: isGradDay || isAfterGrad ? C.crimson : C.cream,
          letterSpacing: "0.22em", padding: "6px 14px",
          fontWeight: 700,
        }}>
          {badgeText}
        </span>
      </div>
    </div>
  );
}

// ============================================================
//  HERO — The address, sealed
// ============================================================
function Hero() {
  return (
    <div className="paper-navy" style={{ position: "relative", padding: "48px 24px 56px", overflow: "hidden" }}>
      {/* Top tag */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brass, letterSpacing: "0.25em" }}>
          ◆ FAMILY EDITION ◆
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brass, letterSpacing: "0.15em" }}>
          RTC GREAT LAKES
        </div>
      </div>

      {/* Seal */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div className="seal" style={{
          width: 80, height: 80, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Anchor size={42} color={C.navyDeep} />
        </div>
      </div>

      <h1 style={{
        fontFamily: F.display, fontSize: 56, lineHeight: 0.85,
        color: C.cream, textAlign: "center", letterSpacing: "0.02em",
        margin: "0 0 8px", fontWeight: 400,
      }}>
        ANTHONY<br/>JOSEPH CRIMI
      </h1>
      <p style={{
        fontFamily: F.serif, fontStyle: "italic", fontSize: 17,
        color: C.brassBright, textAlign: "center", margin: "0 0 18px",
      }}>
        Class of July 9, 2026 · Aviation Ordnanceman
      </p>

      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <span style={{
          fontFamily: F.mono, fontSize: 10, color: C.navyDeep,
          background: C.brassBright, padding: "5px 12px",
          letterSpacing: "0.2em", fontWeight: 700,
          border: `1px solid ${C.brass}`,
        }}>
          ◆ AIRMAN APPRENTICE · E-2 ◆
        </span>
      </div>

      <div className="hairline-thick" style={{ width: 60, margin: "0 auto 32px" }} />

      {/* The address */}
      <div style={{
        background: C.cream, padding: "28px 20px",
        borderTop: `2px solid ${C.brass}`,
        borderBottom: `2px solid ${C.brass}`,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
          background: C.navy, padding: "0 14px",
          fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em",
        }}>
          MAILING ADDRESS
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 14, color: C.ink, lineHeight: 1.8, textAlign: "center" }}>
          <div>SR CRIMI, ANTHONY J.</div>
          <div style={{ color: C.crimson, fontWeight: 700, fontSize: 18 }}>SHIP 03 — DIVISION 931</div>
          <div>3600 OHIO STREET</div>
          <div>GREAT LAKES, IL 60088</div>
        </div>
      </div>

      {/* Date strip */}
      <DateStrip />

      <p style={{
        fontFamily: F.serif, fontStyle: "italic", fontSize: 15,
        color: C.cream, opacity: 0.85, textAlign: "center", marginTop: 28, lineHeight: 1.55,
      }}>
        A family guide to where Anthony is,<br/>
        what he's doing, and the world<br/>
        he's stepping into.
      </p>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <span className="pulse-dot" style={{ color: C.brassBright, fontSize: 24 }}>↓</span>
      </div>
    </div>
  );
}

// ============================================================
//  DECODER CARDS — 4 tap-to-flip cards
// ============================================================
const DECODER_CARDS = [
  {
    code: "931",
    label: "DIVISION",
    decoded: "PERFORMING DIVISION",
    summary: "Hand-picked on arrival for the team that runs every graduation ceremony.",
    color: C.crimson,
    detail: "performing",
  },
  {
    code: "03",
    label: "SHIP",
    decoded: "USS HOPPER",
    summary: "Named for Admiral 'Amazing Grace' Hopper — computing pioneer and Navy legend.",
    color: C.navy,
    detail: "ship",
  },
  {
    code: "AO",
    label: "RATING",
    decoded: "AVIATION ORDNANCEMAN",
    summary: "Aircraft weapons specialist. The rating turns 100 in 2026 — Anthony is a centennial Ordie.",
    color: C.brass,
    detail: "rating",
  },
  {
    code: "E—2",
    label: "RANK",
    decoded: "AIRMAN APPRENTICE",
    summary: "Confirmed. One chevron on his sleeve at graduation. E-3 likely by end of bootcamp.",
    color: C.crimson,
    detail: "advancement",
  },
];

function DecoderGrid({ onOpen }) {
  const [flipped, setFlipped] = useState({});
  return (
    <div className="paper" style={{ padding: "40px 20px 32px" }}>
      <SectionLabel num="01 / DECODE" title="THE FOUR PIECES" sub="Tap each card. The back reveals what it means." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 28 }}>
        {DECODER_CARDS.map((card, i) => {
          const isFlipped = flipped[i];
          return (
            <div
              key={i}
              className="reveal-card tap-hint"
              style={{ height: 200, cursor: "pointer" }}
              onClick={() => setFlipped({ ...flipped, [i]: !isFlipped })}
            >
              <div className={`reveal-inner ${isFlipped ? "flipped" : ""}`} style={{ height: "100%" }}>
                {/* FRONT */}
                <div className="reveal-face" style={{
                  background: C.cream,
                  border: `1.5px solid ${C.navy}`,
                  padding: 14,
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                }}>
                  <div style={{
                    fontFamily: F.mono, fontSize: 9, color: C.ink, opacity: 0.55,
                    letterSpacing: "0.2em",
                  }}>{card.label}</div>
                  <div style={{
                    fontFamily: F.display, fontSize: 56, color: card.color,
                    lineHeight: 0.9, letterSpacing: "0.01em",
                  }}>{card.code}</div>
                  <div style={{
                    fontFamily: F.mono, fontSize: 10, color: C.brass,
                    textAlign: "right", letterSpacing: "0.1em",
                  }}>TAP →</div>
                </div>
                {/* BACK */}
                <div className="reveal-face reveal-back" style={{
                  background: card.color,
                  padding: 14,
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  color: C.cream,
                }}>
                  <div>
                    <div style={{
                      fontFamily: F.display, fontSize: 16, lineHeight: 1.05,
                      letterSpacing: "0.03em", marginBottom: 8,
                    }}>{card.decoded}</div>
                    <div className="hairline" style={{ background: C.cream, opacity: 0.4, marginBottom: 10 }} />
                    <div style={{
                      fontFamily: F.serif, fontSize: 12, lineHeight: 1.35,
                      fontStyle: "italic",
                    }}>{card.summary}</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpen(card.detail); }}
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.cream}`,
                      color: C.cream, padding: "6px 10px",
                      fontFamily: F.mono, fontSize: 9, letterSpacing: "0.15em",
                      cursor: "pointer",
                    }}
                  >
                    GO DEEPER →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{
        fontFamily: F.serif, fontStyle: "italic", fontSize: 13,
        color: C.ink, opacity: 0.6, marginTop: 20, textAlign: "center",
      }}>
        Each card's back has a "go deeper" button. Use it.
      </p>
    </div>
  );
}

// ============================================================
//  DEEP DIVE: 931 — Three subtypes (swipeable)
// ============================================================
const NINE_HUNDRED_TYPES = [
  {
    title: "TRIPLE THREAT",
    subtitle: "Band · Bluejacket Choir · Drill Team",
    description: "Plays the National Anthem and 'Anchors Aweigh' at every graduation. Performs precision rifle drill. Sometimes travels for community performances.",
    look: "He'll be on stage or on the parade deck with an instrument, in the choir, or executing rifle drill in unison.",
    icon: "♫",
  },
  {
    title: "STICKS & FLAGS",
    subtitle: "Drum Corps · 50-State Flag Bearers",
    description: "The drum corps that keeps cadence for the entire ceremony. The bearers of the 50 state flags plus DC, Guam, Puerto Rico, and the territories.",
    look: "He'll either have a drum or be carrying a flag. Recruits line up by height — usually not their home-state flag.",
    icon: "▮",
  },
  {
    title: "SHIP STAFF",
    subtitle: "Honor Guard · Sideboys · Body Snatchers",
    description: "Runs the ceremony itself. The Recruit Review Commander, Adjutant, sideboys, ushers, color guard, and the 'body snatchers' who catch any sailor who locks their knees and starts to faint.",
    look: "He'll have a visible leadership role — saluting, announcing, or stationed at attention near the stage.",
    icon: "✦",
  },
];

function NineThirtyOneDeep() {
  const [idx, setIdx] = useState(0);
  const scrollerRef = useRef(null);

  const onScroll = () => {
    if (!scrollerRef.current) return;
    const w = scrollerRef.current.offsetWidth;
    const i = Math.round(scrollerRef.current.scrollLeft / w);
    if (i !== idx) setIdx(i);
  };

  return (
    <div id="performing" className="paper" style={{ padding: "48px 0 40px", borderTop: `1px solid ${C.brass}` }}>
      <div style={{ padding: "0 20px" }}>
        <SectionLabel
          num="02 / 931"
          title="THE PERFORMING DIVISIONS"
          sub="900-series. Volunteers selected on arrival. They run every graduation ceremony at Great Lakes."
        />

        <div style={{
          background: C.navy, color: C.cream,
          padding: "20px 18px", marginTop: 12, marginBottom: 28,
          borderLeft: `4px solid ${C.brass}`,
        }}>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 8 }}>
            HOW THE NUMBER WORKS
          </div>
          <p style={{ fontFamily: F.serif, fontSize: 15, lineHeight: 1.5, margin: 0 }}>
            900-series divisions number from <strong style={{ color: C.brassBright }}>901 upward</strong> across the Navy fiscal year (which starts Oct 1).
            <span style={{ display: "block", marginTop: 8 }}>
              <strong style={{ color: C.brassBright }}>931 means the 31st performing division formed this fiscal year</strong> — putting his ship date roughly April–May 2026.
            </span>
          </p>
        </div>

        <p style={{ fontFamily: F.serif, fontSize: 15, color: C.ink, marginBottom: 16, lineHeight: 1.55 }}>
          There are three flavors of 900 division. <strong>Swipe to see all three.</strong>
        </p>
      </div>

      {/* Swipeable cards */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="scroll-snap-x"
        style={{
          display: "flex", gap: 14, overflowX: "auto",
          padding: "0 20px 20px", scrollbarWidth: "none",
        }}
      >
        {NINE_HUNDRED_TYPES.map((t, i) => (
          <div
            key={i}
            className="scroll-snap-item"
            style={{
              flexShrink: 0, width: "calc(100vw - 60px)", maxWidth: 360,
              background: C.cream,
              border: `2px solid ${C.navy}`,
              padding: 22, minHeight: 320,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: F.mono, fontSize: 10, color: C.crimson, letterSpacing: "0.15em" }}>
                  TYPE {String.fromCharCode(65 + i)}
                </div>
                <div style={{
                  fontFamily: F.display, fontSize: 30, color: C.navy,
                  lineHeight: 0.95, marginTop: 2, letterSpacing: "0.01em",
                }}>{t.title}</div>
                <div style={{
                  fontFamily: F.serif, fontStyle: "italic",
                  fontSize: 13, color: C.brass, marginTop: 4,
                }}>{t.subtitle}</div>
              </div>
              <div style={{
                fontSize: 32, color: C.brass, fontFamily: F.display,
                lineHeight: 1, opacity: 0.8,
              }}>{t.icon}</div>
            </div>

            <p style={{ fontFamily: F.serif, fontSize: 14, color: C.ink, lineHeight: 1.55, marginBottom: 16 }}>
              {t.description}
            </p>

            <div style={{
              background: C.creamDeep, padding: "12px 14px",
              borderLeft: `3px solid ${C.crimson}`,
            }}>
              <div style={{ fontFamily: F.mono, fontSize: 9, color: C.crimson, letterSpacing: "0.2em", marginBottom: 6 }}>
                WHAT TO LOOK FOR AT GRADUATION
              </div>
              <p style={{ fontFamily: F.serif, fontSize: 13, fontStyle: "italic", color: C.ink, margin: 0, lineHeight: 1.5 }}>
                {t.look}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 4 }}>
        {NINE_HUNDRED_TYPES.map((_, i) => (
          <div key={i} style={{
            width: i === idx ? 24 : 6, height: 6,
            background: i === idx ? C.crimson : C.brass,
            opacity: i === idx ? 1 : 0.5,
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      <div style={{ padding: "24px 20px 0" }}>
        <div style={{
          background: C.creamDeep,
          padding: "18px 18px",
          borderTop: `3px solid ${C.brass}`,
        }}>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.crimson, letterSpacing: "0.2em", marginBottom: 8 }}>
            THE UNIFORM TELL
          </div>
          <p style={{ fontFamily: F.serif, fontSize: 14, color: C.ink, margin: 0, lineHeight: 1.55 }}>
            900-division recruits wear a <strong>yellow aiguillette</strong> (looped cord) over the left shoulder with dress blues, blue with dress whites. Scan the formation at graduation for that cord — you'll spot him.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  DEEP DIVE: Ship 3
// ============================================================
//  USS HOPPER — Grace Hopper's story, in full
// ============================================================
const SHIPS = [
  { n: "01", name: "USS Pearl Harbor", note: "In-processing / P-days" },
  { n: "02", name: "USS Reuben James", note: "Traditional home of 900 divisions" },
  { n: "03", name: "USS Hopper", note: "Anthony's ship", highlight: true },
  { n: "04", name: "USS Arleigh Burke", note: "Rifle divisions + medical" },
  { n: "05", name: "USS Theodore Roosevelt", note: "Rifle divisions" },
  { n: "06", name: "USS Constitution", note: "Rifle divisions" },
  { n: "07", name: "USS Chicago", note: "Rifle divisions" },
];

const HOPPER_FACTS = [
  { num: "36", label: "AGE WHEN SHE JOINED THE NAVY", note: "Over the maximum age, under the minimum weight (105 lbs). The Navy waived both." },
  { num: "#1", label: "RANK AT WAVES SCHOOL", note: "Graduated first in her class. PhD in math from Yale, 1934." },
  { num: "1947", label: "FIRST COMPUTER 'BUG'", note: "She taped an actual moth into her logbook. The word 'debugging' is hers." },
  { num: "79", label: "AGE AT RETIREMENT", note: "Oldest active-duty officer in the entire U.S. armed forces when she finally stepped down." },
  { num: "11.8″", label: "A 'NANOSECOND'", note: "She handed out 11.8-inch wires to teach the distance light travels in one billionth of a second." },
  { num: "2016", label: "PRESIDENTIAL MEDAL OF FREEDOM", note: "Awarded posthumously by President Obama. The nation's highest civilian honor." },
];

const HOPPER_QUOTES = [
  { text: "It's easier to ask forgiveness than it is to get permission.", attr: "On daring to act" },
  { text: "A ship in port is safe, but that is not what ships are for. Be good ships. Sail out to sea and do new things.", attr: "Her advice to young people" },
  { text: "The most dangerous phrase in the language is, 'We've always done it this way.'", attr: "On innovation" },
  { text: "You don't manage people; you manage things. You lead people.", attr: "On leadership" },
];

function ShipDeep() {
  const [quoteIdx, setQuoteIdx] = useState(0);

  return (
    <div id="ship" className="paper-navy" style={{ padding: "48px 20px 40px", color: C.cream }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: F.mono, fontSize: 11, color: C.brassBright, fontWeight: 600, letterSpacing: "0.15em" }}>
            03 / SHIP
          </span>
          <div className="hairline" style={{ flex: 1, marginBottom: 4 }} />
        </div>
        <h2 style={{ fontFamily: F.display, fontSize: 38, lineHeight: 0.95, color: C.cream, margin: "8px 0 4px", fontWeight: 400 }}>
          USS HOPPER
        </h2>
        <p style={{ fontFamily: F.serif, fontStyle: "italic", color: C.brassBright, fontSize: 15, lineHeight: 1.5 }}>
          His barracks. Named for one of the most extraordinary Americans of the 20th century.
        </p>
      </div>

      {/* The portrait card */}
      <div style={{
        background: C.cream, color: C.ink,
        padding: "26px 22px 22px",
        marginTop: 28, marginBottom: 24,
        border: `2px solid ${C.brass}`,
        position: "relative",
      }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div className="seal" style={{
            width: 70, height: 70, borderRadius: "50%",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 12,
            fontFamily: F.display, fontSize: 28, color: C.navyDeep,
          }}>
            GH
          </div>
          <div style={{
            fontFamily: F.display, fontSize: 28, lineHeight: 1,
            color: C.navy, letterSpacing: "0.02em",
          }}>
            REAR ADMIRAL
          </div>
          <div style={{
            fontFamily: F.display, fontSize: 24, lineHeight: 1.1,
            color: C.navy, marginTop: 4, letterSpacing: "0.02em",
          }}>
            GRACE M. HOPPER
          </div>
          <div style={{
            fontFamily: F.serif, fontStyle: "italic", fontSize: 13,
            color: C.brass, marginTop: 6,
          }}>
            "Amazing Grace" · 1906–1992
          </div>
        </div>
        <div className="hairline" style={{ width: 40, margin: "0 auto 16px", background: C.brass, height: 1, opacity: 0.6 }} />
        <p style={{
          fontFamily: F.serif, fontSize: 14, lineHeight: 1.6,
          color: C.ink, margin: 0, textAlign: "center",
        }}>
          PhD mathematician. Joined the Navy at 36. Invented the first computer compiler.
          Helped create COBOL — the language still running banks today. Coined
          the words <strong>"bug"</strong> and <strong>"debugging."</strong> Retired aboard
          USS Constitution as the oldest officer in the U.S. military.
        </p>
        <div style={{
          marginTop: 16, padding: "10px 12px",
          background: C.navyDeep, color: C.brassBright,
          fontFamily: F.display, fontSize: 14, letterSpacing: "0.15em",
          textAlign: "center",
        }}>
          ⚓ MOTTO: AUDE ET EFFICE — DARE AND DO
        </div>
      </div>

      {/* Facts grid */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 12 }}>
          ◆ THE AMAZING GRACE FACT FILE
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {HOPPER_FACTS.map((f, i) => (
            <div key={i} style={{
              background: "rgba(244,236,216,0.06)",
              border: `1px solid rgba(184,153,104,0.3)`,
              padding: 14,
            }}>
              <div style={{
                fontFamily: F.display, fontSize: 30, color: C.brassBright,
                lineHeight: 1, marginBottom: 6, letterSpacing: "0.02em",
              }}>{f.num}</div>
              <div style={{
                fontFamily: F.mono, fontSize: 9, color: C.brassBright,
                letterSpacing: "0.15em", marginBottom: 6,
              }}>{f.label}</div>
              <div style={{
                fontFamily: F.serif, fontSize: 12, lineHeight: 1.45,
                color: C.cream, opacity: 0.85,
              }}>{f.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quotes carousel */}
      <div style={{
        background: C.brass, color: C.navyDeep,
        padding: "22px 18px", marginBottom: 28,
        position: "relative",
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.crimson, letterSpacing: "0.2em", marginBottom: 14 }}>
          ◆ IN HER OWN WORDS — TAP TO CHANGE
        </div>
        <button
          onClick={() => setQuoteIdx((quoteIdx + 1) % HOPPER_QUOTES.length)}
          style={{
            width: "100%", background: "transparent", border: "none",
            textAlign: "left", cursor: "pointer", padding: 0, color: C.navyDeep,
          }}
          aria-label="Tap to see next quote"
        >
          <div style={{
            fontFamily: F.serif, fontSize: 18, lineHeight: 1.45,
            fontStyle: "italic", marginBottom: 12,
          }}>
            "{HOPPER_QUOTES[quoteIdx].text}"
          </div>
          <div style={{
            fontFamily: F.mono, fontSize: 10, color: C.crimson,
            letterSpacing: "0.15em",
          }}>
            — GRACE HOPPER · {HOPPER_QUOTES[quoteIdx].attr.toUpperCase()}
          </div>
        </button>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
          {HOPPER_QUOTES.map((_, i) => (
            <div key={i} style={{
              width: i === quoteIdx ? 20 : 6, height: 4,
              background: i === quoteIdx ? C.navyDeep : "rgba(11,30,63,0.3)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* The actual barracks list */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 10 }}>
          ◆ THE BARRACKS AT RTC GREAT LAKES
        </div>
        {SHIPS.map((s, i) => (
          <div key={i} style={{
            display: "flex", gap: 14, alignItems: "center",
            padding: "10px 12px",
            background: s.highlight ? C.brass : "transparent",
            color: s.highlight ? C.navyDeep : C.cream,
            marginBottom: 2,
            border: s.highlight ? `2px solid ${C.brassBright}` : "1px solid rgba(184,153,104,0.18)",
          }}>
            <div style={{
              fontFamily: F.display, fontSize: 22,
              color: s.highlight ? C.navyDeep : C.brassBright,
              minWidth: 30, lineHeight: 1,
            }}>{s.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: F.serif, fontSize: 14, fontWeight: 600,
                color: s.highlight ? C.navyDeep : C.cream,
              }}>{s.name}</div>
              <div style={{
                fontFamily: F.mono, fontSize: 10,
                color: s.highlight ? C.crimson : C.brassBright,
                opacity: s.highlight ? 1 : 0.75,
                letterSpacing: "0.05em", marginTop: 2,
              }}>{s.note}</div>
            </div>
            {s.highlight && (
              <div style={{
                fontFamily: F.display, fontSize: 13, color: C.crimson,
                letterSpacing: "0.1em",
              }}>← HIM</div>
            )}
          </div>
        ))}
      </div>

      {/* The destroyer */}
      <div style={{
        background: "rgba(184,153,104,0.08)", padding: 18,
        borderLeft: `3px solid ${C.brassBright}`, marginBottom: 20,
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 8 }}>
          ◆ FUN FACT
        </div>
        <p style={{ fontFamily: F.serif, fontSize: 14, color: C.cream, margin: 0, lineHeight: 1.6 }}>
          There's a real warship named after her too — <strong style={{ color: C.brassBright }}>USS Hopper (DDG-70)</strong>, an Arleigh Burke-class destroyer. Nicknamed <em>"Amazing Grace,"</em> she's homeported in Pearl Harbor. Only the second U.S. Navy warship ever named for a woman from the Navy's own ranks.
        </p>
      </div>
    </div>
  );
}

// ============================================================
//  DEEP DIVE: AO Rating — Centennial year, IYAOYAS, John Finn
// ============================================================
const AO_FACTS = [
  { l: "What it stands for", v: "Aviation Ordnanceman" },
  { l: "Established", v: "March 2, 1926" },
  { l: "Centennial year", v: "2026 — that's now" },
  { l: "Active in rating today", v: "~8,300 Ordies" },
  { l: "Contract length", v: "5 years" },
  { l: "After RTC", v: "9-week A-school in Pensacola, FL" },
];

const FLIGHT_DECK_COLORS = [
  { color: "#C8351E", label: "RED", role: "ORDNANCE", note: "Anthony's shirt. Plus crash/salvage, firefighters, EOD." },
  { color: "#E8B628", label: "YELLOW", role: "DIRECTORS", note: "Aircraft directors who park and launch planes." },
  { color: "#2B6CB0", label: "BLUE", role: "HANDLERS", note: "Plane handlers, tractor drivers, elevator operators." },
  { color: "#8B4513", label: "BROWN", role: "CAPTAINS", note: "Plane captains — each one 'owns' an aircraft." },
  { color: "#2D8659", label: "GREEN", role: "CATAPULT", note: "Catapult and arresting-gear crews, maintenance." },
  { color: "#6B46C1", label: "PURPLE", role: "FUEL", note: "Aviation fuel crew. Nicknamed 'Grapes.'" },
  { color: "#F5F5F5", label: "WHITE", role: "SAFETY", note: "Safety, medical, quality, and Landing Signal Officers." },
];

function AODeep() {
  return (
    <div id="rating" className="paper" style={{ padding: "48px 20px 40px", borderTop: `1px solid ${C.brass}` }}>
      <SectionLabel
        num="04 / RATING"
        title="AVIATION ORDNANCEMAN"
        sub="The aircraft-weapons rating. On a carrier, Ordies are the ones who arm every jet that launches."
      />

      {/* Centennial badge — the big hook */}
      <div style={{
        background: C.crimson, color: C.cream,
        padding: "26px 20px",
        marginTop: 16, marginBottom: 28,
        position: "relative",
        border: `2px solid ${C.brassBright}`,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: F.mono, fontSize: 10, color: C.brassBright,
          letterSpacing: "0.25em", marginBottom: 10,
        }}>
          ◆ THIS IS NOT A NORMAL YEAR ◆
        </div>
        <div style={{
          fontFamily: F.display, fontSize: 64, lineHeight: 0.9,
          color: C.brassBright, letterSpacing: "0.02em",
        }}>
          1926 — 2026
        </div>
        <div style={{
          fontFamily: F.display, fontSize: 22, color: C.cream,
          marginTop: 10, letterSpacing: "0.05em",
        }}>
          100 YEARS OF AO
        </div>
        <p style={{
          fontFamily: F.serif, fontSize: 14, fontStyle: "italic",
          color: C.brassBright, margin: "12px 0 0", lineHeight: 1.5,
        }}>
          Anthony is joining the Aviation Ordnanceman rating in its <strong style={{ color: C.cream }}>centennial year</strong>. The rating was established by Navy Change Letter 14-26 on March 2, 1926 — Ordies have been arming Navy aircraft for a full century.
        </p>
      </div>

      {/* Day job */}
      <div style={{
        background: C.navy, color: C.cream,
        padding: 20, marginBottom: 24,
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 12 }}>
          ◆ THE DAY JOB
        </div>
        <p style={{ fontFamily: F.serif, fontSize: 15, lineHeight: 1.55, margin: 0 }}>
          Store, service, inspect, assemble, load, and arm <strong style={{ color: C.brassBright }}>bombs, missiles, rockets, and ammunition</strong>. Maintain bomb racks, missile launchers, aircraft gun systems, and weapons-handling equipment.
        </p>
      </div>

      {/* IYAOYAS / Red Shirt Nation */}
      <div style={{
        background: C.crimson, color: C.cream,
        padding: "22px 20px", marginBottom: 24,
        textAlign: "center",
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 10 }}>
          ◆ THE BATTLE CRY
        </div>
        <div style={{
          fontFamily: F.display, fontSize: 44, color: C.brassBright,
          letterSpacing: "0.04em", lineHeight: 1,
        }}>
          IYAOYAS
        </div>
        <p style={{
          fontFamily: F.serif, fontSize: 14, fontStyle: "italic",
          color: C.cream, opacity: 0.92, margin: "12px 0 0", lineHeight: 1.5,
        }}>
          <strong style={{ color: C.brassBright }}>"If You Ain't Ordnance, You Ain't Sh*t."</strong> Painted on bomb skids, stitched on hats, shouted on flight decks worldwide. Ordies call themselves <em>"Red Shirt Nation."</em>
        </p>
      </div>

      {/* Facts sheet */}
      <div style={{
        background: C.cream, border: `2px solid ${C.navy}`,
        padding: "4px 0", marginBottom: 28,
      }}>
        {AO_FACTS.map((f, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            padding: "12px 18px",
            borderBottom: i < AO_FACTS.length - 1 ? `1px dashed ${C.brass}` : "none",
          }}>
            <div style={{
              fontFamily: F.mono, fontSize: 10, color: C.ink, opacity: 0.7,
              letterSpacing: "0.1em", flex: "0 0 45%",
            }}>{f.l.toUpperCase()}</div>
            <div style={{
              fontFamily: F.serif, fontSize: 14, color: C.navy, fontWeight: 600,
              textAlign: "right", flex: 1,
            }}>{f.v}</div>
          </div>
        ))}
      </div>

      {/* Flight deck rainbow */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.crimson, letterSpacing: "0.2em", marginBottom: 4 }}>
          ◆ HOW TO SPOT AN ORDIE ON THE NEWS
        </div>
        <p style={{ fontFamily: F.serif, fontSize: 13, color: C.ink, opacity: 0.75, marginTop: 4, marginBottom: 16, lineHeight: 1.5, fontStyle: "italic" }}>
          The aircraft carrier flight deck is color-coded. Each shirt color is a different job. Anthony will wear red.
        </p>
        {FLIGHT_DECK_COLORS.map((c, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "10px 0",
            borderBottom: i < FLIGHT_DECK_COLORS.length - 1 ? `1px dashed ${C.brass}` : "none",
          }}>
            <div style={{
              width: 32, height: 32, background: c.color,
              border: c.color === "#F5F5F5" ? `1px solid ${C.ink}` : "none",
              flexShrink: 0,
            }} aria-hidden="true" />
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: F.display, fontSize: 16, color: C.navy,
                letterSpacing: "0.05em", lineHeight: 1,
              }}>
                {c.label} <span style={{ color: C.crimson, fontSize: 13 }}>— {c.role}</span>
                {c.label === "RED" && (
                  <span style={{
                    fontFamily: F.mono, fontSize: 9, color: C.crimson,
                    background: C.brassBright, padding: "2px 6px", marginLeft: 8,
                    letterSpacing: "0.15em",
                  }}>HIM</span>
                )}
              </div>
              <div style={{
                fontFamily: F.serif, fontSize: 12, color: C.ink, opacity: 0.7,
                marginTop: 2, lineHeight: 1.4,
              }}>{c.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* John Finn — the hero */}
      <div style={{
        background: C.navyDeep, color: C.cream,
        padding: "26px 20px",
        marginBottom: 24,
        position: "relative",
        border: `2px solid ${C.brassBright}`,
      }}>
        <div style={{
          fontFamily: F.mono, fontSize: 10, color: C.brassBright,
          letterSpacing: "0.25em", marginBottom: 14, textAlign: "center",
        }}>
          ★ THE ONE STORY EVERY ORDIE KNOWS ★
        </div>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{
            fontFamily: F.display, fontSize: 32, color: C.cream,
            lineHeight: 1, letterSpacing: "0.02em",
          }}>
            JOHN W. FINN
          </div>
          <div style={{
            fontFamily: F.serif, fontStyle: "italic", color: C.brassBright,
            fontSize: 13, marginTop: 6,
          }}>
            Chief Aviation Ordnanceman · 1909–2010
          </div>
        </div>

        <div className="hairline" style={{ width: 40, margin: "0 auto 16px", background: C.brass, height: 1, opacity: 0.6 }} />

        <p style={{
          fontFamily: F.serif, fontSize: 14, lineHeight: 1.65,
          margin: "0 0 14px",
        }}>
          <strong style={{ color: C.brassBright }}>December 7, 1941 — Pearl Harbor.</strong> At Naval Air Station Kaneohe Bay, Chief Finn ran into open ground under attack, mounted a .50-caliber machine gun on an instruction stand, and shot back at strafing Japanese Zeros <strong style={{ color: C.brassBright }}>for more than two hours</strong>, taking 21 wounds.
        </p>

        <p style={{
          fontFamily: F.serif, fontSize: 14, lineHeight: 1.65,
          margin: 0,
        }}>
          Admiral Nimitz personally pinned the Medal of Honor on him aboard USS Enterprise on September 14, 1942 — <strong style={{ color: C.brassBright }}>the very first Medal of Honor of World War II</strong>. He lived to 100. A destroyer, USS John Finn (DDG-113), is named for him. He started Navy life at Great Lakes in 1926 — <strong style={{ color: C.brassBright }}>the same year the AO rating was born</strong>.
        </p>

        <div style={{
          background: "rgba(184,153,104,0.1)",
          padding: 14, marginTop: 16,
          borderLeft: `3px solid ${C.brassBright}`,
        }}>
          <p style={{
            fontFamily: F.serif, fontSize: 13, fontStyle: "italic",
            color: C.brassBright, margin: 0, lineHeight: 1.55,
          }}>
            "That damned hero stuff is a bunch of crap. You gotta understand that there's all kinds of heroes."
          </p>
          <div style={{
            fontFamily: F.mono, fontSize: 9, color: C.cream, opacity: 0.7,
            letterSpacing: "0.15em", marginTop: 8,
          }}>— LT JOHN FINN, AOC, USN</div>
        </div>
      </div>

      <p style={{
        fontFamily: F.serif, fontSize: 13, fontStyle: "italic",
        color: C.ink, opacity: 0.65, textAlign: "center", lineHeight: 1.55,
      }}>
        Anthony is now part of this story.<br/>
        100 years of Ordies. One rating. One family.
      </p>
    </div>
  );
}

// ============================================================
//  DEEP DIVE: The Promotion — E-2 confirmed, E-3 incoming
// ============================================================
function PromotionDeep() {
  return (
    <div id="advancement" className="paper-navy" style={{ padding: "48px 20px 40px", color: C.cream }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: F.mono, fontSize: 11, color: C.brassBright, fontWeight: 600, letterSpacing: "0.15em" }}>
            05 / THE PROMOTION
          </span>
          <div className="hairline" style={{ flex: 1, marginBottom: 4 }} />
        </div>
        <h2 style={{ fontFamily: F.display, fontSize: 38, lineHeight: 0.95, color: C.cream, margin: "8px 0 4px", fontWeight: 400 }}>
          E-2 CONFIRMED
        </h2>
        <p style={{ fontFamily: F.serif, fontStyle: "italic", color: C.brassBright, fontSize: 15, lineHeight: 1.55 }}>
          He shipped at E-2 — not E-1. That's already a real promotion before he started.
        </p>
      </div>

      {/* The E-2 stamp card */}
      <div style={{
        background: C.brass, color: C.navyDeep,
        padding: "32px 20px",
        marginTop: 28, marginBottom: 28,
        position: "relative",
        textAlign: "center",
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.crimson, letterSpacing: "0.25em", marginBottom: 12 }}>
          ◆ HIS RANK RIGHT NOW ◆
        </div>
        <div style={{
          fontFamily: F.display, fontSize: 84, lineHeight: 0.85,
          color: C.navyDeep, letterSpacing: "0.02em",
        }}>
          E-2
        </div>
        <div style={{
          fontFamily: F.display, fontSize: 22, color: C.navyDeep,
          marginTop: 10, letterSpacing: "0.04em",
        }}>
          AIRMAN APPRENTICE
        </div>
        <div style={{
          marginTop: 14,
          display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 3,
        }}>
          <div style={{
            width: 36, height: 10,
            background: C.crimson,
            clipPath: "polygon(50% 0, 100% 100%, 50% 75%, 0 100%)",
          }} aria-hidden="true" />
        </div>
        <p style={{
          fontFamily: F.serif, fontStyle: "italic", fontSize: 13,
          color: C.navyDeep, opacity: 0.8, margin: "12px 0 0",
        }}>
          One chevron on the sleeve at graduation.
        </p>
      </div>

      {/* The E-3 promise */}
      <div style={{
        background: "rgba(244,236,216,0.06)",
        border: `1px solid ${C.brass}`,
        padding: 22, marginBottom: 28,
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 12 }}>
          ◆ WHAT'S NEXT — E-3
        </div>
        <p style={{ fontFamily: F.serif, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          AO is on the Navy's <strong style={{ color: C.brassBright }}>FY-2026 critical-ratings list</strong>. The Navy has been authorizing automatic advancement to <strong style={{ color: C.brassBright }}>E-3 (Airman)</strong> for AO recruits — possibly at Battle Stations 21, possibly at graduation.
          <span style={{ display: "block", marginTop: 10 }}>
            If it happens, watch for <strong style={{ color: C.brassBright }}>two chevrons</strong> instead of one on his sleeve when you see him on July 9.
          </span>
        </p>
      </div>

      {/* The two things people confuse */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 10 }}>
          ◆ TWO THINGS EASY TO CONFUSE
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{
            background: "rgba(244,236,216,0.06)",
            border: `1px solid rgba(184,153,104,0.3)`,
            padding: 14,
          }}>
            <div style={{ fontFamily: F.display, fontSize: 20, color: C.brassBright, marginBottom: 8 }}>
              💰 BONUS
            </div>
            <p style={{ fontFamily: F.serif, fontSize: 12, lineHeight: 1.5, margin: 0, opacity: 0.85 }}>
              One-time cash. Paid after A-school graduation, not boot camp. Doesn't change monthly pay.
            </p>
          </div>
          <div style={{
            background: "rgba(244,236,216,0.06)",
            border: `1px solid rgba(184,153,104,0.3)`,
            padding: 14,
          }}>
            <div style={{ fontFamily: F.display, fontSize: 20, color: C.brassBright, marginBottom: 8 }}>
              ⬆ ADVANCEMENT
            </div>
            <p style={{ fontFamily: F.serif, fontSize: 12, lineHeight: 1.5, margin: 0, opacity: 0.85 }}>
              Higher rank. Bigger monthly paycheck. Faster path to E-4. This is what Anthony already got.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  TIMELINE — The 66 days, dated, with countdown
// ============================================================
const PHASES = [
  {
    code: "P-DAYS",
    name: "IN-PROCESSING",
    dayRange: "DAY 1–5",
    dates: "MAY 5 — MAY 9",
    highlights: "Arrival. Pay/admin. Initial medical & dental screening. Haircuts. Initial uniform issue. The Moment of Truth phone call home — the only call until Phone Call 1.",
    phoneCalls: [{ label: "MOMENT OF TRUTH CALL", date: "Tue, May 5 (arrival night)" }],
  },
  {
    code: "PHASE 1",
    name: "INDOCTRINATION",
    dayRange: "DAY 6–22",
    dates: "MAY 10 — MAY 26",
    highlights: "3rd Class swim qualifications. Navy customs & courtesies. Uniforms & grooming. Navy Core Values. SAPR. Active Shooter / ATFP. Cyber security. US Navy ships & aircraft. Special duty screenings. First Aid / TCCC. Knowledge Test 1.",
    phoneCalls: [{ label: "PHONE CALL 1", date: "Sat, May 23" }],
  },
  {
    code: "PHASE 2",
    name: "MILITARIZATION",
    dayRange: "DAY 23–42",
    dates: "MAY 27 — JUN 15",
    highlights: "Man Overboard drills. SAPR-Fleet. Basic seamanship & marlinspike. Personnel & material inspection. Dress uniform issue. Basic damage control. Mid-Cycle PFA. Body Composition Assessment. Firefighting I/II & Team Trainer. Live fire. Uniform Issue 2 + photos. Blood drive. TCCC Assessment.",
    phoneCalls: [{ label: "PHONE CALL 2", date: "Sat, Jun 6" }],
  },
  {
    code: "PHASE 3",
    name: "EVALUATION",
    dayRange: "DAY 43–56",
    dates: "JUN 16 — JUN 29",
    highlights: "Inoculations. Weapons familiarization. Small Arms Trainer. Drill Inspection. Personnel Inspection. Knowledge Test 2. Division photo. Firefighting application. Bystander intervention. OPSEC. Fleet & Family Support. Final Personnel Inspection.",
    phoneCalls: [{ label: "PHONE CALL 3 (after PFA)", date: "approx Tue, Jun 23" }],
  },
  {
    code: "PHASE 4",
    name: "BATTLE STATIONS → PIR",
    dayRange: "DAY 57–66",
    dates: "JUN 30 — JUL 9",
    highlights: "Battle Stations 21 — the 12-hour overnight capstone. Damage Control Olympics. MyNavy Coaching. Final PFA. Final Drill Inspection. Photo pick-up. Tickets/Orders pick-up (TOPU). Liberty Brief. Then PIR.",
    phoneCalls: [
      { label: "PHONE CALL 4 (after BST-21)", date: "approx Wed, Jul 1" },
      { label: "PHONE CALL 5 (night before grad)", date: "Wed, Jul 8" },
    ],
    milestone: "GRADUATION — PASS-IN-REVIEW",
    milestoneDate: "THU, JUL 9, 2026",
  },
];

function TimelineDeep() {
  const { daysSinceShip, daysToGrad, progressPct, phaseIdx, isGradDay, isAfterGrad, daysSinceGrad } = useTimeline();

  // Label/headline for the giant number
  let giantLabel, giantSubLabel, giantHeader;
  if (isGradDay) {
    giantLabel = "★";
    giantSubLabel = "today is the day";
    giantHeader = "◆ GRADUATION DAY ◆";
  } else if (isAfterGrad) {
    giantLabel = daysSinceGrad;
    giantSubLabel = daysSinceGrad === 1
      ? "day since he became a Sailor"
      : "days since he became a Sailor";
    giantHeader = "◆ HE DID IT ◆";
  } else {
    giantLabel = daysToGrad;
    giantSubLabel = daysToGrad === 1 ? "day until graduation" : "days until graduation";
    giantHeader = "◆ COUNTDOWN ◆";
  }

  return (
    <div id="timeline" className="paper" style={{ padding: "48px 20px 40px", borderTop: `1px solid ${C.brass}` }}>
      <SectionLabel
        num="06 / TIMELINE"
        title="THE 66 DAYS"
        sub="From Tuesday, May 5 to Thursday, July 9, 2026."
      />

      {/* Countdown */}
      <div style={{
        background: isGradDay || isAfterGrad ? C.crimson : C.navy,
        color: C.cream,
        padding: "32px 20px 24px",
        margin: "20px 0 32px",
        textAlign: "center",
        border: `2px solid ${C.brass}`,
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.25em", marginBottom: 14 }}>
          {giantHeader}
        </div>
        <div style={{
          fontFamily: F.display, fontSize: 96, lineHeight: 0.85,
          color: C.brassBright, letterSpacing: "0.02em",
        }}>{giantLabel}</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", color: C.cream, fontSize: 17, marginTop: 10 }}>
          {giantSubLabel}
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: F.mono, fontSize: 9, color: C.brassBright,
            letterSpacing: "0.18em", marginBottom: 8,
          }}>
            <span>DAY {daysSinceShip}</span>
            <span>OF {TOTAL_DAYS}</span>
          </div>
          <div style={{
            background: "rgba(184,153,104,0.18)", height: 10,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              background: C.brassBright, height: "100%",
              width: `${progressPct}%`,
              transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }} />
          </div>
          <div style={{
            fontFamily: F.mono, fontSize: 10, color: C.cream, opacity: 0.65,
            textAlign: "center", marginTop: 8, letterSpacing: "0.15em",
          }}>
            {progressPct}% COMPLETE
          </div>
        </div>
      </div>

      {/* Phase cards */}
      <div>
        {PHASES.map((p, i) => {
          const isCurrent = i === phaseIdx;
          const isPast = phaseIdx > i;

          return (
            <div key={i} style={{
              marginBottom: 16,
              opacity: isPast ? 0.55 : 1,
              transition: "opacity 0.3s",
            }}>
              <div style={{
                background: isCurrent ? C.navy : C.cream,
                border: `2px solid ${isCurrent ? C.crimson : C.navy}`,
                padding: "20px 16px 16px",
                position: "relative",
              }}>
                {isCurrent && (
                  <div className="pulse-dot" style={{
                    position: "absolute", top: -11, left: 14,
                    background: C.crimson, color: C.cream,
                    padding: "4px 12px 3px",
                    fontFamily: F.mono, fontSize: 9, letterSpacing: "0.2em",
                    fontWeight: 700,
                  }}>
                    ● HE IS HERE NOW
                  </div>
                )}
                {isPast && (
                  <div style={{
                    position: "absolute", top: -11, right: 14,
                    background: C.brass, color: C.navyDeep,
                    padding: "4px 10px 3px",
                    fontFamily: F.mono, fontSize: 9, letterSpacing: "0.15em",
                  }}>
                    ✓ COMPLETE
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: F.mono, fontSize: 10,
                      color: isCurrent ? C.brassBright : C.crimson,
                      letterSpacing: "0.2em",
                    }}>
                      {p.code}
                    </div>
                    <div style={{
                      fontFamily: F.display, fontSize: 24, lineHeight: 1,
                      color: isCurrent ? C.cream : C.navy, marginTop: 4,
                      letterSpacing: "0.01em",
                    }}>{p.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontFamily: F.mono, fontSize: 9,
                      color: isCurrent ? C.brassBright : C.ink,
                      opacity: isCurrent ? 1 : 0.6,
                      letterSpacing: "0.1em",
                    }}>
                      {p.dayRange}
                    </div>
                    <div style={{
                      fontFamily: F.display, fontSize: 14,
                      color: isCurrent ? C.brassBright : C.navy,
                      marginTop: 2, letterSpacing: "0.05em",
                    }}>
                      {p.dates}
                    </div>
                  </div>
                </div>

                <p style={{
                  fontFamily: F.serif, fontSize: 13,
                  color: isCurrent ? C.cream : C.ink,
                  opacity: isCurrent ? 0.9 : 0.85,
                  lineHeight: 1.55, margin: "12px 0",
                }}>{p.highlights}</p>

                {p.phoneCalls && p.phoneCalls.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    {p.phoneCalls.map((pc, j) => (
                      <div key={j} style={{
                        background: isCurrent ? "rgba(184,153,104,0.15)" : C.creamDeep,
                        padding: "10px 12px",
                        borderLeft: `3px solid ${C.brassBright}`,
                        marginBottom: 6,
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", gap: 8, flexWrap: "wrap",
                      }}>
                        <span style={{
                          fontFamily: F.mono, fontSize: 10,
                          color: isCurrent ? C.brassBright : C.crimson,
                          letterSpacing: "0.1em", fontWeight: 600,
                        }}>☎ {pc.label}</span>
                        <span style={{
                          fontFamily: F.serif, fontWeight: 600, fontSize: 13,
                          color: isCurrent ? C.cream : C.navy, fontStyle: "italic",
                        }}>{pc.date}</span>
                      </div>
                    ))}
                  </div>
                )}

                {p.milestone && (
                  <div style={{
                    background: C.crimson, color: C.cream,
                    padding: "14px 14px",
                    marginTop: 14,
                    textAlign: "center",
                    border: `1px solid ${C.brassBright}`,
                  }}>
                    <div style={{ fontFamily: F.mono, fontSize: 9, color: C.brassBright, letterSpacing: "0.25em", marginBottom: 6 }}>
                      ★ FINAL DAY ★
                    </div>
                    <div style={{ fontFamily: F.display, fontSize: 20, letterSpacing: "0.04em", lineHeight: 1.1 }}>
                      {p.milestone}
                    </div>
                    <div style={{
                      fontFamily: F.mono, fontSize: 11, color: C.brassBright,
                      marginTop: 6, letterSpacing: "0.18em",
                    }}>
                      {p.milestoneDate}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        fontFamily: F.serif, fontStyle: "italic", fontSize: 12,
        color: C.ink, opacity: 0.55, textAlign: "center",
        marginTop: 24, lineHeight: 1.55,
      }}>
        Adapted from the official 9-Week BMT Key Events schedule.<br/>
        Phone-call dates follow the typical Saturday/post-event pattern and may shift a day.
      </div>
    </div>
  );
}

// ============================================================
//  DISPATCHES — Photos sent home, framed Polaroid-style
// ============================================================
const DISPATCHES = [
  {
    src: dispatch01,
    day: "DAY 13",
    date: "May 17, 2026 · 6:45 PM",
    caption: "First phone privileges in two weeks.",
    subcaption: "That smirk says he's already running the place.",
    rotate: -2.5,
  },
  // Future dispatches go here. Add new entries as Anthony sends photos home.
  // Format:
  // {
  //   src: importedImage,
  //   day: "DAY 25",
  //   date: "May 29, 2026",
  //   caption: "...",
  //   subcaption: "...",
  //   rotate: 1.8, // tilt angle in degrees, between -4 and 4
  // },
];

function DispatchesDeep() {
  if (DISPATCHES.length === 0) return null;

  return (
    <div className="paper" style={{ padding: "48px 20px 40px", borderTop: `1px solid ${C.brass}` }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{
            fontFamily: F.mono, fontSize: 11, color: C.crimson,
            fontWeight: 600, letterSpacing: "0.15em",
          }}>
            ★ / DISPATCHES
          </span>
          <div className="hairline" style={{ flex: 1, marginBottom: 4 }} />
        </div>
        <h2 style={{
          fontFamily: F.display, fontSize: 38, lineHeight: 0.95,
          color: C.navy, margin: "8px 0 4px", fontWeight: 400,
        }}>
          POSTCARDS HOME
        </h2>
        <p style={{
          fontFamily: F.serif, fontStyle: "italic", color: C.ink,
          opacity: 0.7, fontSize: 15, lineHeight: 1.5, margin: 0,
        }}>
          Every photo he sends from the road. Tap to see full size.
        </p>
      </div>

      {DISPATCHES.map((d, i) => (
        <DispatchCard key={i} dispatch={d} />
      ))}

      <div style={{
        background: C.creamDeep, padding: "16px 18px", marginTop: 24,
        borderLeft: `3px solid ${C.brassBright}`,
        fontFamily: F.serif, fontSize: 13, fontStyle: "italic",
        color: C.ink, opacity: 0.8, lineHeight: 1.55,
      }}>
        This album will grow. More from Battle Stations, Pass-in-Review, Pensacola, his first squadron, his first carrier — wherever Anthony goes, the dispatches come home.
      </div>
    </div>
  );
}

function DispatchCard({ dispatch }) {
  const [zoomed, setZoomed] = useState(false);
  const { src, day, date, caption, subcaption, rotate } = dispatch;

  return (
    <>
      <div style={{
        background: "transparent",
        marginBottom: 36,
        display: "flex", justifyContent: "center",
        perspective: "1000px",
      }}>
        <button
          onClick={() => setZoomed(true)}
          aria-label={`${day} dispatch — tap to enlarge`}
          style={{
            background: "#FAF6E9",
            padding: "16px 16px 14px",
            border: "none",
            boxShadow: "0 10px 24px rgba(11,30,63,0.18), 0 2px 4px rgba(11,30,63,0.12)",
            cursor: "pointer",
            maxWidth: 340, width: "92%",
            transform: `rotate(${rotate}deg)`,
            transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = `rotate(${rotate * 0.3}deg) scale(1.02)`}
          onMouseLeave={(e) => e.currentTarget.style.transform = `rotate(${rotate}deg) scale(1)`}
        >
          <img
            src={src}
            alt={`Anthony — ${day}`}
            style={{
              width: "100%", display: "block",
              background: C.ink,
            }}
          />
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "baseline", marginTop: 12, paddingBottom: 2,
          }}>
            <div style={{
              fontFamily: F.mono, fontSize: 10, color: C.crimson,
              letterSpacing: "0.18em", fontWeight: 700,
            }}>
              {day}
            </div>
            <div style={{
              fontFamily: F.mono, fontSize: 9, color: C.ink,
              opacity: 0.55, letterSpacing: "0.08em",
            }}>
              {date}
            </div>
          </div>
          <div style={{
            fontFamily: F.serif, fontSize: 15, color: C.navy,
            fontWeight: 600, marginTop: 6, lineHeight: 1.35,
            textAlign: "left",
          }}>
            {caption}
          </div>
          {subcaption && (
            <div style={{
              fontFamily: F.serif, fontSize: 13, fontStyle: "italic",
              color: C.ink, opacity: 0.72, marginTop: 4, lineHeight: 1.4,
              textAlign: "left",
            }}>
              {subcaption}
            </div>
          )}
        </button>
      </div>

      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-label="Enlarged photo — tap anywhere to close"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(6,18,42,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, cursor: "pointer",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
          <img
            src={src}
            alt={`Anthony — ${day}`}
            style={{
              maxWidth: "100%", maxHeight: "85vh",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          />
          <div style={{
            position: "absolute", top: 20, right: 20,
            fontFamily: F.mono, fontSize: 12, color: C.brassBright,
            letterSpacing: "0.2em",
          }}>
            TAP TO CLOSE ×
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
//  AT GRADUATION — Stripe spotter
// ============================================================
function GraduationDeep() {
  const [active, setActive] = useState(1); // default to E-2 since he has it

  const ranks = [
    { code: "E-1", title: "Airman Recruit", stripes: 0, color: C.ink, note: "No stripes. The default starting rank." },
    { code: "E-2", title: "Airman Apprentice", stripes: 1, color: C.brass, note: "ONE chevron. This is what Anthony has right now." },
    { code: "E-3", title: "Airman", stripes: 2, color: C.crimson, note: "TWO chevrons. Likely promotion by graduation — watch for this." },
  ];

  const ceremony = [
    { time: "T-90", label: "Doors open", note: "Family seated in the gallery. Bluejacket Choir warms up. Arrive 60–90 min early — seating is first-come-first-served." },
    { time: "T-20", label: "Divisions march in", note: "All graduating divisions take formation on the drill hall floor. Look for Division 931 with their yellow aiguillettes." },
    { time: "T-0", label: "Presentation of Colors", note: "National Anthem. The Bluejacket Choir — possibly with Anthony in it — sings." },
    { time: "T+10", label: "The Sailor's Creed", note: "Recited aloud. Much of the audience joins in." },
    { time: "T+30", label: "Awards & advancements", note: "Hall of Fame, Military Excellence, Academic, Athletic. Meritorious advancements pinned on the spot." },
    { time: "T+45", label: "The Navy Hymn", note: "'Eternal Father, Strong to Save.' The hymn played for JFK as his casket climbed the Capitol steps." },
    { time: "T+55", label: "Pass-in-Review", note: "Each division marches past the Reviewing Officer. The recruits' title officially changes — from RECRUIT to AIRMAN." },
    { time: "T+70", label: "Anchors Aweigh", note: "Plays. The new Sailors are dismissed. The drill floor opens. You run to him." },
  ];

  return (
    <div className="paper" style={{ padding: "48px 20px 40px", borderTop: `1px solid ${C.brass}` }}>
      <SectionLabel
        num="07 / PASS-IN-REVIEW"
        title="GRADUATION DAY"
        sub="July 9, 2026 · USS Midway Ceremonial Drill Hall · The most beautiful ceremony you'll ever attend."
      />

      {/* Hero quote about the ceremony */}
      <div style={{
        background: C.navy, color: C.cream,
        padding: "26px 22px", margin: "20px 0 28px",
        position: "relative",
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: F.serif, fontSize: 18, fontStyle: "italic",
          color: C.brassBright, lineHeight: 1.5,
        }}>
          "The drill hall holds about 2,000 family members.<br/>
          When 'Anchors Aweigh' plays<br/>
          and the Sailors are dismissed —<br/>
          that's the moment."
        </div>
      </div>

      {/* The chevron rank cards */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.crimson, letterSpacing: "0.2em", marginBottom: 10 }}>
          ◆ HIS SLEEVE — TAP TO SEE
        </div>
        <p style={{ fontFamily: F.serif, fontSize: 13, color: C.ink, opacity: 0.75, fontStyle: "italic", marginTop: 0, marginBottom: 16, lineHeight: 1.5 }}>
          AOs are in the aviation community, so his title is <strong>Airman</strong> (not Seaman). Count the chevrons.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {ranks.map((r, i) => (
          <button
            key={i}
            onClick={() => setActive(active === i ? null : i)}
            aria-label={`${r.code} ${r.title} - tap to see details`}
            style={{
              background: active === i ? r.color : C.cream,
              color: active === i ? C.cream : C.ink,
              border: `2px solid ${r.color}`,
              padding: "18px 8px",
              cursor: "pointer",
              transition: "all 0.3s",
              textAlign: "center",
              transform: active === i ? "scale(1.04)" : "scale(1)",
              position: "relative",
            }}
          >
            {i === 1 && (
              <div style={{
                position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                background: C.crimson, color: C.cream,
                fontFamily: F.mono, fontSize: 8, padding: "2px 6px",
                letterSpacing: "0.15em",
              }}>
                HIS NOW
              </div>
            )}
            <div style={{
              fontFamily: F.display, fontSize: 28, lineHeight: 1,
              color: active === i ? C.brassBright : r.color,
            }}>{r.code}</div>
            <div style={{
              fontFamily: F.mono, fontSize: 9, marginTop: 4,
              opacity: 0.8, letterSpacing: "0.05em",
            }}>{r.title.toUpperCase()}</div>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "center", minHeight: 40, alignItems: "center" }}>
              <Chevron count={r.stripes} />
            </div>
          </button>
        ))}
      </div>

      {active !== null && (
        <div className="slide-up" style={{
          background: ranks[active].color, color: C.cream,
          padding: 16, marginTop: 14,
        }}>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 6 }}>
            {ranks[active].code} — {ranks[active].title.toUpperCase()}
          </div>
          <p style={{ fontFamily: F.serif, fontSize: 14, margin: 0, lineHeight: 1.5 }}>
            {ranks[active].note}
          </p>
        </div>
      )}

      {/* The ceremony walkthrough */}
      <div style={{ marginTop: 36 }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.crimson, letterSpacing: "0.2em", marginBottom: 16 }}>
          ◆ HOW THE CEREMONY UNFOLDS
        </div>
        <div style={{ position: "relative", paddingLeft: 16 }}>
          <div style={{
            position: "absolute", left: 0, top: 8, bottom: 8,
            width: 2, background: C.brass, opacity: 0.4,
          }} aria-hidden="true" />
          {ceremony.map((c, i) => (
            <div key={i} style={{
              position: "relative", marginBottom: 14,
              paddingLeft: 16,
            }}>
              <div style={{
                position: "absolute", left: -22, top: 6,
                width: 10, height: 10, borderRadius: "50%",
                background: C.brass, border: `2px solid ${C.cream}`,
              }} aria-hidden="true" />
              <div style={{
                fontFamily: F.mono, fontSize: 9, color: C.crimson,
                letterSpacing: "0.15em", marginBottom: 2,
              }}>{c.time}</div>
              <div style={{
                fontFamily: F.display, fontSize: 18, color: C.navy,
                letterSpacing: "0.02em", marginBottom: 4,
              }}>{c.label.toUpperCase()}</div>
              <div style={{
                fontFamily: F.serif, fontSize: 13, color: C.ink,
                opacity: 0.8, lineHeight: 1.5,
              }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* The Sailor's Creed */}
      <div style={{
        background: C.crimson, color: C.cream,
        padding: "24px 20px", marginTop: 32,
        position: "relative",
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.25em", marginBottom: 14, textAlign: "center" }}>
          ◆ THE SAILOR'S CREED ◆
        </div>
        <p style={{
          fontFamily: F.serif, fontSize: 14, lineHeight: 1.65,
          margin: 0, fontStyle: "italic",
        }}>
          I am a United States Sailor. I will support and defend the Constitution of the United States of America and I will obey the orders of those appointed over me. I represent the fighting spirit of the Navy and those who have gone before me to defend freedom and democracy around the world. I proudly serve my country's Navy combat team with <strong style={{ color: C.brassBright, fontStyle: "normal" }}>Honor, Courage, and Commitment.</strong> I am committed to excellence and the fair treatment of all.
        </p>
      </div>

      {/* Watch the livestream tip */}
      <div style={{
        background: C.creamDeep, padding: 18, marginTop: 24,
        borderLeft: `3px solid ${C.crimson}`,
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.crimson, letterSpacing: "0.2em", marginBottom: 8 }}>
          ◆ INSIDER TIP
        </div>
        <p style={{ fontFamily: F.serif, fontSize: 14, color: C.ink, margin: 0, lineHeight: 1.55 }}>
          Because Anthony is in a 900-division, he'll <strong>perform at one or two earlier graduations</strong> before his own. Watch the RTC livestream (bootcamp.navy.mil) two weeks before July 9 and you'll likely catch him in the band, drum corps, color guard, or honor guard.
        </p>
      </div>
    </div>
  );
}

// ============================================================
//  08 / SAILOR LORE — Interactive terminology cards
// ============================================================
const LORE = [
  {
    term: "AYE, AYE",
    pron: "/aɪ aɪ/",
    meaning: 'Not the same as "yes." It means: "I heard the order, I understand the order, and I will comply."',
    deep: 'From Old English. Sailors doubled it to mean three things at once. "Yes" is for questions; "Aye, aye" is for orders.',
  },
  {
    term: "THE CROW",
    pron: "/kroʊ/",
    meaning: "The eagle perched on a Sailor's rating badge. 'I made crow' means you've earned Petty Officer Third Class — E-4.",
    deep: "Anthony will eventually wear one. Two more promotions away. The crow is the dividing line between Apprentice and Petty Officer.",
  },
  {
    term: "DIXIE CUP",
    pron: "/ˈdɪk.si kʌp/",
    meaning: "The iconic round white sailor hat. In Navy regulations since 1886.",
    deep: 'Sailors have squared, rolled, crushed, or "gull-winged" the cover to personalize it for over a century. Worn by enlisted Sailors of every rank.',
  },
  {
    term: "ANCHORS AWEIGH",
    pron: "/ˈæŋ.kərz əˈweɪ/",
    meaning: "The Navy's fight song. Means the anchor has just left the seabed — the voyage is beginning.",
    deep: "Written in 1906 by Lt. Charles Zimmermann and Midshipman Alfred Miles for the Army-Navy football game. Navy won 10-0 — their first win since 1900. At Great Lakes, recruits sing it walking through tunnels.",
  },
  {
    term: "PORT & STARBOARD",
    pron: "/pɔrt/ /ˈstɑr.bərd/",
    meaning: "Left and right on a ship. Always Port = left, Starboard = right — facing forward.",
    deep: 'Old Norse: "steorbord" — the side the steering oar was always on (the right). "Port" because the steering oar made it the side that faced the dock.',
  },
  {
    term: "EIGHT BELLS",
    pron: "/eɪt bɛlz/",
    meaning: "The ship's bell strikes every 30 minutes of a watch, up to eight bells. Eight bells = end of the 4-hour watch.",
    deep: "When a sailor passes away, the tradition is that they have completed their final watch — 'Eight bells, finished with engines.'",
  },
  {
    term: "REVEILLE & TAPS",
    pron: "/ˈrɛv.ə.li/ /tæps/",
    meaning: "Reveille wakes the ship at 0600. Taps closes the day at 2200.",
    deep: '"Reveille" is French for "wake up." Taps is the same 24-note bugle call played at every military funeral. Composed by Union General Daniel Butterfield in 1862.',
  },
  {
    term: "FAIR WINDS",
    pron: "/fɛr wɪndz/",
    meaning: "Short for 'Fair winds and following seas.' The Navy's way of saying goodbye and good luck.",
    deep: "When a Sailor is reassigned, retired, or laid to rest, this is what their shipmates say. It's a wish for an easy voyage ahead.",
  },
];

function SailorLoreDeep() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="paper-navy" style={{ padding: "48px 20px 40px", color: C.cream }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: F.mono, fontSize: 11, color: C.brassBright, fontWeight: 600, letterSpacing: "0.15em" }}>
            08 / SAILOR LORE
          </span>
          <div className="hairline" style={{ flex: 1, marginBottom: 4 }} />
        </div>
        <h2 style={{ fontFamily: F.display, fontSize: 38, lineHeight: 0.95, color: C.cream, margin: "8px 0 4px", fontWeight: 400 }}>
          A NEW VOCABULARY
        </h2>
        <p style={{ fontFamily: F.serif, fontStyle: "italic", color: C.brassBright, fontSize: 15, lineHeight: 1.5 }}>
          The words and traditions Anthony already speaks fluently. Tap any to expand.
        </p>
      </div>

      <div style={{ marginTop: 28 }}>
        {LORE.map((l, i) => {
          const isOpen = openIdx === i;
          return (
            <button
              key={i}
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: isOpen ? C.brass : "rgba(244,236,216,0.06)",
                color: isOpen ? C.navyDeep : C.cream,
                border: `1px solid ${isOpen ? C.brassBright : "rgba(184,153,104,0.3)"}`,
                padding: "16px 18px", marginBottom: 8,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <div style={{
                    fontFamily: F.display, fontSize: 22, lineHeight: 1,
                    color: isOpen ? C.navyDeep : C.brassBright,
                    letterSpacing: "0.03em",
                  }}>{l.term}</div>
                  <div style={{
                    fontFamily: F.mono, fontSize: 10,
                    color: isOpen ? C.crimson : C.brass,
                    opacity: isOpen ? 1 : 0.7,
                    marginTop: 3, letterSpacing: "0.05em",
                  }}>{l.pron}</div>
                </div>
                <div style={{
                  fontFamily: F.display, fontSize: 22,
                  color: isOpen ? C.crimson : C.brassBright,
                  lineHeight: 1,
                }}>
                  {isOpen ? "−" : "+"}
                </div>
              </div>

              {isOpen && (
                <div className="slide-up" style={{ marginTop: 14 }}>
                  <p style={{
                    fontFamily: F.serif, fontSize: 14, lineHeight: 1.55,
                    margin: "0 0 10px", color: C.navyDeep,
                  }}>{l.meaning}</p>
                  <p style={{
                    fontFamily: F.serif, fontSize: 13, fontStyle: "italic",
                    margin: 0, lineHeight: 1.55, color: C.navy,
                    opacity: 0.85,
                  }}>{l.deep}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bonus fact - Navy older than US */}
      <div style={{
        background: C.crimson, color: C.cream,
        padding: 22, marginTop: 24,
        textAlign: "center",
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.25em", marginBottom: 10 }}>
          ◆ ONE MORE THING ◆
        </div>
        <p style={{ fontFamily: F.serif, fontSize: 15, lineHeight: 1.55, margin: 0 }}>
          The U.S. Navy was founded <strong style={{ color: C.brassBright }}>October 13, 1775</strong> — eight months before the Declaration of Independence. The Navy is older than the United States itself. <strong style={{ color: C.brassBright }}>October 13, 2025 was its 250th birthday.</strong>
        </p>
      </div>
    </div>
  );
}

// ============================================================
//  09 / FAMOUS SAILORS — Pride gallery
// ============================================================
const FAMOUS = [
  {
    cat: "PRESIDENTS",
    color: C.crimson,
    people: [
      { name: "JOHN F. KENNEDY", note: "Commanded PT-109 in the Pacific. Awarded Navy and Marine Corps Medal + Purple Heart." },
      { name: "GEORGE H.W. BUSH", note: "At 18, one of the youngest naval aviators in Navy history. Flew 58 combat missions." },
      { name: "JIMMY CARTER", note: "Naval Academy '46. Nuclear submarine officer under Adm. Rickover." },
      { name: "GERALD FORD", note: "Served on USS Monterey in the Pacific. Survived a typhoon at sea." },
    ],
  },
  {
    cat: "ASTRONAUTS",
    color: C.navy,
    people: [
      { name: "JOHN GLENN", note: "First American to orbit Earth (1962). Marine aviator trained at Pensacola — same base as Anthony." },
      { name: "ALAN SHEPARD", note: "First American in space. USN naval aviator. Played golf on the moon." },
      { name: "NEIL ARMSTRONG", note: "First human on the moon. Naval aviator before joining NASA." },
      { name: "JIM LOVELL", note: "Commander of Apollo 13. 'Houston, we have a problem.' Career naval aviator." },
    ],
  },
  {
    cat: "ATHLETES",
    color: C.brass,
    people: [
      { name: "ROGER STAUBACH", note: "Heisman Trophy winner. Served in Vietnam before joining the Dallas Cowboys. Hall of Fame QB." },
      { name: "DAVID ROBINSON", note: "Naval Academy '87. NBA Hall of Famer, two-time champion with the Spurs." },
      { name: "BOB FELLER", note: "Cleveland Indians ace. Left baseball at 22 to enlist after Pearl Harbor — first MLB player to do so." },
    ],
  },
  {
    cat: "ENTERTAINERS",
    color: C.crimson,
    people: [
      { name: "ADAM DRIVER", note: "Marine Corps. Then Juilliard. Then Kylo Ren." },
      { name: "MC HAMMER", note: "Navy. Three-year enlistment as a Storekeeper before going platinum." },
      { name: "ERNEST BORGNINE", note: "Served 10 years in the Navy before Hollywood. Won the Best Actor Oscar in 1955." },
    ],
  },
];

function FamousSailorsDeep() {
  const [activeCat, setActiveCat] = useState(0);
  const cat = FAMOUS[activeCat];

  return (
    <div className="paper" style={{ padding: "48px 20px 40px", borderTop: `1px solid ${C.brass}` }}>
      <SectionLabel
        num="09 / GOOD COMPANY"
        title="HE'S NOT ALONE"
        sub="A few of the Americans who came up through the Navy before him."
      />

      <div style={{ display: "flex", gap: 0, marginTop: 20, marginBottom: 24, flexWrap: "wrap" }}>
        {FAMOUS.map((c, i) => (
          <button
            key={i}
            onClick={() => setActiveCat(i)}
            style={{
              flex: "1 1 auto", padding: "10px 8px",
              background: activeCat === i ? c.color : "transparent",
              color: activeCat === i ? C.cream : C.ink,
              border: `1px solid ${c.color}`,
              fontFamily: F.mono, fontSize: 10, letterSpacing: "0.12em",
              cursor: "pointer",
              opacity: activeCat === i ? 1 : 0.7,
              minHeight: 44,
            }}
          >
            {c.cat}
          </button>
        ))}
      </div>

      <div className="slide-up" key={activeCat}>
        {cat.people.map((p, i) => (
          <div key={i} style={{
            background: C.cream,
            border: `1px solid ${cat.color}`,
            borderLeft: `4px solid ${cat.color}`,
            padding: "14px 16px", marginBottom: 8,
          }}>
            <div style={{
              fontFamily: F.display, fontSize: 18, color: C.navy,
              letterSpacing: "0.03em", marginBottom: 4,
            }}>{p.name}</div>
            <div style={{
              fontFamily: F.serif, fontSize: 13, color: C.ink,
              opacity: 0.8, lineHeight: 1.55,
            }}>{p.note}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: C.navy, color: C.cream,
        padding: "20px 18px", marginTop: 28, textAlign: "center",
      }}>
        <p style={{
          fontFamily: F.serif, fontSize: 14, fontStyle: "italic",
          color: C.brassBright, margin: 0, lineHeight: 1.6,
        }}>
          "I can imagine no more rewarding a career. Any man who may be asked in this century what he did to make his life worthwhile, I think can respond with pride: <strong style={{ color: C.cream, fontStyle: "normal" }}>'I served in the United States Navy.'"</strong>
        </p>
        <div style={{
          fontFamily: F.mono, fontSize: 9, color: C.cream, opacity: 0.7,
          letterSpacing: "0.2em", marginTop: 12,
        }}>— JOHN F. KENNEDY</div>
      </div>
    </div>
  );
}

// ============================================================
//  10 / PENSACOLA — What comes next
// ============================================================
function PensacolaDeep() {
  return (
    <div className="paper-navy" style={{ padding: "48px 20px 40px", color: C.cream }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: F.mono, fontSize: 11, color: C.brassBright, fontWeight: 600, letterSpacing: "0.15em" }}>
            10 / WHAT'S NEXT
          </span>
          <div className="hairline" style={{ flex: 1, marginBottom: 4 }} />
        </div>
        <h2 style={{ fontFamily: F.display, fontSize: 38, lineHeight: 0.95, color: C.cream, margin: "8px 0 4px", fontWeight: 400 }}>
          PENSACOLA
        </h2>
        <p style={{ fontFamily: F.serif, fontStyle: "italic", color: C.brassBright, fontSize: 15, lineHeight: 1.55 }}>
          The Cradle of Naval Aviation. After graduation, this is where he goes for A-school.
        </p>
      </div>

      <div style={{
        background: C.cream, color: C.ink,
        padding: 22, marginTop: 24, marginBottom: 24,
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.crimson, letterSpacing: "0.2em", marginBottom: 10 }}>
          ◆ THE PLACE
        </div>
        <p style={{ fontFamily: F.serif, fontSize: 14, lineHeight: 1.6, margin: 0, color: C.ink }}>
          NAS Pensacola has trained every Navy, Marine, and Coast Guard aviator since <strong>1914</strong>. About <strong>44% of all American naval aviators in WWII trained here</strong> — including John Glenn. The base is in a beautiful corner of the Florida panhandle, on the Gulf Coast, surrounded by white-sand beaches.
        </p>
      </div>

      {/* Three things to do */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 14 }}>
          ◆ WHEN YOU VISIT HIM
        </div>

        {[
          {
            num: "01",
            title: "NATIONAL NAVAL AVIATION MUSEUM",
            note: "More than 150 restored aircraft. Over 4,000 artifacts. The Blue Angels' jets. FREE admission. Plan a half-day.",
          },
          {
            num: "02",
            title: "BLUE ANGELS PRACTICE",
            note: "The Blue Angels practice over the museum most Tuesday & Wednesday mornings (Mar–Nov). Gates open 9:30 AM. After select Wednesday practices, the pilots host FREE autograph sessions.",
          },
          {
            num: "03",
            title: "PENSACOLA LIGHTHOUSE",
            note: "Built 1859. Climb 177 steps for the best view of the Gulf and the base. One of the most haunted lighthouses in America (so they say).",
          },
          {
            num: "04",
            title: "THE BEACH",
            note: "Pensacola Beach is 15 minutes from the base. Sugar-white sand, emerald water. After 9 weeks at Great Lakes, this will feel like a different planet.",
          },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: 14,
            background: "rgba(244,236,216,0.06)",
            border: `1px solid rgba(184,153,104,0.3)`,
            padding: 16, marginBottom: 8,
          }}>
            <div style={{
              fontFamily: F.display, fontSize: 28, color: C.brassBright,
              lineHeight: 1, flexShrink: 0,
            }}>{item.num}</div>
            <div>
              <div style={{
                fontFamily: F.display, fontSize: 16, color: C.cream,
                letterSpacing: "0.02em", marginBottom: 6, lineHeight: 1.1,
              }}>{item.title}</div>
              <div style={{
                fontFamily: F.serif, fontSize: 13, lineHeight: 1.55,
                color: C.cream, opacity: 0.85,
              }}>{item.note}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: C.brass, color: C.navyDeep,
        padding: 18, textAlign: "center",
      }}>
        <p style={{
          fontFamily: F.serif, fontSize: 14, fontStyle: "italic",
          margin: 0, lineHeight: 1.55,
        }}>
          A-school is roughly <strong>9 weeks</strong>. Care packages and visits are welcome there.<br/>
          He'll graduate as an AO, ready for the fleet.
        </p>
      </div>
    </div>
  );
}

// ============================================================
//  11 / WELCOME HOME — The first salute, saints, and a closing
// ============================================================
const SAINTS = [
  {
    name: "ST. BRENDAN THE NAVIGATOR",
    years: "c. 484–577",
    note: "Irish monk, called the 'Voyaging Saint.' Patron of sailors — and yes, a patron of the United States Navy. A stained-glass window honors him at the Naval Academy in Annapolis.",
    feast: "May 16",
  },
  {
    name: "ST. ERASMUS (ST. ELMO)",
    years: "died c. 303",
    note: "Bishop of Formia, Italy. Patron of sailors. The blue glow sailors sometimes saw on their masts in storms — 'St. Elmo's Fire' — is named for him. They believed it was his protection.",
    feast: "June 2",
  },
  {
    name: "ST. NICHOLAS OF MYRA",
    years: "4th century",
    note: "Patron of sailors and merchants — and yes, the same St. Nicholas who became Santa Claus. Sailors saved from storms attributed their survival to him.",
    feast: "December 6",
  },
];

function WelcomeHome() {
  return (
    <div className="paper" style={{ padding: "48px 20px 60px", borderTop: `1px solid ${C.brass}` }}>
      <SectionLabel
        num="11 / FOR THE FAMILY"
        title="THE FIRST SALUTE"
        sub="A tradition for graduation day — and a quiet word about the saints who watch over sailors."
      />

      {/* The First Salute */}
      <div style={{
        background: C.cream, border: `2px solid ${C.brass}`,
        padding: "26px 20px", marginTop: 20, marginBottom: 32,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          background: C.cream, padding: "0 14px",
          fontFamily: F.mono, fontSize: 10, color: C.crimson,
          letterSpacing: "0.2em",
        }}>
          ◆ A FAMILY TRADITION ◆
        </div>

        <div style={{
          fontFamily: F.display, fontSize: 36, color: C.navy,
          textAlign: "center", letterSpacing: "0.02em", lineHeight: 1,
          marginTop: 12, marginBottom: 14,
        }}>
          THE SILVER DOLLAR
        </div>

        <p style={{
          fontFamily: F.serif, fontSize: 14, lineHeight: 1.65,
          color: C.ink, margin: "0 0 14px",
        }}>
          When a new Sailor renders their <strong>first salute</strong> at graduation, tradition is that they choose a person to give it to — usually a parent, grandparent, or a veteran in the family who shaped them. In exchange, the new Sailor receives a <strong>silver dollar</strong>.
        </p>

        <p style={{
          fontFamily: F.serif, fontSize: 14, lineHeight: 1.65,
          color: C.ink, margin: "0 0 14px",
        }}>
          The coin says: <em>"You held me up. I won't forget."</em> Some families pick a silver dollar from the new Sailor's birth year. Others pick the year of becoming — 2026.
        </p>

        <div style={{
          background: C.creamDeep, padding: "12px 14px",
          borderLeft: `3px solid ${C.brassBright}`,
        }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.crimson, letterSpacing: "0.15em", marginBottom: 4 }}>
            HOW TO DO IT
          </div>
          <p style={{ fontFamily: F.serif, fontSize: 13, color: C.ink, margin: 0, lineHeight: 1.55 }}>
            Order an American Silver Eagle (US Mint), or visit firstsalute.com for an engraved presentation case. Present it to Anthony after the ceremony. If no one in the family is a veteran, the recipient is simply the person Anthony most wants to honor.
          </p>
        </div>
      </div>

      {/* Saints of Sailors */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.crimson, letterSpacing: "0.2em", marginBottom: 4 }}>
          ◆ THE SAINTS WHO WATCH OVER SAILORS
        </div>
        <p style={{
          fontFamily: F.serif, fontSize: 13, color: C.ink, opacity: 0.75,
          fontStyle: "italic", marginTop: 4, marginBottom: 16, lineHeight: 1.55,
        }}>
          For the Crimi family — two Italian saints among them.
        </p>

        {SAINTS.map((s, i) => (
          <div key={i} style={{
            background: C.cream, border: `1px solid ${C.brass}`,
            padding: 16, marginBottom: 10,
            display: "flex", gap: 14, alignItems: "flex-start",
          }}>
            <div style={{
              width: 8, height: 8, marginTop: 8,
              background: C.brassBright, borderRadius: "50%",
              flexShrink: 0,
            }} aria-hidden="true" />
            <div>
              <div style={{
                fontFamily: F.display, fontSize: 18, color: C.navy,
                letterSpacing: "0.02em", lineHeight: 1.1, marginBottom: 4,
              }}>{s.name}</div>
              <div style={{
                fontFamily: F.mono, fontSize: 10, color: C.crimson,
                letterSpacing: "0.1em", marginBottom: 8,
              }}>
                {s.years} · FEAST DAY {s.feast.toUpperCase()}
              </div>
              <p style={{
                fontFamily: F.serif, fontSize: 13, color: C.ink,
                lineHeight: 1.55, margin: 0,
              }}>{s.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* What to send / not to send */}
      <div style={{
        background: C.navy, color: C.cream,
        padding: 22, marginBottom: 32,
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.brassBright, letterSpacing: "0.2em", marginBottom: 12 }}>
          ◆ WHILE HE'S AT BOOTCAMP
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontFamily: F.display, fontSize: 14, color: C.brassBright, marginBottom: 8, letterSpacing: "0.05em" }}>
              ✓ SEND
            </div>
            <ul style={{ fontFamily: F.serif, fontSize: 13, paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
              <li>Letters</li>
              <li>Small flat photos</li>
              <li>Encouragement</li>
              <li>News from home</li>
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: F.display, fontSize: 14, color: C.crimson, marginBottom: 8, letterSpacing: "0.05em" }}>
              ✗ DON'T SEND
            </div>
            <ul style={{ fontFamily: F.serif, fontSize: 13, paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
              <li>Food</li>
              <li>Care packages</li>
              <li>Clothing</li>
              <li>Cough drops, gum</li>
            </ul>
          </div>
        </div>
        <p style={{
          fontFamily: F.serif, fontSize: 12, fontStyle: "italic",
          color: C.brassBright, margin: "14px 0 0", lineHeight: 1.5, opacity: 0.85,
        }}>
          Tip: the <strong style={{ color: C.cream, fontStyle: "normal" }}>Sandboxx app</strong> is the easiest way to send letters fast.
          Save care packages for Pensacola — they're welcome there.
        </p>
      </div>

      {/* Closing */}
      <div style={{
        background: C.crimson, color: C.cream,
        padding: "30px 20px",
        textAlign: "center",
      }}>
        <Anchor size={32} color={C.brassBright} />
        <div style={{
          fontFamily: F.display, fontSize: 28, color: C.brassBright,
          letterSpacing: "0.04em", marginTop: 16,
        }}>
          AUDE ET EFFICE
        </div>
        <div style={{
          fontFamily: F.serif, fontStyle: "italic", fontSize: 13,
          color: C.cream, opacity: 0.85, marginTop: 6, marginBottom: 24,
          letterSpacing: "0.05em",
        }}>
          dare and do
        </div>

        <p style={{
          fontFamily: F.serif, fontSize: 15, lineHeight: 1.65,
          color: C.cream, margin: 0,
        }}>
          Welcome to the Navy family,<br/>
          <strong style={{ color: C.brassBright, fontFamily: F.display, fontSize: 22, letterSpacing: "0.05em" }}>
            CRIMI FAMILY.
          </strong>
        </p>

        <div style={{
          fontFamily: F.mono, fontSize: 11, color: C.brassBright,
          letterSpacing: "0.25em", marginTop: 18, opacity: 0.9,
        }}>
          IYAOYAS · ANCHORS AWEIGH
        </div>
        <div style={{
          fontFamily: F.serif, fontStyle: "italic", fontSize: 14,
          color: C.brassBright, marginTop: 14,
        }}>
          And — most importantly —<br/>
          welcome home, Anthony.
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  ROOT
// ============================================================
export default function App() {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (target) {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTarget(null);
    }
  }, [target]);

  return (
    <div style={{
      fontFamily: F.serif,
      color: C.ink,
      minHeight: "100vh",
      background: C.cream,
    }}>
      <GlobalStyles />
      <Hero />
      <DecoderGrid onOpen={setTarget} />
      <NineThirtyOneDeep />
      <ShipDeep />
      <AODeep />
      <PromotionDeep />
      <TimelineDeep />
      <DispatchesDeep />
      <GraduationDeep />
      <SailorLoreDeep />
      <FamousSailorsDeep />
      <PensacolaDeep />
      <WelcomeHome />
    </div>
  );
}
