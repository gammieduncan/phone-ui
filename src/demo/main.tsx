import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Phone } from "../index";
import type { AppId, PhoneApps, PhoneOwner } from "../index";
import { sampleApps } from "./sampleData";
import "./demo.css";

// Optional deep-links, handy for previewing: ?app=messages or ?search=big%20sur
const params = new URLSearchParams(location.search);
const initialApp = (params.get("app") as AppId) || undefined;
const initialSearch = params.get("search") ?? undefined;

/** Shape of an uploaded phone file. A bare PhoneApps object is also accepted. */
interface PhoneConfig {
  owner?: PhoneOwner;
  wallpaper?: string;
  statusTime?: string;
  apps: PhoneApps;
}

const SAMPLE_CONFIG: PhoneConfig = {
  owner: { name: "Adam Kessler" },
  wallpaper: "linear-gradient(160deg,#1a2a4a,#0a1020 70%,#1a1030)",
  statusTime: "9:41",
  apps: sampleApps,
};

function normalize(parsed: unknown): PhoneConfig {
  if (!parsed || typeof parsed !== "object") throw new Error("File is not a JSON object.");
  const obj = parsed as Record<string, unknown>;
  // Accept either a full config ({ owner, apps, ... }) or a bare apps object.
  const config: PhoneConfig = "apps" in obj ? (obj as unknown as PhoneConfig) : { apps: obj as PhoneApps };
  if (!config.apps || typeof config.apps !== "object") {
    throw new Error('Missing an "apps" object (e.g. { "messages": { "chats": [...] } }).');
  }
  return config;
}

function Demo() {
  const [config, setConfig] = useState<PhoneConfig>(SAMPLE_CONFIG);
  const [error, setError] = useState<string | null>(null);
  const [loadedName, setLoadedName] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const next = normalize(JSON.parse(text));
      setConfig(next);
      setError(null);
      setLoadedName(file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not parse file.");
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([JSON.stringify(SAMPLE_CONFIG, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "phone-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="demo-stage">
      <header className="demo-head">
        <h1>phone-ui</h1>
        <p>Realistic, data-driven phone emulations. Tap an app icon.</p>
      </header>

      <section className="demo-controls">
        <label className="demo-btn">
          Upload data (.json)
          <input
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = "";
            }}
          />
        </label>
        <button type="button" className="demo-btn demo-btn--ghost" onClick={downloadTemplate}>
          Download template
        </button>
        {config !== SAMPLE_CONFIG && (
          <button
            type="button"
            className="demo-btn demo-btn--ghost"
            onClick={() => {
              setConfig(SAMPLE_CONFIG);
              setLoadedName(null);
              setError(null);
            }}
          >
            Reset to sample
          </button>
        )}
        {loadedName && <span className="demo-loaded">Loaded: {loadedName}</span>}
        {error && <span className="demo-error">{error}</span>}
      </section>

      <Phone
        apps={config.apps}
        owner={config.owner}
        wallpaper={config.wallpaper}
        statusTime={config.statusTime ?? "9:41"}
        initialApp={initialApp}
        initialSearch={initialSearch}
      />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
