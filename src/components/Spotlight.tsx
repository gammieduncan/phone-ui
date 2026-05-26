import { useMemo, useRef, useState, useEffect } from "react";
import type { AppId, PhoneApps } from "../types";
import { searchApps } from "../lib/search";
import { APP_REGISTRY } from "../apps/registry";
import { SearchGlyph } from "./icons";
import styles from "./Spotlight.module.css";

interface SpotlightProps {
  apps: PhoneApps;
  onOpen: (appId: AppId, itemId?: string) => void;
  onClose: () => void;
  /** Pre-fill the search field. */
  initialQuery?: string;
}

/** iOS Spotlight-style search across all app content. */
export function Spotlight({ apps, onOpen, onClose, initialQuery = "" }: SpotlightProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => searchApps(apps, query), [apps, query]);

  // Group results by category, preserving insertion order.
  const groups = useMemo(() => {
    const map = new Map<string, typeof results>();
    for (const r of results) {
      const list = map.get(r.category) ?? [];
      list.push(r);
      map.set(r.category, list);
    }
    return [...map.entries()];
  }, [results]);

  return (
    <div className={styles.overlay}>
      <div className={styles.bar}>
        <SearchGlyph size={17} />
        <input
          ref={inputRef}
          className={styles.input}
          value={query}
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        />
        <button type="button" className={styles.cancel} onClick={onClose}>
          Cancel
        </button>
      </div>

      <div className={styles.results}>
        {query.trim() === "" ? (
          <p className={styles.hint}>Search messages, notes, photos, history and more.</p>
        ) : groups.length === 0 ? (
          <p className={styles.hint}>No Results</p>
        ) : (
          groups.map(([category, items]) => (
            <section key={category} className={styles.group}>
              <h3 className={styles.groupTitle}>{category}</h3>
              <ul className={styles.list}>
                {items.map((r) => {
                  const Icon = APP_REGISTRY[r.appId].Icon;
                  return (
                    <li key={r.key}>
                      <button
                        type="button"
                        className={styles.row}
                        onClick={() => onOpen(r.appId, r.itemId)}
                      >
                        <span className={styles.rowIcon}>
                          <Icon />
                        </span>
                        <span className={styles.rowBody}>
                          <span className={styles.rowTitle}>{r.title}</span>
                          {r.subtitle && <span className={styles.rowSub}>{r.subtitle}</span>}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
