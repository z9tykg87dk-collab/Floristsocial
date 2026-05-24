import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bookmark,
  MessageCircle,
  Plus,
  Radio,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import FloristSocialHeader from "@/components/layout/FloristSocialHeader";
import FloristSocialFooter from "@/components/layout/FloristSocialFooter";
import FollowButton from "./FollowButton";
import PostMoreMenu from "./PostMoreMenu";
import LikeButton from "./LikeButton";
import PostOwnerActions from "./PostOwnerActions";
import CommentSection from "./CommentSection";
import ShareButton from "./ShareButton";

type FeedPost = {
  id: string;
  florist_id: string | null;
  florist_name?: string | null;
  florist_slug?: string | null;
  florist_logo_url?: string | null;
  title?: string | null;
  caption?: string | null;
  description?: string | null;
  hashtags?: string[] | string | null;
  price?: number | string | null;
  image_url?: string | null;
  image_thumbnail_url?: string | null;
  image_medium_url?: string | null;
  image_original_url?: string | null;
  image_alt?: string | null;
  video_url?: string | null;
  media_type?: "image" | "video" | "carousel" | string | null;
  created_at: string;
  is_shoppable?: boolean | null;
  is_featured?: boolean | null;
  is_sponsored?: boolean | null;
  product_id?: string | null;
  product_title?: string | null;
  base_price?: number | null;
  currency?: string | null;
  category?: string | null;
  style?: string | null;
  occasion?: string | null;
  seasonal_disclaimer?: string | null;
  allow_price_upgrade?: boolean | null;
  like_count?: number | null;
  comment_count?: number | null;
  save_count?: number | null;
};

function normalizeHashtags(value: FeedPost["hashtags"]) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);

  return String(value)
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pickImage(post: FeedPost) {
  return post.image_thumbnail_url || post.image_medium_url || post.image_original_url || post.image_url || "";
}

function formatPrice(value: number | string | null | undefined, currency: string | null | undefined) {
  if (value === null || value === undefined || value === "") return "";
  const text = String(value).trim();
  if (!text) return "";
  if (text.toLowerCase().includes("kr")) return text;
  if ((currency || "SEK") === "SEK") return `${text} kr`;
  return `${text} ${currency || ""}`.trim();
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Stockholm",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function orderLink(post: FeedPost) {
  const params = new URLSearchParams();

  if (post.product_id) params.set("productId", post.product_id);
  if (post.florist_id) params.set("floristId", post.florist_id);
  if (post.id) params.set("postId", post.id);
  if (post.product_title || post.title) params.set("title", String(post.product_title || post.title));
  if (post.base_price || post.price) params.set("price", String(post.base_price || post.price));

  return `/orders/new?${params.toString()}`;
}

function floristLink(post: FeedPost) {
  if (post.florist_slug) return `/florist/${post.florist_slug}`;
  if (post.florist_id) return `/florist/${post.florist_id}`;
  return "/florists";
}

async function loadFeedPosts(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data: feedItems, error: feedError } = await supabase
    .from("feed_items")
    .select("*")
    .limit(60);

  if (!feedError && feedItems) {
    return { posts: feedItems as FeedPost[], error: null };
  }

  const { data: oldPosts, error: oldError } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      caption,
      hashtags,
      price,
      image_url,
      image_thumbnail_url,
      image_medium_url,
      image_original_url,
      video_url,
      media_type,
      created_at,
      florist_id,
      is_shoppable,
      is_featured,
      is_sponsored,
      product_id,
      product_title,
      base_price,
      currency,
      category,
      style,
      occasion,
      seasonal_disclaimer,
      like_count,
      comment_count,
      save_count
    `)
    .order("created_at", { ascending: false })
    .limit(60);

  if (oldError) return { posts: [] as FeedPost[], error: oldError };
  return { posts: (oldPosts || []) as FeedPost[], error: null };
}

export default async function FeedPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { posts, error } = await loadFeedPosts(supabase);
  const visiblePosts = posts.filter((post) => pickImage(post) || post.video_url);
  const featuredPosts = visiblePosts.filter((post) => post.is_featured || post.is_shoppable).slice(0, 4);

  if (error) {
    return (
      <>
        <FloristSocialHeader role="florist" country="SE" active="feed" />
        <main className="min-h-screen bg-[#fbf7f2] px-5 py-10 text-stone-900 md:px-10">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold">Kunde inte ladda feed</h1>
            <pre className="mt-4 overflow-auto rounded-2xl bg-stone-100 p-4 text-xs text-stone-700">{JSON.stringify(error, null, 2)}</pre>
          </div>
        </main>
        <FloristSocialFooter />
      </>
    );
  }

  return (
    <>
      <FloristSocialHeader role="florist" country="SE" active="feed" />

      <main className="min-h-screen bg-[#fbf7f2] text-stone-900">
        <section className="mx-auto max-w-7xl px-5 py-8 md:px-10 lg:px-16">
          <header className="mb-8 overflow-hidden rounded-[36px] bg-gradient-to-br from-white via-emerald-50 to-pink-50 p-6 shadow-sm ring-1 ring-stone-200/70 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-stretch">
              <div>
                <Link href="/feed" className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-50">
                  <Sparkles size={16} /> FloristSocial
                </Link>

                <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Florist Feed</h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
                  Dela buketter, inspiration, video och köpbara arrangemang med andra florister och kunder.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/florist-chat" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-5 text-sm font-bold text-stone-900 transition hover:border-stone-400">
                    <MessageCircle size={18} /> Florist-chat
                  </Link>

                  <Link href="/feed/new" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-bold !text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">
                    <Plus size={18} /> Skapa inlägg
                  </Link>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-3xl bg-stone-950 p-5 text-white">
                <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red-500 px-5 text-sm font-bold !text-white transition hover:bg-red-600">
                  <Radio size={18} /> Live Streaming
                </button>

                <button type="button" className="mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold !text-white transition hover:bg-white/15">
                  <Bookmark size={16} /> Spara önskad streaming
                </button>

                <p className="mt-3 text-center text-xs text-stone-300">Kommer snart</p>
              </div>
            </div>
          </header>

          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { label: "Alla", href: "/feed" },
                { label: "Köpbara", href: "/marketplace" },
                { label: "Buketter", href: "/marketplace?category=Buketter" },
                { label: "Bröllop", href: "/marketplace?category=Bröllop" },
                { label: "Begravning", href: "/marketplace?category=Begravning" },
                { label: "Event", href: "/marketplace?category=Event" },
                { label: "Företag", href: "/company/register" },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-sm transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                placeholder="Sök inspiration, florist, stil..."
                className="h-12 w-full rounded-full border border-stone-200 bg-white px-4 pl-12 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-500"
              />
            </div>
          </div>

          {featuredPosts.length > 0 && (
            <section className="mb-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Köpbar inspiration</h2>
                  <p className="mt-1 text-sm text-stone-500">Bilder som kan beställas som liknande bukett eller arrangemang.</p>
                </div>
                <Link href="/marketplace" className="text-sm font-bold text-pink-700 hover:text-pink-800">Visa marketplace</Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredPosts.map((post) => (
                  <FeaturedCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {visiblePosts.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-stone-300 bg-white p-12 text-center shadow-sm">
              <Store className="mx-auto text-stone-300" size={42} />
              <h2 className="mt-4 text-2xl font-bold">Inga bildinlägg att visa ännu</h2>
              <p className="mt-2 text-stone-600">Skapa ett nytt inlägg med bild så visas det här.</p>
              <Link href="/feed/new" className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-pink-600 px-6 text-sm font-bold !text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700">
                Skapa första inlägget
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <section className="space-y-6">
                {visiblePosts.map((post) => (
                  <FeedPostCard key={post.id} post={post} userId={user.id} />
                ))}
              </section>

              <aside className="hidden space-y-6 lg:block">
                <div className="sticky top-24 rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-stone-200/70">
                  <h2 className="text-xl font-bold">Feed-status</h2>
                  <div className="mt-5 space-y-3 text-sm text-stone-700">
                    <SummaryRow label="Synliga inlägg" value={String(visiblePosts.length)} />
                    <SummaryRow label="Köpbara" value={String(visiblePosts.filter((post) => post.is_shoppable).length)} />
                    <SummaryRow label="Videos" value={String(visiblePosts.filter((post) => post.media_type === "video").length)} />
                  </div>
                  <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                    Nya social-commerce-poster med bild och pris visas här automatiskt.
                  </div>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>

      <FloristSocialFooter />
    </>
  );
}

function FeaturedCard({ post }: { post: FeedPost }) {
  const imageUrl = pickImage(post);
  const price = formatPrice(post.base_price || post.price, post.currency);

  return (
    <Link href={orderLink(post)} className="group overflow-hidden rounded-3xl bg-stone-50 ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square bg-stone-100">
        <Image src={imageUrl} alt={post.image_alt || post.product_title || post.caption || "FloristSocial bild"} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" unoptimized />
      </div>
      <div className="p-4">
        <div className="text-xs font-bold uppercase tracking-wide text-pink-600">Köp liknande</div>
        <h3 className="mt-1 line-clamp-2 font-bold text-stone-900">{post.product_title || post.title || post.caption || "Floristarrangemang"}</h3>
        {price && <div className="mt-2 font-bold text-stone-700">{price}</div>}
      </div>
    </Link>
  );
}

function FeedPostCard({ post, userId }: { post: FeedPost; userId: string }) {
  const imageUrl = pickImage(post);
  const hashtags = normalizeHashtags(post.hashtags);
  const price = formatPrice(post.base_price || post.price, post.currency);
  const title = post.product_title || post.title;

  return (
    <article className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-stone-200/70">
      <div className="flex items-center justify-between gap-3 p-4">
        <Link href={floristLink(post)} className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-stone-100 ring-1 ring-stone-200">
            {post.florist_logo_url ? (
              <Image src={post.florist_logo_url} alt={post.florist_name || "Florist"} fill className="object-cover" unoptimized />
            ) : (
              <div className="grid h-full w-full place-items-center text-stone-400"><UserRound size={21} /></div>
            )}
          </div>
          <div className="min-w-0">
            <strong className="block truncate text-sm text-stone-900">{post.florist_name || "Florist"}</strong>
            <span className="block truncate text-xs text-stone-500">{formatDate(post.created_at)}</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {post.florist_id && <FollowButton floristId={post.florist_id} />}
          <PostMoreMenu />
        </div>
      </div>

      <div className="relative bg-stone-100">
        {post.media_type === "video" && post.video_url ? (
          <video src={post.video_url} controls className="w-full object-cover" />
        ) : (
          <Image
            src={imageUrl}
            alt={post.image_alt || title || post.caption || "FloristSocial bild"}
            width={1100}
            height={1300}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 740px"
            unoptimized
          />
        )}

        {post.is_shoppable && price && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-pink-600">Köp liknande</div>
              <div className="font-bold text-stone-900">{price}</div>
            </div>
            <Link href={orderLink(post)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-600 px-4 py-2 text-sm font-bold !text-white transition hover:bg-pink-700">
              <ShoppingBag size={16} /> Köp
            </Link>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-4 grid grid-cols-3 gap-2">
          <LikeButton postId={post.id} />
          <CommentSection postId={post.id} />
          <div className="min-h-11 rounded-full border border-stone-200 bg-stone-50">
            <ShareButton postId={post.id} />
          </div>
        </div>

        {title && <h2 className="text-xl font-bold text-stone-900">{title}</h2>}
        {post.caption && <p className="mt-2 text-sm leading-6 text-stone-700">{post.caption}</p>}
        {post.description && <p className="mt-2 text-sm leading-6 text-stone-500">{post.description}</p>}

        {hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {hashtags.slice(0, 10).map((tag, index) => (
              <span key={`${tag}-${index}`} className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700">
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}

        {post.is_shoppable && post.seasonal_disclaimer && (
          <div className="mt-4 rounded-2xl bg-stone-50 p-3 text-xs leading-5 text-stone-500">
            {post.seasonal_disclaimer}
          </div>
        )}

        {post.florist_id === userId && (
          <div className="mt-4 rounded-2xl bg-stone-50 p-3">
            <PostOwnerActions postId={post.id} />
          </div>
        )}

        <Link href={post.is_shoppable ? orderLink(post) : `/feed/post/${post.id}`} className="mt-4 flex h-12 items-center justify-center rounded-2xl bg-stone-900 px-5 text-sm font-bold !text-white transition hover:bg-stone-800">
          {post.is_shoppable ? "Beställ / köp liknande" : "Visa mer"}
        </Link>
      </div>
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3">
      <span className="text-stone-500">{label}</span>
      <strong className="text-right text-stone-900">{value}</strong>
    </div>
  );
}
