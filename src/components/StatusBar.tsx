import styles from "./StatusBar.module.css";

interface StatusBarProps {
  time?: string;
  /** Use dark glyphs (for light app backgrounds). */
  dark?: boolean;
}

/** iOS-style status bar: time on the left, signal/wifi/battery on the right. */
export function StatusBar({ time = "9:41", dark }: StatusBarProps) {
  return (
    <div className={`${styles.bar} ${dark ? styles.dark : ""}`}>
      <span className={styles.time}>{time}</span>
      <span className={styles.icons}>
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.5} y={8 - i * 2.4} width="3" height={4 + i * 2.4} rx="1" />
          ))}
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 11.5l2-2.6a3 3 0 00-4 0l2 2.6zM8 4a8 8 0 015.6 2.3l-1.4 1.5A6 6 0 008 6a6 6 0 00-4.2 1.8L2.4 6.3A8 8 0 018 4z" />
        </svg>
        {/* battery */}
        <span className={styles.battery}>
          <span className={styles.batteryLevel} />
        </span>
      </span>
    </div>
  );
}
