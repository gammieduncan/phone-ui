import { colorFromString, initials } from "../lib/format";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  /** Square (rounded) instead of circular. */
  square?: boolean;
}

/** Image avatar with graceful initials fallback. */
export function Avatar({ name, src, size = 40, square }: AvatarProps) {
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.4,
    borderRadius: square ? size * 0.28 : "50%",
  } as const;

  if (src) {
    return (
      <img
        className={styles.avatar}
        style={style}
        src={src}
        alt={name}
        loading="lazy"
      />
    );
  }
  return (
    <span
      className={styles.fallback}
      style={{ ...style, background: colorFromString(name) }}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
