import { useEffect, useRef, useState } from "react";
import type { Photo, PhotosData } from "../types";
import { AppHeader } from "../components/AppHeader";
import { formatLongDate, parseDate } from "../lib/format";
import styles from "./Photos.module.css";

interface Props {
  data: PhotosData;
  onExit: () => void;
  /** Open straight into this photo (used by Spotlight search). */
  openItemId?: string;
}

/** Month heading label, e.g. "March 2024". */
function monthLabel(value?: string): string {
  const d = parseDate(value);
  if (!d) return "";
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

/** Group photos by month while preserving order; only used when dates exist. */
function groupByMonth(photos: Photo[]): { label: string; photos: Photo[] }[] {
  const groups: { label: string; photos: Photo[] }[] = [];
  for (const photo of photos) {
    const label = monthLabel(photo.date);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.photos.push(photo);
    } else {
      groups.push({ label, photos: [photo] });
    }
  }
  return groups;
}

export function Photos({ data, onExit, openItemId }: Props) {
  const [openId, setOpenId] = useState<string | null>(openItemId ?? null);
  const openIndex = openId ? data.photos.findIndex((p) => p.id === openId) : -1;

  if (openIndex >= 0) {
    return <Detail photos={data.photos} index={openIndex} onBack={() => setOpenId(null)} />;
  }

  if (data.photos.length === 0) {
    return (
      <div className={styles.screen}>
        <AppHeader title="Photos" large onBack={onExit} backLabel="Home" />
        <div className={styles.empty}>No Photos</div>
      </div>
    );
  }

  const hasDates = data.photos.some((p) => parseDate(p.date));

  return (
    <div className={styles.screen}>
      <AppHeader title="Photos" large onBack={onExit} backLabel="Home" />
      <div className={styles.body}>
        {hasDates ? (
          groupByMonth(data.photos).map((group, i) => (
            <section key={group.label || i}>
              {group.label && <h2 className={styles.heading}>{group.label}</h2>}
              <Grid photos={group.photos} onOpen={setOpenId} />
            </section>
          ))
        ) : (
          <Grid photos={data.photos} onOpen={setOpenId} />
        )}
      </div>
    </div>
  );
}

function Grid({ photos, onOpen }: { photos: Photo[]; onOpen: (id: string) => void }) {
  return (
    <div className={styles.grid}>
      {photos.map((p) => (
        <button
          key={p.id}
          type="button"
          className={styles.thumb}
          onClick={() => onOpen(p.id)}
        >
          <img className={styles.thumbImg} src={p.src} alt={p.caption ?? ""} />
        </button>
      ))}
    </div>
  );
}

function Detail({ photos, index, onBack }: { photos: Photo[]; index: number; onBack: () => void }) {
  const [i, setI] = useState(index);
  const touchX = useRef<number | null>(null);

  const photo = photos[i];
  const canPrev = i > 0;
  const canNext = i < photos.length - 1;
  const prev = () => canPrev && setI((n) => n - 1);
  const next = () => canNext && setI((n) => n + 1);

  // Arrow-key navigation while the detail view is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx > 50) prev();
    else if (dx < -50) next();
    touchX.current = null;
  };

  const date = formatLongDate(photo.date);
  return (
    <div className={`${styles.screen} ${styles.detailScreen}`}>
      <AppHeader
        onBack={onBack}
        backLabel="Photos"
        title={photos.length > 1 ? <span className={styles.counter}>{i + 1} of {photos.length}</span> : undefined}
      />
      <div className={styles.stage} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img className={styles.full} src={photo.src} alt={photo.caption ?? ""} />
        {canPrev && (
          <button type="button" className={`${styles.nav} ${styles.navLeft}`} onClick={prev} aria-label="Previous photo">
            ‹
          </button>
        )}
        {canNext && (
          <button type="button" className={`${styles.nav} ${styles.navRight}`} onClick={next} aria-label="Next photo">
            ›
          </button>
        )}
      </div>
      {(photo.caption || photo.location || date) && (
        <div className={styles.meta}>
          {photo.caption && <p className={styles.caption}>{photo.caption}</p>}
          {photo.location && <p className={styles.location}>{photo.location}</p>}
          {date && <p className={styles.date}>{date}</p>}
        </div>
      )}
    </div>
  );
}
