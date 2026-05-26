import { useState } from "react";
import type { TinderData, TinderProfile } from "../types";
import { Avatar } from "../components/Avatar";
import { AppHeader } from "../components/AppHeader";
import { HeartGlyph } from "../components/icons";
import styles from "./Tinder.module.css";

interface Props {
  data: TinderData;
  onExit: () => void;
  /** Open straight to this profile (used by Spotlight search). */
  openItemId?: string;
}

type View = "deck" | "matches";

export function Tinder({ data, onExit, openItemId }: Props) {
  const deckIndex = openItemId ? data.deck.findIndex((p) => p.id === openItemId) : -1;
  const isMatchOnly = openItemId != null && deckIndex < 0;
  const [view, setView] = useState<View>(isMatchOnly ? "matches" : "deck");
  const hasMatches = !!data.matches?.length;

  return (
    <div className={styles.screen}>
      <AppHeader
        onBack={onExit}
        backLabel="Home"
        title={<span className={styles.brand}>tinder</span>}
        right={
          hasMatches ? (
            <button
              type="button"
              className={styles.tabToggle}
              onClick={() => setView((v) => (v === "deck" ? "matches" : "deck"))}
            >
              {view === "deck" ? "Matches" : "Discover"}
            </button>
          ) : undefined
        }
      />
      {view === "matches" && hasMatches ? (
        <Matches data={data} />
      ) : (
        <Deck data={data} startIndex={deckIndex > 0 ? deckIndex : 0} />
      )}
    </div>
  );
}

function Deck({ data, startIndex = 0 }: { data: TinderData; startIndex?: number }) {
  const [deckIndex, setDeckIndex] = useState(startIndex);
  const profile = data.deck[deckIndex] as TinderProfile | undefined;

  if (!profile) {
    return (
      <div className={styles.deck}>
        <p className={styles.empty}>No more profiles</p>
      </div>
    );
  }

  const advance = () => setDeckIndex((i) => i + 1);

  return (
    <div className={styles.deck}>
      <Card key={profile.id} profile={profile} />
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.action} ${styles.nope}`}
          onClick={advance}
          aria-label="Nope"
        >
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className={`${styles.action} ${styles.like}`}
          onClick={advance}
          aria-label="Like"
        >
          <HeartGlyph size={30} filled />
        </button>
      </div>
    </div>
  );
}

function Card({ profile }: { profile: TinderProfile }) {
  const photos = profile.photos ?? [];
  const [photoIndex, setPhotoIndex] = useState(0);
  const hasPhotos = photos.length > 0;
  const current = hasPhotos ? photos[Math.min(photoIndex, photos.length - 1)] : undefined;

  const prevPhoto = () => setPhotoIndex((i) => Math.max(0, i - 1));
  const nextPhoto = () => setPhotoIndex((i) => Math.min(photos.length - 1, i + 1));

  return (
    <div className={styles.card}>
      <div
        className={styles.photo}
        style={current ? { backgroundImage: `url(${current})` } : undefined}
      >
        {photos.length > 1 && (
          <div className={styles.segments}>
            {photos.map((_, i) => (
              <span
                key={i}
                className={`${styles.segment} ${i === photoIndex ? styles.segmentOn : ""}`}
              />
            ))}
          </div>
        )}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.tapZone} ${styles.tapLeft}`}
              onClick={prevPhoto}
              aria-label="Previous photo"
            />
            <button
              type="button"
              className={`${styles.tapZone} ${styles.tapRight}`}
              onClick={nextPhoto}
              aria-label="Next photo"
            />
          </>
        )}
        <div className={styles.overlay}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{profile.name}</span>
            {profile.age != null && <span className={styles.age}>{profile.age}</span>}
          </div>
          {profile.jobTitle && <p className={styles.job}>{profile.jobTitle}</p>}
          {profile.distance && <p className={styles.distance}>{profile.distance}</p>}
        </div>
      </div>
    </div>
  );
}

function Matches({ data }: { data: TinderData }) {
  const matches = data.matches ?? [];
  return (
    <ul className={styles.list}>
      {matches.map((m) => (
        <li key={m.profile.id} className={styles.matchRow}>
          <Avatar name={m.profile.name} src={m.profile.photos?.[0]} size={50} />
          <div className={styles.matchBody}>
            <span className={styles.matchName}>{m.profile.name}</span>
            <p className={styles.matchPreview}>
              {m.lastMessage ?? "You matched! Say hello."}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
