# phone-ui

Render realistic, **data-driven phone emulations** as React components. Drop in your own data and get a believable phone with working app screens — Messages, Photos, Notes, Phone/Calls, Browser history, Tinder, and Instagram.

Great for storytelling sites, interactive fiction, ARGs, product mockups, design comps, and demos.

```tsx
import { Phone } from "phone-ui";
import "phone-ui/styles.css";

<Phone
  owner={{ name: "Adam Kessler" }}
  wallpaper="linear-gradient(160deg,#1a2a4a,#0a1020)"
  apps={{
    messages: { chats: [...] },
    photos:   { photos: [...] },
    notes:    { notes: [...] },
    calls:    { calls: [...] },
    browser:  { engine: "Chrome", history: [...] },
    tinder:   { deck: [...], matches: [...] },
    instagram:{ profile: {...}, posts: [...], feed: [...] },
  }}
/>;
```

Only the apps you provide data for appear on the home screen. Tap an icon to open an app; each app has its own internal navigation (thread view, photo detail, post detail, swipe deck…), and the back button returns home.

## Install

```bash
npm install phone-ui
# peer deps: react >=18, react-dom >=18
```

## Apps & data shapes

Every app is fully typed. Import the types you need:

| App | Prop | Key types |
| --- | --- | --- |
| Messages | `messages` | `ChatThread`, `Message` |
| Photos | `photos` | `Photo` |
| Notes | `notes` | `Note` |
| Phone / Calls | `calls` | `CallRecord` |
| Browser history | `browser` | `BrowserVisit` |
| Tinder | `tinder` | `TinderProfile`, `TinderMatch` |
| Instagram | `instagram` | `IgAccount`, `IgPost`, `IgComment` |

See [`src/types.ts`](./src/types.ts) for the full schema, and [`src/demo/sampleData.ts`](./src/demo/sampleData.ts) for a complete worked example.

### Loading your own data

You supply data however you like — inline, fetched from an API, or loaded from a JSON file. The demo playground (`npm run dev`) has an **Upload data (.json)** button plus a **Download template** button so you can grab a starter file, edit it, and drop it back in. The file is a single JSON object:

```json
{
  "owner": { "name": "Adam Kessler" },
  "wallpaper": "linear-gradient(160deg,#1a2a4a,#0a1020)",
  "statusTime": "9:41",
  "apps": {
    "messages": { "chats": [ ... ] },
    "notes": { "notes": [ ... ] },
    "instagram": { "profile": { ... }, "posts": [ ... ] }
  }
}
```

A bare `apps` object (without the `owner`/`wallpaper` wrapper) is also accepted. Anything under `apps` maps directly to the `<Phone apps={...} />` prop.

## `<Phone>` props

| Prop | Type | Description |
| --- | --- | --- |
| `apps` | `PhoneApps` | Per-app data. Apps without data are hidden. |
| `owner` | `{ name, avatar? }` | Shown on the home screen. |
| `wallpaper` | `string` | Image URL **or** any CSS background (e.g. a gradient). |
| `statusTime` | `string` | Status-bar clock. Default `"9:41"`. |
| `initialApp` | `AppId` | Open straight into an app. |
| `appOrder` | `AppId[]` | Reorder / restrict the home grid. |
| `frameless` | `boolean` | Render the screen without the device bezel. |
| `className` | `string` | Extra class on the root. |

## Theming

All visuals are driven by CSS custom properties scoped to `.pui-root`. Override any token to reskin (e.g. a light theme):

```css
.pui-root {
  --pui-bg: #ffffff;
  --pui-text: #111;
  --pui-blue: #0a84ff;
}
```

Full token list in [`src/theme.css`](./src/theme.css).

## Standalone app screens

You don't have to use the whole phone. Each screen is exported on its own:

```tsx
import { Messages } from "phone-ui";

<Messages data={{ chats: [...] }} onExit={() => {}} />;
```

## Develop

```bash
npm install
npm run dev      # demo playground at localhost:5173
npm run build    # builds the distributable library into dist/
```

## License

MIT. See [LICENSE](./LICENSE).
