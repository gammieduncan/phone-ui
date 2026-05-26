import type { ReactNode } from "react";
import type { AppId, PhoneApps } from "../types";
import {
  MessagesIcon,
  PhotosIcon,
  NotesIcon,
  PhoneIcon,
  BrowserIcon,
  TinderIcon,
  InstagramIcon,
} from "../components/icons";
import { Messages } from "./Messages";
import { Photos } from "./Photos";
import { Notes } from "./Notes";
import { Calls } from "./Calls";
import { Browser } from "./Browser";
import { Tinder } from "./Tinder";
import { Instagram } from "./Instagram";

export interface AppDefinition {
  id: AppId;
  label: string;
  Icon: () => ReactNode;
  /** Whether the consumer supplied data for this app. */
  has: (apps: PhoneApps) => boolean;
  /**
   * Render the running app, given the phone's data, a home callback, and an
   * optional item id to deep-link into (from Spotlight search).
   */
  render: (apps: PhoneApps, onExit: () => void, openItemId?: string) => ReactNode;
  /** Suggested placement in the bottom dock (lower = more left). */
  dock?: number;
}

export const APP_REGISTRY: Record<AppId, AppDefinition> = {
  messages: {
    id: "messages",
    label: "Messages",
    Icon: MessagesIcon,
    has: (a) => !!a.messages?.chats?.length,
    render: (a, onExit, id) => <Messages data={a.messages!} onExit={onExit} openItemId={id} />,
    dock: 1,
  },
  calls: {
    id: "calls",
    label: "Phone",
    Icon: PhoneIcon,
    has: (a) => !!a.calls?.calls?.length,
    render: (a, onExit) => <Calls data={a.calls!} onExit={onExit} />,
    dock: 0,
  },
  browser: {
    id: "browser",
    label: "Chrome",
    Icon: BrowserIcon,
    has: (a) => !!a.browser?.history?.length,
    render: (a, onExit) => <Browser data={a.browser!} onExit={onExit} />,
    dock: 2,
  },
  photos: {
    id: "photos",
    label: "Photos",
    Icon: PhotosIcon,
    has: (a) => !!a.photos?.photos?.length,
    render: (a, onExit, id) => <Photos data={a.photos!} onExit={onExit} openItemId={id} />,
    dock: 3,
  },
  notes: {
    id: "notes",
    label: "Notes",
    Icon: NotesIcon,
    has: (a) => !!a.notes?.notes?.length,
    render: (a, onExit, id) => <Notes data={a.notes!} onExit={onExit} openItemId={id} />,
  },
  tinder: {
    id: "tinder",
    label: "Tinder",
    Icon: TinderIcon,
    has: (a) => !!a.tinder?.deck?.length || !!a.tinder?.matches?.length,
    render: (a, onExit, id) => <Tinder data={a.tinder!} onExit={onExit} openItemId={id} />,
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    Icon: InstagramIcon,
    has: (a) => !!a.instagram?.profile,
    render: (a, onExit, id) => <Instagram data={a.instagram!} onExit={onExit} openItemId={id} />,
  },
};

export const DEFAULT_ORDER: AppId[] = [
  "messages",
  "photos",
  "notes",
  "tinder",
  "instagram",
  "calls",
  "browser",
];
