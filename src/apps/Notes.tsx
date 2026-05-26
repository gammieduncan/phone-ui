import { useState } from "react";
import type { Note, NotesData } from "../types";
import { AppHeader } from "../components/AppHeader";
import { formatDayLabel, formatLongDate, formatTime } from "../lib/format";
import styles from "./Notes.module.css";

interface Props {
  data: NotesData;
  onExit: () => void;
  /** Open straight into this note (used by Spotlight search). */
  openItemId?: string;
}

function noteTitle(note: Note): string {
  if (note.title?.trim()) return note.title;
  const firstLine = note.body.split("\n").find((l) => l.trim());
  return firstLine?.trim() ?? "New Note";
}

function noteSnippet(note: Note): string {
  const lines = note.body.split("\n").map((l) => l.trim()).filter(Boolean);
  // If the title came from the body's first line, skip it for the snippet.
  const rest = note.title?.trim() ? lines : lines.slice(1);
  return rest.join(" ");
}

export function Notes({ data, onExit, openItemId }: Props) {
  const [openId, setOpenId] = useState<string | null>(openItemId ?? null);
  const note = data.notes.find((n) => n.id === openId) ?? null;

  if (note) return <Detail note={note} onBack={() => setOpenId(null)} />;

  const sorted = [...data.notes].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const pinned = sorted.filter((n) => n.pinned);
  const others = sorted.filter((n) => !n.pinned);

  return (
    <div className={styles.screen}>
      <AppHeader title="Notes" large onBack={onExit} backLabel="Home" />
      {data.notes.length === 0 ? (
        <div className={styles.empty}>No Notes</div>
      ) : (
        <div className={styles.list}>
          {pinned.length > 0 && (
            <>
              <h2 className={styles.section}>Pinned</h2>
              <ul className={styles.group}>
                {pinned.map((n) => (
                  <NoteRow key={n.id} note={n} onOpen={() => setOpenId(n.id)} />
                ))}
              </ul>
            </>
          )}
          {others.length > 0 && (
            <>
              {pinned.length > 0 && <h2 className={styles.section}>Notes</h2>}
              <ul className={styles.group}>
                {others.map((n) => (
                  <NoteRow key={n.id} note={n} onOpen={() => setOpenId(n.id)} />
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function NoteRow({ note, onOpen }: { note: Note; onOpen: () => void }) {
  return (
    <li className={styles.row} onClick={onOpen}>
      <span className={styles.title}>{noteTitle(note)}</span>
      <p className={styles.preview}>
        <span className={styles.when}>{formatDayLabel(note.date)}</span>
        <span className={styles.snippet}>{noteSnippet(note) || "No additional text"}</span>
      </p>
    </li>
  );
}

function Detail({ note, onBack }: { note: Note; onBack: () => void }) {
  return (
    <div className={styles.screen}>
      <AppHeader onBack={onBack} backLabel="Notes" />
      <div className={styles.detail}>
        <h1 className={styles.detailTitle}>{noteTitle(note)}</h1>
        <div className={styles.detailDate}>
          {formatLongDate(note.date)} at {formatTime(note.date)}
        </div>
        <div className={styles.body}>{note.body}</div>
      </div>
    </div>
  );
}
