import type { PhoneApps } from "../index";

/* Placeholder media via public services so the demo renders without bundled assets. */
const face = (n: number) => `https://i.pravatar.cc/200?img=${n}`;
const pic = (seed: string, w = 600, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const sampleApps: PhoneApps = {
  messages: {
    chats: [
      {
        id: "c1",
        unread: 2,
        contact: { id: "sarah", name: "Sarah Chen", avatar: face(5) },
        messages: [
          { id: "m1", direction: "in", text: "hey! still on for tonight?", timestamp: "2024-03-14T18:02:00Z" },
          { id: "m2", direction: "out", text: "yes! 8pm at the usual place", timestamp: "2024-03-14T18:05:00Z" },
          { id: "m3", direction: "in", text: "perfect 🙌", timestamp: "2024-03-14T18:06:00Z" },
          { id: "m4", direction: "in", text: "wait did you see this?", timestamp: "2024-03-14T19:40:00Z" },
          { id: "m5", direction: "in", timestamp: "2024-03-14T19:40:30Z", attachments: [{ type: "image", url: pic("msgpic", 500, 400) }] },
          { id: "m6", direction: "out", text: "lol no way", timestamp: "2024-03-14T19:42:00Z", status: "read" },
        ],
      },
      {
        id: "c2",
        contact: { id: "mike", name: "Mike Reyes", avatar: face(12) },
        messages: [
          { id: "m1", direction: "out", text: "you free this weekend?", timestamp: "2024-03-12T11:00:00Z" },
          { id: "m2", direction: "in", text: "should be, what's up", timestamp: "2024-03-12T12:30:00Z" },
        ],
      },
      {
        id: "c3",
        contact: { id: "mom", name: "Mom" },
        messages: [
          { id: "m1", direction: "in", text: "Call me when you get a chance ❤️", timestamp: "2024-03-10T09:15:00Z" },
        ],
      },
    ],
  },

  photos: {
    photos: Array.from({ length: 12 }, (_, i) => ({
      id: `p${i}`,
      src: pic(`photo-${i}`, 500, 500),
      date: `2024-0${i < 6 ? 3 : 2}-${String(((i % 27) + 1)).padStart(2, "0")}T12:00:00Z`,
      caption: i % 3 === 0 ? "Weekend trip" : undefined,
      location: i % 4 === 0 ? "Big Sur, CA" : undefined,
    })),
  },

  notes: {
    notes: [
      { id: "n1", pinned: true, title: "Passwords", body: "wifi: hunter2\ngarage code: 4815", date: "2024-03-01T08:00:00Z" },
      { id: "n2", title: "Grocery list", body: "eggs\nmilk\ncoffee\nspinach\nolive oil", date: "2024-03-13T17:30:00Z" },
      { id: "n3", body: "Remember to book flights before Friday. Check the Tuesday deal.", date: "2024-03-11T21:10:00Z" },
    ],
  },

  calls: {
    calls: [
      { id: "k1", contact: { id: "sarah", name: "Sarah Chen", avatar: face(5) }, type: "outgoing", timestamp: "2024-03-14T17:50:00Z", durationSeconds: 312 },
      { id: "k2", contact: { id: "unknown", name: "(415) 555-0192" }, type: "missed", timestamp: "2024-03-14T14:20:00Z" },
      { id: "k3", contact: { id: "mike", name: "Mike Reyes", avatar: face(12) }, type: "incoming", timestamp: "2024-03-13T20:05:00Z", durationSeconds: 95 },
      { id: "k4", contact: { id: "mom", name: "Mom" }, type: "incoming", timestamp: "2024-03-12T09:30:00Z", durationSeconds: 1240 },
    ],
  },

  browser: {
    engine: "Chrome",
    history: [
      { id: "b1", title: "Best hikes near Big Sur - AllTrails", url: "https://www.alltrails.com/big-sur", timestamp: "2024-03-14T15:01:00Z" },
      { id: "b2", title: "flights to LAX cheap - Google Search", url: "https://www.google.com/search?q=flights+to+lax", timestamp: "2024-03-14T15:00:00Z" },
      { id: "b3", title: "Sarah Chen (@sarahc) • Instagram", url: "https://instagram.com/sarahc", timestamp: "2024-03-13T22:14:00Z" },
      { id: "b4", title: "How to fix a leaky faucet - YouTube", url: "https://youtube.com/watch?v=abc123", timestamp: "2024-03-13T19:40:00Z" },
      { id: "b5", title: "Reddit - r/relationships", url: "https://reddit.com/r/relationships", timestamp: "2024-03-12T23:55:00Z" },
    ],
  },

  tinder: {
    deck: [
      { id: "t1", name: "Jess", age: 27, distance: "2 miles away", jobTitle: "Graphic Designer", bio: "Dog mom 🐕 · coffee snob · always down for tacos", photos: [pic("jess1", 700, 900), pic("jess2", 700, 900), pic("jess3", 700, 900)] },
      { id: "t2", name: "Maria", age: 29, distance: "5 miles away", jobTitle: "Nurse", bio: "Hiking, climbing, and a good book.", photos: [pic("maria1", 700, 900), pic("maria2", 700, 900)] },
      { id: "t3", name: "Alex", age: 31, distance: "8 miles away", jobTitle: "Software Engineer", bio: "Trying every ramen spot in the city.", photos: [pic("alex1", 700, 900)] },
    ],
    matches: [
      { profile: { id: "mt1", name: "Dana", photos: [face(20)] }, matchedAt: "2024-03-10T00:00:00Z", lastMessage: "haha that's so true" },
      { profile: { id: "mt2", name: "Priya", photos: [face(32)] }, matchedAt: "2024-03-08T00:00:00Z" },
    ],
  },

  instagram: {
    profile: {
      username: "adam.k",
      displayName: "Adam Kessler",
      avatar: face(8),
      bio: "📍 SF · photographer · probably outside",
      postsCount: 6,
      followers: 1843,
      following: 412,
    },
    posts: Array.from({ length: 6 }, (_, i) => ({
      id: `ig${i}`,
      images: i === 0 ? [pic(`ig-${i}-a`, 600, 600), pic(`ig-${i}-b`, 600, 600)] : [pic(`ig-${i}`, 600, 600)],
      caption: ["golden hour never misses", "weekend reset", "found this trail", "studio day", "good light", "more of these please"][i],
      likes: 100 + i * 37,
      timestamp: `2024-03-${String(14 - i).padStart(2, "0")}T12:00:00Z`,
      location: i % 2 === 0 ? "San Francisco, CA" : undefined,
      comments: [
        { id: "cm1", username: "sarahc", avatar: face(5), text: "this is gorgeous 😍", likes: 3 },
        { id: "cm2", username: "mike.r", avatar: face(12), text: "where is this??" },
      ],
    })),
    feed: Array.from({ length: 4 }, (_, i) => ({
      id: `fd${i}`,
      images: [pic(`feed-${i}`, 600, 600)],
      caption: ["new gear day", "sunset run", "brunch club", "studio vibes"][i],
      likes: 200 + i * 50,
      timestamp: `2024-03-${String(14 - i).padStart(2, "0")}T10:00:00Z`,
      comments: [{ id: "x", username: "someone", text: "🔥🔥" }],
    })),
    searchHistory: ["big sur", "sarah chen", "ramen sf"],
  },
};
