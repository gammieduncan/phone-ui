import type { AppId, PhoneApps } from "../types";
import { hostnameOf } from "./format";

export interface SearchResult {
  /** Stable unique key for React. */
  key: string;
  appId: AppId;
  /** App label for grouping ("Messages", "Notes", …). */
  category: string;
  /** Optional id used to deep-link into the app's detail view. */
  itemId?: string;
  title: string;
  subtitle?: string;
}

const has = (text: string | undefined, q: string) =>
  !!text && text.toLowerCase().includes(q);

/** Trim a long body to a snippet around nothing fancy — just the first line/120 chars. */
function snippet(text: string, max = 80): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > max ? `${oneLine.slice(0, max)}…` : oneLine;
}

/**
 * Search across every app's content. Returns a flat, ranked-ish list (contact/name
 * matches first within each app), capped per category to stay readable.
 */
export function searchApps(apps: PhoneApps, query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: SearchResult[] = [];
  const CAP = 6;

  // Messages
  if (apps.messages) {
    let n = 0;
    for (const chat of apps.messages.chats) {
      if (n >= CAP) break;
      const nameHit = has(chat.contact.name, q);
      const msgHit = chat.messages.find((m) => has(m.text, q));
      if (nameHit || msgHit) {
        out.push({
          key: `msg-${chat.id}`,
          appId: "messages",
          category: "Messages",
          itemId: chat.id,
          title: chat.contact.name,
          subtitle: msgHit?.text
            ? snippet(msgHit.text)
            : chat.messages[chat.messages.length - 1]?.text,
        });
        n++;
      }
    }
  }

  // Notes
  if (apps.notes) {
    let n = 0;
    for (const note of apps.notes.notes) {
      if (n >= CAP) break;
      if (has(note.title, q) || has(note.body, q)) {
        const title = note.title || note.body.split("\n")[0] || "Note";
        out.push({
          key: `note-${note.id}`,
          appId: "notes",
          category: "Notes",
          itemId: note.id,
          title: snippet(title, 50),
          subtitle: snippet(note.body),
        });
        n++;
      }
    }
  }

  // Calls
  if (apps.calls) {
    let n = 0;
    for (const call of apps.calls.calls) {
      if (n >= CAP) break;
      if (has(call.contact.name, q)) {
        out.push({
          key: `call-${call.id}`,
          appId: "calls",
          category: "Phone",
          title: call.contact.name,
          subtitle: call.type[0].toUpperCase() + call.type.slice(1),
        });
        n++;
      }
    }
  }

  // Browser history
  if (apps.browser) {
    let n = 0;
    for (const v of apps.browser.history) {
      if (n >= CAP) break;
      if (has(v.title, q) || has(v.url, q)) {
        out.push({
          key: `web-${v.id}`,
          appId: "browser",
          category: apps.browser.engine ?? "History",
          itemId: v.id,
          title: snippet(v.title, 50),
          subtitle: hostnameOf(v.url),
        });
        n++;
      }
    }
  }

  // Photos
  if (apps.photos) {
    let n = 0;
    for (const p of apps.photos.photos) {
      if (n >= CAP) break;
      if (has(p.caption, q) || has(p.location, q)) {
        out.push({
          key: `photo-${p.id}`,
          appId: "photos",
          category: "Photos",
          itemId: p.id,
          title: p.caption || "Photo",
          subtitle: p.location,
        });
        n++;
      }
    }
  }

  // Tinder
  if (apps.tinder) {
    let n = 0;
    const profiles = [
      ...apps.tinder.deck,
      ...(apps.tinder.matches?.map((m) => m.profile) ?? []),
    ];
    for (const pr of profiles) {
      if (n >= CAP) break;
      if (has(pr.name, q) || has(pr.bio, q) || has(pr.jobTitle, q)) {
        out.push({
          key: `tinder-${pr.id}`,
          appId: "tinder",
          category: "Tinder",
          itemId: pr.id,
          title: pr.age ? `${pr.name}, ${pr.age}` : pr.name,
          subtitle: pr.jobTitle || pr.bio,
        });
        n++;
      }
    }
  }

  // Instagram
  if (apps.instagram) {
    let n = 0;
    const ig = apps.instagram;
    if (has(ig.profile.username, q) || has(ig.profile.displayName, q) || has(ig.profile.bio, q)) {
      out.push({
        key: `ig-profile`,
        appId: "instagram",
        category: "Instagram",
        title: ig.profile.displayName || ig.profile.username,
        subtitle: `@${ig.profile.username}`,
      });
      n++;
    }
    for (const post of ig.posts) {
      if (n >= CAP) break;
      const commentHit = post.comments?.find((c) => has(c.text, q) || has(c.username, q));
      if (has(post.caption, q) || has(post.location, q) || commentHit) {
        out.push({
          key: `ig-${post.id}`,
          appId: "instagram",
          category: "Instagram",
          itemId: post.id,
          title: post.caption ? snippet(post.caption, 50) : "Post",
          subtitle: commentHit ? `${commentHit.username}: ${snippet(commentHit.text, 40)}` : post.location,
        });
        n++;
      }
    }
  }

  return out;
}
