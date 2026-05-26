import type { CSSProperties, ReactNode } from "react";

/* ---- UI glyphs (inherit currentColor) ---- */

interface GlyphProps {
  size?: number;
  style?: CSSProperties;
}

export function ChevronLeft({ size = 24, style }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchGlyph({ size = 18, style }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HeartGlyph({ size = 22, filled, style }: GlyphProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} style={style}>
      <path
        d="M12 21s-7.5-4.6-10-9.2C.6 9 1.6 5.5 4.8 4.7 7 4.1 9 5.2 12 8c3-2.8 5-3.9 7.2-3.3 3.2.8 4.2 4.3 2.8 7.1C19.5 16.4 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CommentGlyph({ size = 22, style }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M21 11.5a8.5 8.5 0 01-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1121 11.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneArrow({ size = 16, type, style }: GlyphProps & { type: "incoming" | "outgoing" | "missed" }) {
  const color = type === "missed" ? "var(--pui-error)" : "var(--pui-text-secondary)";
  const path = type === "outgoing" ? "M7 17L17 7M17 7H9M17 7v8" : "M17 7L7 17M7 17h8M7 17V9";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d={path} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---- App launcher icons ---- */

function IconTile({ children, bg }: { children: ReactNode; bg: string }) {
  return (
    <span
      style={{
        width: "100%",
        aspectRatio: "1",
        borderRadius: "22%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {children}
    </span>
  );
}

export function MessagesIcon() {
  return (
    <IconTile bg="linear-gradient(180deg,#5BF675,#2BB534)">
      <svg width="58%" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 3C6.5 3 2 6.7 2 11.2c0 2.4 1.3 4.6 3.4 6-.2 1-.8 2.3-1.6 3.1 1.6-.2 3.2-.8 4.3-1.6 1.2.4 2.5.6 3.9.6 5.5 0 10-3.7 10-8.1S17.5 3 12 3z" />
      </svg>
    </IconTile>
  );
}

export function PhotosIcon() {
  return (
    <IconTile bg="#0b1626">
      <svg width="74%" viewBox="0 0 48 48">
        {[
          ["#FFD200", 24, 8],
          ["#FF5E3D", 35, 14],
          ["#FF2D78", 35, 28],
          ["#7B5BFF", 24, 36],
          ["#1FB6FF", 13, 28],
          ["#34C759", 13, 14],
        ].map(([c, x, y], i) => (
          <circle key={i} cx={x as number} cy={y as number} r="7" fill={c as string} opacity="0.95" />
        ))}
      </svg>
    </IconTile>
  );
}

export function NotesIcon() {
  return (
    <IconTile bg="linear-gradient(180deg,#FEF1A8,#F4CB55)">
      <svg width="56%" viewBox="0 0 24 24" stroke="#7a5a00" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M6 7h12M6 12h12M6 17h7" />
      </svg>
    </IconTile>
  );
}

export function PhoneIcon() {
  return (
    <IconTile bg="linear-gradient(180deg,#5BF675,#2BB534)">
      <svg width="52%" viewBox="0 0 24 24" fill="#fff">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
      </svg>
    </IconTile>
  );
}

export function BrowserIcon() {
  return (
    <IconTile bg="#fff">
      <svg width="78%" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="#1A73E8" />
        <circle cx="24" cy="24" r="9" fill="#fff" />
        <circle cx="24" cy="24" r="7" fill="#1A73E8" />
        <path d="M24 15h17A20 20 0 0024 4v11z" fill="#EA4335" />
        <path d="M41 15A20 20 0 0124 44l8-15z" fill="#FBBC05" opacity="0.95" />
        <path d="M24 44A20 20 0 017 14l9 16z" fill="#34A853" opacity="0.95" />
      </svg>
    </IconTile>
  );
}

export function TinderIcon() {
  return (
    <IconTile bg="linear-gradient(180deg,#FF7854,#FD267D)">
      <svg width="50%" viewBox="0 0 24 24" fill="#fff">
        <path d="M13 2c0 3 3 4.5 4.5 7.5C19 12.5 19 15 18 17a6.5 6.5 0 11-12-3c.4-1 1-1.8 1.7-2.4-.2 1.2 0 2.4.9 3 .3-2.7 1.7-5.4 3.9-7.1C12 4 13 3 13 2z" />
      </svg>
    </IconTile>
  );
}

export function InstagramIcon() {
  return (
    <IconTile bg="radial-gradient(circle at 30% 107%,#FDF497 0%,#FDF497 5%,#FD5949 45%,#D6249F 60%,#285AEB 90%)">
      <svg width="58%" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" stroke="none" />
      </svg>
    </IconTile>
  );
}
