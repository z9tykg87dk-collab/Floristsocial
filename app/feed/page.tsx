export default function FeedPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
        Social feed
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
        Basic social layer for florist posts, likes and comments.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
        Keep this lean for V1. The feed should follow the commerce model, not
        distract from it.
      </p>
    </main>
  );
}
