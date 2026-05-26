import "./theme.css";

export { Phone } from "./components/Phone";
export { StatusBar } from "./components/StatusBar";
export { Avatar } from "./components/Avatar";

// Individual app screens — usable standalone if you only want one surface.
export { Messages } from "./apps/Messages";
export { Photos } from "./apps/Photos";
export { Notes } from "./apps/Notes";
export { Calls } from "./apps/Calls";
export { Browser } from "./apps/Browser";
export { Tinder } from "./apps/Tinder";
export { Instagram } from "./apps/Instagram";

export { APP_REGISTRY, DEFAULT_ORDER } from "./apps/registry";

export type {
  PhoneProps,
  PhoneApps,
  PhoneOwner,
  AppId,
  Contact,
  ISODateString,
  // messages
  MessagesData,
  ChatThread,
  Message,
  MessageAttachment,
  // photos
  PhotosData,
  Photo,
  // notes
  NotesData,
  Note,
  // calls
  CallsData,
  CallRecord,
  // browser
  BrowserData,
  BrowserVisit,
  // tinder
  TinderData,
  TinderProfile,
  TinderMatch,
  // instagram
  InstagramData,
  IgAccount,
  IgPost,
  IgComment,
} from "./types";
