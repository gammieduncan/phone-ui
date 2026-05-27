import { useState } from "react";
import type { ChatThread, MessagesData } from "../types";
import { Avatar } from "../components/Avatar";
import { AppHeader } from "../components/AppHeader";
import { formatDayLabel, formatTime } from "../lib/format";
import styles from "./Messages.module.css";

interface Props {
  data: MessagesData;
  onExit: () => void;
  /** Open straight into this chat (used by Spotlight search). */
  openItemId?: string;
}

export function Messages({ data, onExit, openItemId }: Props) {
  const [openId, setOpenId] = useState<string | null>(openItemId ?? null);
  const chat = data.chats.find((c) => c.id === openId) ?? null;

  if (chat) return <Thread chat={chat} onBack={() => setOpenId(null)} />;

  return (
    <div className={styles.screen}>
      <AppHeader title="Messages" large onBack={onExit} backLabel="Home" />
      <ul className={styles.list}>
        {data.chats.map((c) => {
          const last = c.messages[c.messages.length - 1];
          return (
            <li key={c.id} className={styles.row} onClick={() => setOpenId(c.id)}>
              <Avatar name={c.contact.name} src={c.contact.avatar} size={50} />
              <div className={styles.rowBody}>
                <div className={styles.rowTop}>
                  <span className={styles.name}>{c.contact.name}</span>
                  <span className={styles.when}>{formatDayLabel(last?.timestamp)}</span>
                </div>
                <p className={styles.preview}>
                  {last?.attachments?.length && !last.text ? "📎 Attachment" : last?.text}
                </p>
              </div>
              {!!c.unread && <span className={styles.badge}>{c.unread}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Thread({ chat, onBack }: { chat: ChatThread; onBack: () => void }) {
  const [viewer, setViewer] = useState<string | null>(null);
  return (
    <div className={styles.screen}>
      <AppHeader
        onBack={onBack}
        title={
          <span className={styles.threadTitle}>
            <Avatar name={chat.contact.name} src={chat.contact.avatar} size={28} />
            {chat.contact.name}
          </span>
        }
      />
      <div className={styles.thread}>
        {chat.messages.map((m, i) => {
          const prev = chat.messages[i - 1];
          const showTime = !prev || new Date(m.timestamp).getTime() - new Date(prev.timestamp).getTime() > 30 * 60 * 1000;
          const isLast = i === chat.messages.length - 1;
          return (
            <div key={m.id}>
              {showTime && <div className={styles.stamp}>{formatDayLabel(m.timestamp)} {formatTime(m.timestamp)}</div>}
              <div className={`${styles.bubbleRow} ${m.direction === "out" ? styles.out : styles.in}`}>
                <div className={styles.bubble}>
                  {m.attachments?.map((a, j) =>
                    a.type === "image" ? (
                      <button
                        key={j}
                        type="button"
                        className={styles.attachImgBtn}
                        onClick={() => setViewer(a.url)}
                      >
                        <img className={styles.attachImg} src={a.url} alt={a.label ?? ""} />
                      </button>
                    ) : (
                      <a key={j} className={styles.attachLink} href={a.url} target="_blank" rel="noreferrer">
                        {a.label ?? a.url}
                      </a>
                    ),
                  )}
                  {m.text && <span>{m.text}</span>}
                </div>
              </div>
              {isLast && m.direction === "out" && m.status && (
                <div className={styles.status}>{m.status === "read" ? "Read" : m.status === "delivered" ? "Delivered" : "Sent"}</div>
              )}
            </div>
          );
        })}
      </div>
      {viewer && (
        <div className={styles.lightbox} onClick={() => setViewer(null)}>
          <button type="button" className={styles.lightboxClose} aria-label="Close">×</button>
          <img className={styles.lightboxImg} src={viewer} alt="" />
        </div>
      )}
    </div>
  );
}
