import { useMemo, useState } from "react";
import type { BrowserData, BrowserVisit } from "../types";
import { AppHeader } from "../components/AppHeader";
import { SearchGlyph } from "../components/icons";
import { colorFromString, formatDayLabel, formatTime, hostnameOf } from "../lib/format";
import styles from "./Browser.module.css";

interface Props {
  data: BrowserData;
  onExit: () => void;
}

/** Day bucket key (local) for grouping visits. */
function dayKey(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function Browser({ data, onExit }: Props) {
  const engine = data.engine ?? "Chrome";
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = data.history.filter((v) => {
      if (!q) return true;
      return (
        v.title.toLowerCase().includes(q) ||
        v.url.toLowerCase().includes(q) ||
        hostnameOf(v.url).toLowerCase().includes(q)
      );
    });
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    const out: { key: string; label: string; visits: BrowserVisit[] }[] = [];
    for (const v of sorted) {
      const key = dayKey(v.timestamp);
      const last = out[out.length - 1];
      if (last && last.key === key) last.visits.push(v);
      else out.push({ key, label: formatDayLabel(v.timestamp), visits: [v] });
    }
    return out;
  }, [data.history, query]);

  return (
    <div className={styles.screen}>
      <AppHeader title={`${engine} History`} large onBack={onExit} backLabel="Home" />

      <div className={styles.searchWrap}>
        <div className={styles.search}>
          <SearchGlyph size={16} style={{ color: "var(--pui-text-secondary)" }} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search history"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {groups.length === 0 ? (
        <div className={styles.empty}>No History</div>
      ) : (
        <div className={styles.list}>
          {groups.map((g) => (
            <section key={g.key}>
              <h2 className={styles.dayHeading}>{g.label}</h2>
              {g.visits.map((v) => {
                const host = hostnameOf(v.url);
                return (
                  <a
                    key={v.id}
                    className={styles.row}
                    href={v.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {v.favicon ? (
                      <img className={styles.favicon} src={v.favicon} alt="" />
                    ) : (
                      <span
                        className={styles.tile}
                        style={{ background: colorFromString(host) }}
                      >
                        {host.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className={styles.rowBody}>
                      <span className={styles.title}>{v.title}</span>
                      <span className={styles.sub}>
                        {host} · {formatTime(v.timestamp)}
                      </span>
                    </div>
                  </a>
                );
              })}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
