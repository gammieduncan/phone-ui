import type { ReactNode } from "react";
import { ChevronLeft } from "./icons";
import styles from "./AppHeader.module.css";

interface AppHeaderProps {
  title?: ReactNode;
  /** Back affordance. If omitted, no back button is shown. */
  onBack?: () => void;
  backLabel?: string;
  right?: ReactNode;
  /** Light header (dark text) for light app backgrounds. */
  light?: boolean;
  large?: boolean;
}

/** Navigation bar used at the top of every app screen. */
export function AppHeader({ title, onBack, backLabel, right, light, large }: AppHeaderProps) {
  return (
    <header className={`${styles.header} ${light ? styles.light : ""}`}>
      <div className={styles.row}>
        <div className={styles.side}>
          {onBack && (
            <button type="button" className={styles.back} onClick={onBack}>
              <ChevronLeft size={26} />
              {backLabel && <span>{backLabel}</span>}
            </button>
          )}
        </div>
        {!large && <div className={styles.title}>{title}</div>}
        <div className={`${styles.side} ${styles.right}`}>{right}</div>
      </div>
      {large && <h1 className={styles.largeTitle}>{title}</h1>}
    </header>
  );
}
