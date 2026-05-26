import { useState } from "react";
import type { IgComment, IgPost, InstagramData } from "../types";
import { Avatar } from "../components/Avatar";
import { AppHeader } from "../components/AppHeader";
import { CommentGlyph, HeartGlyph } from "../components/icons";
import { formatCount, formatDayLabel } from "../lib/format";
import styles from "./Instagram.module.css";

interface Props {
  data: InstagramData;
  onExit: () => void;
  /** Open straight into this post (used by Spotlight search). */
  openItemId?: string;
}

type View = "feed" | "profile" | "post";

export function Instagram({ data, onExit, openItemId }: Props) {
  const feed = data.feed?.length ? data.feed : data.posts;
  const hasFeed = feed.length > 0;
  const initialPost =
    openItemId != null && (data.posts.some((p) => p.id === openItemId) || feed.some((p) => p.id === openItemId))
      ? openItemId
      : null;
  const [tab, setTab] = useState<"feed" | "profile">("profile");
  const [view, setView] = useState<View>(initialPost ? "post" : "profile");
  const [postId, setPostId] = useState<string | null>(initialPost);
  // The view to return to when leaving the post detail.
  const [prevView, setPrevView] = useState<"feed" | "profile">("profile");

  const openPost = (id: string, from: "feed" | "profile") => {
    setPrevView(from);
    setPostId(id);
    setView("post");
  };

  if (view === "post") {
    const post =
      data.posts.find((p) => p.id === postId) ?? feed.find((p) => p.id === postId) ?? null;
    if (post) {
      return (
        <div className={styles.screen}>
          <AppHeader title={data.profile.username} onBack={() => setView(prevView)} />
          <div className={styles.scroll}>
            <FeedItem
              post={post}
              username={data.profile.username}
              avatar={data.profile.avatar}
              expanded
            />
            <Comments comments={post.comments ?? []} />
          </div>
          <TabBar tab={prevView} onTab={selectTab} />
        </div>
      );
    }
    // Post vanished — fall back to the previous tab.
    setView(prevView);
  }

  function selectTab(next: "feed" | "profile") {
    setTab(next);
    setView(next);
  }

  if (view === "profile") {
    return (
      <div className={styles.screen}>
        <AppHeader large title={data.profile.username} onBack={onExit} backLabel="Home" />
        <div className={styles.scroll}>
          <Profile data={data} onOpen={(id) => openPost(id, "profile")} />
        </div>
        <TabBar tab={tab} onTab={selectTab} />
      </div>
    );
  }

  // Feed
  return (
    <div className={styles.screen}>
      <AppHeader large title="Instagram" onBack={onExit} backLabel="Home" />
      <div className={styles.scroll}>
        {hasFeed ? (
          feed.map((post) => (
            <div
              key={post.id}
              className={styles.feedTap}
              onClick={() => openPost(post.id, "feed")}
            >
              <FeedItem
                post={post}
                username={data.profile.username}
                avatar={data.profile.avatar}
              />
            </div>
          ))
        ) : (
          <p className={styles.empty}>No posts yet.</p>
        )}
      </div>
      <TabBar tab={tab} onTab={selectTab} />
    </div>
  );
}

function FeedItem({
  post,
  username,
  avatar,
  expanded,
}: {
  post: IgPost;
  username: string;
  avatar?: string;
  expanded?: boolean;
}) {
  const image = post.images[0];
  return (
    <article className={styles.post}>
      <header className={styles.postHead}>
        <Avatar name={username} src={avatar} size={32} />
        <div className={styles.postHeadText}>
          <span className={styles.postUser}>{username}</span>
          {post.location && <span className={styles.postLoc}>{post.location}</span>}
        </div>
      </header>

      {image && (
        <div className={styles.media}>
          <img className={styles.mediaImg} src={image} alt={post.caption ?? ""} />
          {post.images.length > 1 && (
            <div className={styles.dots}>
              {post.images.map((_, i) => (
                <span key={i} className={i === 0 ? styles.dotActive : styles.dot} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <HeartGlyph size={24} />
        <CommentGlyph size={24} />
      </div>

      <div className={styles.meta}>
        {post.likes != null && (
          <div className={styles.likes}>{formatCount(post.likes)} likes</div>
        )}
        {post.caption && (
          <p className={expanded ? styles.captionFull : styles.caption}>
            <span className={styles.postUser}>{username}</span> {post.caption}
          </p>
        )}
        {!expanded && !!post.comments?.length && (
          <div className={styles.viewComments}>
            View all {post.comments.length} comments
          </div>
        )}
        {post.timestamp && (
          <div className={styles.time}>{formatDayLabel(post.timestamp)}</div>
        )}
      </div>
    </article>
  );
}

function Comments({ comments }: { comments: IgComment[] }) {
  if (!comments.length) return null;
  return (
    <div className={styles.comments}>
      {comments.map((c) => (
        <div key={c.id} className={styles.comment}>
          <Avatar name={c.username} src={c.avatar} size={28} />
          <div className={styles.commentBody}>
            <p className={styles.commentText}>
              <span className={styles.postUser}>{c.username}</span> {c.text}
            </p>
            <div className={styles.commentMeta}>
              {c.timestamp && <span>{formatDayLabel(c.timestamp)}</span>}
              {c.likes != null && <span>{formatCount(c.likes)} likes</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Profile({
  data,
  onOpen,
}: {
  data: InstagramData;
  onOpen: (id: string) => void;
}) {
  const { profile, posts } = data;
  return (
    <div className={styles.profile}>
      <div className={styles.profileTop}>
        <Avatar name={profile.displayName ?? profile.username} src={profile.avatar} size={84} />
        <div className={styles.stats}>
          <Stat value={profile.postsCount ?? posts.length} label="posts" />
          <Stat value={profile.followers} label="followers" />
          <Stat value={profile.following} label="following" />
        </div>
      </div>

      {(profile.displayName || profile.bio) && (
        <div className={styles.profileInfo}>
          {profile.displayName && <div className={styles.displayName}>{profile.displayName}</div>}
          {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
        </div>
      )}

      {posts.length ? (
        <div className={styles.grid}>
          {posts.map((p) => (
            <button
              type="button"
              key={p.id}
              className={styles.cell}
              onClick={() => onOpen(p.id)}
            >
              {p.images[0] && (
                <img className={styles.cellImg} src={p.images[0]} alt={p.caption ?? ""} />
              )}
            </button>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No posts yet.</p>
      )}
    </div>
  );
}

function Stat({ value, label }: { value?: number; label: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{formatCount(value)}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function TabBar({
  tab,
  onTab,
}: {
  tab: "feed" | "profile";
  onTab: (t: "feed" | "profile") => void;
}) {
  return (
    <nav className={styles.tabBar}>
      <button
        type="button"
        className={tab === "feed" ? styles.tabActive : styles.tab}
        onClick={() => onTab("feed")}
      >
        Feed
      </button>
      <button
        type="button"
        className={tab === "profile" ? styles.tabActive : styles.tab}
        onClick={() => onTab("profile")}
      >
        Profile
      </button>
    </nav>
  );
}
