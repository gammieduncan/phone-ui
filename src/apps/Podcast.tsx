import { useEffect, useMemo, useRef, useState } from "react";
import type { PodcastData, PodcastEpisode } from "../types";
import { AppHeader } from "../components/AppHeader";
import { PlayGlyph } from "../components/icons";
import { formatDuration, formatLongDate } from "../lib/format";
import styles from "./Podcast.module.css";

interface Props {
  data: PodcastData;
  onExit: () => void;
  /** Open straight into this episode (used by Spotlight search). */
  openItemId?: string;
}

/* ------------------------------------------------------------------ RSS ---- */

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/gi, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&#x2019;/gi, "’")
    .replace(/&#8230;/g, "…");
}

function stripHtml(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** "2795" or "46:35" or "1:02:03" -> seconds. */
function parseDuration(s?: string | null): number | undefined {
  if (!s) return undefined;
  const t = s.trim();
  if (t.includes(":")) {
    return t.split(":").reduce((acc, p) => acc * 60 + Number(p || 0), 0);
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

/** Parse a podcast RSS document into PodcastData, merging any provided overrides. */
function parseFeed(xml: string, overrides: PodcastData): PodcastData {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const channel = doc.querySelector("channel");
  if (!channel) throw new Error("No <channel> in feed");

  const childText = (el: Element, tag: string) =>
    Array.from(el.children).find((c) => c.tagName.toLowerCase() === tag)?.textContent?.trim();

  const channelImg =
    Array.from(channel.children)
      .find((c) => c.tagName.toLowerCase() === "itunes:image")
      ?.getAttribute("href") || channel.querySelector("image > url")?.textContent?.trim();

  const items = Array.from(channel.getElementsByTagName("item"));
  const episodes: PodcastEpisode[] = items.map((item, i) => {
    const title = decodeEntities(item.querySelector("title")?.textContent ?? "Untitled");
    const audioUrl = item.querySelector("enclosure")?.getAttribute("url") ?? "";
    const guid = item.querySelector("guid")?.textContent?.trim();
    const itemImg = item
      .getElementsByTagName("itunes:image")[0]
      ?.getAttribute("href");
    const descRaw = item.querySelector("description")?.textContent ?? "";
    return {
      id: slugify(guid || title || String(i)) || `ep-${i}`,
      title: title.trim(),
      audioUrl,
      date: item.querySelector("pubDate")?.textContent?.trim() || undefined,
      description: stripHtml(descRaw) || undefined,
      durationSeconds: parseDuration(item.getElementsByTagName("itunes:duration")[0]?.textContent),
      artwork: itemImg || overrides.artwork || channelImg || undefined,
    };
  });

  return {
    feedUrl: overrides.feedUrl,
    showName: overrides.showName || childText(channel, "title") || "Podcast",
    author:
      overrides.author ||
      channel.getElementsByTagName("itunes:author")[0]?.textContent?.trim(),
    artwork: overrides.artwork || channelImg || undefined,
    description:
      overrides.description ||
      stripHtml(childText(channel, "description") ?? "") ||
      undefined,
    subscribeUrl: overrides.subscribeUrl,
    episodes: episodes.filter((e) => e.audioUrl),
  };
}

/* --------------------------------------------------------------- The app --- */

type LoadState = "idle" | "loading" | "error";

export function Podcast({ data, onExit, openItemId }: Props) {
  const hasStatic = !!data.episodes?.length;
  const [resolved, setResolved] = useState<PodcastData | null>(hasStatic ? data : null);
  const [load, setLoad] = useState<LoadState>(hasStatic || !data.feedUrl ? "idle" : "loading");

  // Fetch + parse the RSS feed when one is provided and no static episodes.
  useEffect(() => {
    if (hasStatic || !data.feedUrl) return;
    let cancelled = false;
    setLoad("loading");
    fetch(data.feedUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((xml) => {
        if (cancelled) return;
        setResolved(parseFeed(xml, data));
        setLoad("idle");
      })
      .catch(() => !cancelled && setLoad("error"));
    return () => {
      cancelled = true;
    };
  }, [data, hasStatic]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [openId, setOpenId] = useState<string | null>(openItemId ?? null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const episodes = useMemo(() => resolved?.episodes ?? [], [resolved]);
  const current = episodes.find((e) => e.id === currentId) ?? null;
  const open = episodes.find((e) => e.id === openId) ?? null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = (ep: PodcastEpisode) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentId === ep.id) {
      if (audio.paused) void audio.play();
      else audio.pause();
      return;
    }
    audio.src = ep.audioUrl;
    audio.currentTime = 0;
    setCurrentId(ep.id);
    setTime(0);
    setDuration(ep.durationSeconds ?? 0);
    void audio.play();
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = seconds;
    setTime(seconds);
  };

  const art = (ep: PodcastEpisode | null) => ep?.artwork || resolved?.artwork;

  // Loading / error states (feed-backed).
  if (!resolved) {
    return (
      <div className={styles.screen}>
        <AppHeader title="Podcasts" large onBack={onExit} backLabel="Home" />
        <div className={styles.notice}>
          {load === "error" ? "Couldn't load the feed." : "Loading episodes…"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      {open ? (
        <Detail
          ep={open}
          showArt={resolved.artwork}
          playing={playing && currentId === open.id}
          time={currentId === open.id ? time : 0}
          duration={currentId === open.id ? duration : open.durationSeconds ?? 0}
          onBack={() => setOpenId(null)}
          onToggle={() => toggle(open)}
          onSeek={seek}
        />
      ) : (
        <>
          <AppHeader title="Podcasts" large onBack={onExit} backLabel="Home" />
          <div className={styles.list}>
            <div className={styles.show}>
              {resolved.artwork && (
                <img className={styles.showArt} src={resolved.artwork} alt={resolved.showName} />
              )}
              <div className={styles.showMeta}>
                <h2 className={styles.showName}>{resolved.showName}</h2>
                {resolved.author && <p className={styles.showAuthor}>{resolved.author}</p>}
                {resolved.subscribeUrl && (
                  <a
                    className={styles.subscribe}
                    href={resolved.subscribeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Subscribe
                  </a>
                )}
              </div>
            </div>
            {resolved.description && <p className={styles.showDesc}>{resolved.description}</p>}

            <h3 className={styles.sectionTitle}>
              Episodes <span className={styles.count}>{episodes.length}</span>
            </h3>
            <ul className={styles.episodes}>
              {episodes.map((ep) => (
                <li key={ep.id} className={styles.episode}>
                  <button
                    type="button"
                    className={styles.play}
                    onClick={() => toggle(ep)}
                    aria-label={currentId === ep.id && playing ? "Pause" : "Play"}
                  >
                    <PlayGlyph size={20} paused={!(currentId === ep.id && playing)} />
                  </button>
                  <button type="button" className={styles.epBody} onClick={() => setOpenId(ep.id)}>
                    {ep.episodeLabel && <span className={styles.epLabel}>{ep.episodeLabel}</span>}
                    <span className={styles.epTitle}>{ep.title}</span>
                    {ep.guest && <span className={styles.epGuest}>{ep.guest}</span>}
                    <span className={styles.epMeta}>
                      {[formatLongDate(ep.date), formatDuration(ep.durationSeconds)]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {current && (
            <button
              type="button"
              className={styles.miniBar}
              onClick={() => setOpenId(current.id)}
            >
              {art(current) && <img className={styles.miniArt} src={art(current)} alt="" />}
              <span className={styles.miniTitle}>{current.title}</span>
              <span
                className={styles.miniPlay}
                role="button"
                tabIndex={0}
                aria-label={playing ? "Pause" : "Play"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(current);
                }}
              >
                <PlayGlyph size={22} paused={!playing} />
              </span>
            </button>
          )}
        </>
      )}

      <audio ref={audioRef} preload="none" />
    </div>
  );
}

function Detail({
  ep,
  showArt,
  playing,
  time,
  duration,
  onBack,
  onToggle,
  onSeek,
}: {
  ep: PodcastEpisode;
  showArt?: string;
  playing: boolean;
  time: number;
  duration: number;
  onBack: () => void;
  onToggle: () => void;
  onSeek: (s: number) => void;
}) {
  const art = ep.artwork || showArt;
  return (
    <div className={styles.detail}>
      <AppHeader onBack={onBack} backLabel="Podcasts" />
      <div className={styles.detailBody}>
        {art && <img className={styles.detailArt} src={art} alt={ep.title} />}
        {ep.episodeLabel && <span className={styles.epLabel}>{ep.episodeLabel}</span>}
        <h1 className={styles.detailTitle}>{ep.title}</h1>
        {ep.guest && <p className={styles.detailGuest}>{ep.guest}</p>}

        <div className={styles.player}>
          <button type="button" className={styles.bigPlay} onClick={onToggle}>
            <PlayGlyph size={30} paused={!playing} />
          </button>
          <div className={styles.scrubWrap}>
            <input
              className={styles.scrub}
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={Math.min(time, duration || 0)}
              onChange={(e) => onSeek(Number(e.target.value))}
            />
            <div className={styles.times}>
              <span>{formatDuration(Math.floor(time))}</span>
              <span>-{formatDuration(Math.max(0, Math.floor((duration || 0) - time)))}</span>
            </div>
          </div>
        </div>

        {ep.date && <p className={styles.detailDate}>{formatLongDate(ep.date)}</p>}
        {ep.description && <p className={styles.detailDesc}>{ep.description}</p>}
      </div>
    </div>
  );
}
