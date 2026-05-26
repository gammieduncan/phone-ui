import type { CallRecord, CallsData } from "../types";
import { Avatar } from "../components/Avatar";
import { AppHeader } from "../components/AppHeader";
import { PhoneArrow } from "../components/icons";
import { formatDayLabel, formatDuration } from "../lib/format";
import styles from "./Calls.module.css";

interface Props {
  data: CallsData;
  onExit: () => void;
}

const TYPE_LABEL: Record<CallRecord["type"], string> = {
  incoming: "Incoming",
  outgoing: "Outgoing",
  missed: "Missed",
};

export function Calls({ data, onExit }: Props) {
  const calls = [...data.calls].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className={styles.screen}>
      <AppHeader title="Recents" large onBack={onExit} backLabel="Home" />
      {calls.length === 0 ? (
        <div className={styles.empty}>No Recent Calls</div>
      ) : (
        <ul className={styles.list}>
          {calls.map((c) => {
            const missed = c.type === "missed";
            const duration = formatDuration(c.durationSeconds);
            return (
              <li key={c.id} className={styles.row}>
                <Avatar name={c.contact.name} src={c.contact.avatar} size={40} />
                <div className={styles.rowBody}>
                  <span className={`${styles.name} ${missed ? styles.missed : ""}`}>
                    {c.contact.name}
                  </span>
                  <span className={styles.sub}>
                    <PhoneArrow type={c.type} size={14} />
                    {TYPE_LABEL[c.type]}
                  </span>
                </div>
                <div className={styles.meta}>
                  <span className={styles.when}>{formatDayLabel(c.timestamp)}</span>
                  {duration && <span className={styles.duration}>{duration}</span>}
                </div>
                <span className={styles.info} aria-hidden="true">
                  &#9432;
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
