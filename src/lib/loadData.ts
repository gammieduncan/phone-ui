import type { PhoneApps, PhoneData } from "../types";

/**
 * Parse and lightly validate phone data from a JSON string or already-parsed object.
 *
 * Accepts either a full config (`{ owner, wallpaper, apps }`) or a bare apps
 * object (`{ messages: {...}, notes: {...} }`). Throws a descriptive Error on
 * malformed input — handy for surfacing a message in an upload UI.
 *
 * ```ts
 * const data = parsePhoneData(await file.text());
 * <Phone {...data} />
 * ```
 */
export function parsePhoneData(input: string | unknown): PhoneData {
  let parsed: unknown = input;
  if (typeof input === "string") {
    try {
      parsed = JSON.parse(input);
    } catch {
      throw new Error("File is not valid JSON.");
    }
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Phone data must be a JSON object.");
  }

  const obj = parsed as Record<string, unknown>;
  const data: PhoneData = "apps" in obj ? (obj as unknown as PhoneData) : { apps: obj as PhoneApps };

  if (!data.apps || typeof data.apps !== "object") {
    throw new Error('Missing an "apps" object, e.g. { "messages": { "chats": [...] } }.');
  }
  return data;
}
