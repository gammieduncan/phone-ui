import { useMemo, useState } from "react";
import type { AppId, PhoneProps } from "../types";
import { APP_REGISTRY, DEFAULT_ORDER } from "../apps/registry";
import { StatusBar } from "./StatusBar";
import { SearchGlyph } from "./icons";
import { Spotlight } from "./Spotlight";
import styles from "./Phone.module.css";
import "../theme.css";

/**
 * A realistic, data-driven phone. Pass per-app data via `apps`; only apps with
 * data are shown. Tap an icon to open an app, use its back button to return home.
 */
export function Phone({
  apps,
  owner,
  wallpaper,
  statusTime = "9:41",
  initialApp,
  initialSearch,
  grid,
  dock,
  appOrder,
  className,
  frameless,
}: PhoneProps) {
  const [open, setOpen] = useState<AppId | null>(initialApp ?? null);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [searching, setSearching] = useState(initialSearch != null);

  const goHome = () => {
    setOpen(null);
    setTarget(undefined);
  };

  const openApp = (id: AppId, itemId?: string) => {
    setTarget(itemId);
    setOpen(id);
    setSearching(false);
  };

  // Layout resolution (all explicit, all optional):
  //  - `grid` (or legacy `appOrder`): which apps appear on the home grid, in order.
  //  - `dock`: which apps appear in the bottom dock, in order.
  //  An app is only shown if it both appears in a layout list and has data.
  //  With no props, defaults reproduce a sensible iOS-like layout.
  const gridSpec = grid ?? appOrder;
  const { gridApps, dockApps } = useMemo(() => {
    const registryDock = Object.values(APP_REGISTRY)
      .filter((d) => d.dock !== undefined)
      .sort((a, b) => a.dock! - b.dock!)
      .map((d) => d.id);

    // Default dock excludes anything the caller explicitly placed on the grid.
    const dockList = dock ?? registryDock.filter((id) => !(gridSpec ?? []).includes(id));
    const gridList = gridSpec ?? DEFAULT_ORDER;

    const resolve = (ids: AppId[]) =>
      ids.map((id) => APP_REGISTRY[id]).filter((def) => def && def.has(apps));

    const dockApps = resolve(dockList).slice(0, 4);
    const dockIds = new Set(dockApps.map((d) => d.id));
    const gridApps = resolve(gridList).filter((d) => !dockIds.has(d.id));
    return { gridApps, dockApps };
  }, [apps, gridSpec, dock]);

  const openDef = open ? APP_REGISTRY[open] : null;
  const wallpaperStyle = wallpaper
    ? wallpaper.includes("(") || wallpaper.includes("gradient")
      ? wallpaper
      : `center / cover no-repeat url("${wallpaper}")`
    : undefined;

  const screen = (
    <div className={styles.screen} style={openDef ? undefined : { background: wallpaperStyle }}>
      <StatusBar time={statusTime} />
      {openDef ? (
        <div className={styles.appRoot}>{openDef.render(apps, goHome, target)}</div>
      ) : (
        <div className={styles.home}>
          <button type="button" className={styles.search} onClick={() => setSearching(true)}>
            <SearchGlyph size={16} />
            <span>Search</span>
          </button>
          <div className={styles.grid}>
            {gridApps.map((def) => (
              <AppButton key={def.id} label={def.label} onClick={() => setOpen(def.id)}>
                <def.Icon />
              </AppButton>
            ))}
          </div>
          {owner && (
            <div className={styles.owner}>
              {owner.name}
            </div>
          )}
          {dockApps.length > 0 && (
            <div className={styles.dock}>
              {dockApps.map((def) => (
                <AppButton key={def.id} onClick={() => setOpen(def.id)}>
                  <def.Icon />
                </AppButton>
              ))}
            </div>
          )}
        </div>
      )}
      {searching && !openDef && (
        <Spotlight
          apps={apps}
          initialQuery={initialSearch}
          onOpen={openApp}
          onClose={() => setSearching(false)}
        />
      )}
      <div className={styles.homeIndicator} onClick={goHome} />
    </div>
  );

  if (frameless) {
    return (
      <div className={`pui-root ${styles.frameless} ${className ?? ""}`}>{screen}</div>
    );
  }

  return (
    <div className={`pui-root ${styles.device} ${className ?? ""}`}>
      <div className={styles.notch} />
      {screen}
    </div>
  );
}

function AppButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={styles.appButton} onClick={onClick}>
      <span className={styles.appIcon}>{children}</span>
      {label && <span className={styles.appLabel}>{label}</span>}
    </button>
  );
}
