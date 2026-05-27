/**
 * Data models for phone-ui. Every app is fully driven by these typed structures —
 * pass your own data in and the UI renders it. All content fields are optional-friendly
 * so you can populate as much or as little as you like.
 */

export type ISODateString = string; // e.g. "2024-03-14T09:30:00Z" or any Date-parseable string

/** A person referenced across apps (message threads, calls, etc.). */
export interface Contact {
  id: string;
  name: string;
  /** Image URL or data URI. Falls back to initials if omitted. */
  avatar?: string;
  phoneNumber?: string;
}

/* ------------------------------------------------------------------ Messages */

export interface MessageAttachment {
  type: "image" | "link";
  url: string;
  /** For links: preview title. For images: alt text. */
  label?: string;
}

export interface Message {
  id: string;
  text?: string;
  timestamp: ISODateString;
  /** "out" = sent by the phone owner, "in" = received. */
  direction: "in" | "out";
  attachments?: MessageAttachment[];
  /** Optional delivery state shown under the last outgoing bubble. */
  status?: "sent" | "delivered" | "read";
}

export interface ChatThread {
  id: string;
  contact: Contact;
  messages: Message[];
  /** Force unread badge count; if omitted it is inferred as 0. */
  unread?: number;
}

export interface MessagesData {
  chats: ChatThread[];
}

/* -------------------------------------------------------------------- Photos */

export interface Photo {
  id: string;
  src: string;
  date?: ISODateString;
  caption?: string;
  /** Optional location string shown in the photo detail view. */
  location?: string;
}

export interface PhotosData {
  photos: Photo[];
}

/* --------------------------------------------------------------------- Notes */

export interface Note {
  id: string;
  title?: string;
  body: string;
  date: ISODateString;
  pinned?: boolean;
}

export interface NotesData {
  notes: Note[];
}

/* --------------------------------------------------------------------- Calls */

export interface CallRecord {
  id: string;
  contact: Contact;
  type: "incoming" | "outgoing" | "missed";
  timestamp: ISODateString;
  /** Duration in seconds (omit for missed calls). */
  durationSeconds?: number;
}

export interface CallsData {
  calls: CallRecord[];
}

/* ----------------------------------------------------------- Browser history */

export interface BrowserVisit {
  id: string;
  title: string;
  url: string;
  timestamp: ISODateString;
  /** Optional favicon URL; falls back to a generated letter tile. */
  favicon?: string;
}

export interface BrowserData {
  /** Engine label shown in the omnibox/header, e.g. "Chrome". */
  engine?: string;
  history: BrowserVisit[];
}

/* -------------------------------------------------------------------- Tinder */

export interface TinderProfile {
  id: string;
  name: string;
  age?: number;
  bio?: string;
  photos: string[];
  /** e.g. "2 miles away" */
  distance?: string;
  jobTitle?: string;
}

export interface TinderMatch {
  profile: TinderProfile;
  matchedAt: ISODateString;
  lastMessage?: string;
}

export interface TinderData {
  /** The owner's own profile (optional). */
  me?: TinderProfile;
  /** The stack of profiles to swipe through. */
  deck: TinderProfile[];
  matches?: TinderMatch[];
}

/* ----------------------------------------------------------------- Instagram */

export interface IgComment {
  id: string;
  username: string;
  avatar?: string;
  text: string;
  timestamp?: ISODateString;
  likes?: number;
}

export interface IgPost {
  id: string;
  /** One or more image URLs (carousel if more than one). */
  images: string[];
  caption?: string;
  likes?: number;
  timestamp?: ISODateString;
  comments?: IgComment[];
  location?: string;
}

export interface IgAccount {
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  postsCount?: number;
  followers?: number;
  following?: number;
}

export interface InstagramData {
  profile: IgAccount;
  posts: IgPost[];
  /** Posts shown in the home feed (from accounts the owner follows). */
  feed?: IgPost[];
  searchHistory?: string[];
}

/* ------------------------------------------------------------------- Podcast */

export interface PodcastEpisode {
  id: string;
  title: string;
  /** Direct audio URL (mp3). Streamed by the in-app player. */
  audioUrl: string;
  description?: string;
  date?: ISODateString;
  /** Optional episode number/label, e.g. "Ep. 12". */
  episodeLabel?: string;
  /** Guest or subject, shown under the title. */
  guest?: string;
  /** Per-episode artwork; falls back to the show artwork. */
  artwork?: string;
  durationSeconds?: number;
}

export interface PodcastData {
  /**
   * Point the app at a podcast RSS feed and it fetches + parses episodes (and
   * the show's title, artwork, and description) at runtime. The feed host must
   * allow CORS (most podcast hosts, including Podbean, do).
   */
  feedUrl?: string;
  /** Show name. Optional if a feedUrl is given. */
  showName?: string;
  author?: string;
  /** Show artwork URL (square). */
  artwork?: string;
  description?: string;
  /** External subscribe link (Apple/Spotify/Podbean). */
  subscribeUrl?: string;
  /** Hand-authored episodes. Optional if a feedUrl is given. */
  episodes?: PodcastEpisode[];
}

/* ----------------------------------------------------------------- The phone */

/** Identifiers for each built-in app. */
export type AppId =
  | "messages"
  | "photos"
  | "notes"
  | "calls"
  | "browser"
  | "podcast"
  | "tinder"
  | "instagram";

/** Apps the phone can render. Omit an app to hide its icon. */
export interface PhoneApps {
  messages?: MessagesData;
  photos?: PhotosData;
  notes?: NotesData;
  calls?: CallsData;
  browser?: BrowserData;
  podcast?: PodcastData;
  tinder?: TinderData;
  instagram?: InstagramData;
}

export interface PhoneOwner {
  name: string;
  avatar?: string;
}

/**
 * A complete phone description, as stored in a `.json` file. Maps onto the
 * `<Phone>` props. Parse one with `parsePhoneData()`.
 */
export interface PhoneData {
  apps: PhoneApps;
  owner?: PhoneOwner;
  wallpaper?: string;
  statusTime?: string;
}

export interface PhoneProps {
  apps: PhoneApps;
  owner?: PhoneOwner;
  /** Wallpaper image URL or CSS background value. */
  wallpaper?: string;
  /** Clock time shown in the status bar, e.g. "9:41". Defaults to "9:41". */
  statusTime?: string;
  /** Open a specific app on mount instead of the home screen. */
  initialApp?: AppId;
  /** Open Spotlight search on mount, pre-filled with this query. */
  initialSearch?: string;
  /**
   * Which apps appear on the home grid, in this left-to-right / top-to-bottom
   * order. Listing an app here keeps it off the default dock. Apps you omit
   * (from both `grid` and `dock`) are hidden even if you pass their data.
   * Defaults to all apps that have data and aren't in the dock.
   */
  grid?: AppId[];
  /**
   * Which apps appear in the bottom dock, in order (max 4 shown). Defaults to
   * a sensible set (Phone, Messages, Browser, Photos) minus anything you've
   * explicitly placed on the `grid`.
   */
  dock?: AppId[];
  /** @deprecated Alias for `grid`. */
  appOrder?: AppId[];
  className?: string;
  /** Render only the screen content, without the physical device frame. */
  frameless?: boolean;
}
