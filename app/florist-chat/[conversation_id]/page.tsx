import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  CheckCircle2,
  Flower2,
  MapPin,
  Package,
  Paperclip,
  Phone,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  Video,
} from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendMessage } from "../actions/sendMessage";
import VoiceRecorder from "@/components/VoiceRecorder";
import ChatScrollToBottom from "@/components/chat/ChatScrollToBottom";

const demoProducts = [
  {
    title: "Romantisk bukett",
    price: "från 695 kr",
    image: "/design-preview/buketter/bukett-romantisk-rosa-1000.jpg",
  },
  {
    title: "Floristens val",
    price: "från 750 kr",
    image: "/design-preview/buketter/bukett-floristens-val-pastell-750.jpg",
  },
  {
    title: "Eventdekoration",
    price: "från 2 500 kr",
    image: "/design-preview/event/staende-dekoration-6000.jpg",
  },
];

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ conversation_id: string }>;
}) {
  const { conversation_id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: participants } = await supabase
    .from("conversation_participants")
    .select("display_name, florist_name, logo_url")
    .eq("conversation_id", conversation_id);

  const other =
    participants?.find((p) => p.display_name !== "Nick") || participants?.[0];

  const { data: messages } = await supabase
    .from("messages")
    .select(
      "id, sender_id, sender_display_name, sender_florist_name, content, created_at, read_at, message_type, audio_url",
    )
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true });

  const floristName = other?.florist_name || "Florist";
  const displayName = other?.display_name || "FloristSocial kontakt";

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[#fbf7f2] px-4 py-5 text-stone-950 md:px-8">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[34px] bg-white shadow-xl ring-1 ring-stone-200 lg:grid-cols-[280px_1fr_330px]">
        <aside className="hidden border-r border-stone-200 bg-stone-50/80 lg:block">
          <div className="border-b border-stone-200 p-5">
            <Link
              href="/florist-chat"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-stone-800 ring-1 ring-stone-200"
            >
              <ArrowLeft size={16} />
              Samtal
            </Link>

            <h2 className="mt-5 text-2xl font-black">Orderdialoger</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Chatta med kunder, företag och florister inför beställningar.
            </p>
          </div>

          <div className="space-y-2 p-3">
            {[
              "Makalösa Blommor",
              "Studio Flora",
              "Eventflorist",
              "Företag ABC",
            ].map((name, index) => (
              <div
                key={name}
                className={`rounded-2xl p-3 ${
                  index === 0
                    ? "bg-white shadow-sm ring-1 ring-pink-100"
                    : "hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-pink-100 text-lg">
                    🌸
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black">{name}</p>
                    <p className="truncate text-xs font-semibold text-stone-500">
                      Senaste meddelande...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[calc(100vh-140px)] flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-stone-200 bg-white/95 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <Link
                href="/florist-chat"
                className="grid h-10 w-10 place-items-center rounded-full bg-stone-50 text-stone-900 ring-1 ring-stone-200 lg:hidden"
              >
                <ArrowLeft size={20} />
              </Link>

              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-pink-50 ring-1 ring-pink-100">
                {other?.logo_url ? (
                  <Image
                    src={other.logo_url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xl">
                    🌷
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-lg font-black">{floristName}</h1>
                <p className="text-xs font-semibold text-emerald-700">
                  ● Online · {displayName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="grid h-10 w-10 place-items-center rounded-full bg-white text-stone-900 ring-1 ring-stone-200">
                <Phone size={18} />
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-white text-stone-900 ring-1 ring-stone-200">
                <Video size={18} />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#fbf7f2] to-white p-4 md:p-6">
            <div className="mx-auto max-w-3xl space-y-4">
              <div className="mx-auto max-w-xl rounded-[26px] bg-white p-5 text-center shadow-sm ring-1 ring-stone-200">
                <Sparkles className="mx-auto text-pink-600" size={28} />
                <h2 className="mt-3 text-xl font-black">
                  FloristSocial Order Chat
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Ställ frågor, förtydliga detaljer och låt floristen föreslå
                  produkter som passar din beställning.
                </p>
              </div>

              {(messages ?? []).map((msg) => {
                const isMine =
                  msg.sender_id === user?.id ||
                  msg.sender_display_name === "Nick";
                const audioSrc = msg.audio_url || msg.content;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-[24px] px-4 py-3 shadow-sm ring-1 ${
                        isMine
                          ? "rounded-tr-md bg-emerald-100 ring-emerald-200"
                          : "rounded-tl-md bg-white ring-stone-200"
                      }`}
                    >
                      <p className="text-xs font-black text-stone-500">
                        {msg.sender_display_name || msg.sender_florist_name}
                      </p>

                      <div className="mt-2 text-sm leading-6 text-stone-800">
                        {msg.message_type === "audio" && audioSrc ? (
                          <audio
                            controls
                            preload="auto"
                            src={audioSrc}
                            className="w-full"
                          />
                        ) : (
                          <span>{msg.content}</span>
                        )}
                      </div>

                      <p className="mt-2 text-[10px] font-semibold text-stone-400">
                        {msg.created_at ? new Date(msg.created_at).toLocaleString("sv-SE") : ""}
                      </p>
                    </div>
                  </div>
                );
              })}

              <ProductSuggestionCard />
              <ChatScrollToBottom />
            </div>
          </div>

          <footer className="border-t border-stone-200 bg-white p-3">
            <form
              action={sendMessage}
              className="mx-auto grid max-w-3xl grid-cols-[40px_40px_40px_1fr_46px] items-center gap-2"
            >
              <input
                type="hidden"
                name="conversation_id"
                value={conversation_id}
              />

              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full bg-stone-50 text-stone-800 ring-1 ring-stone-200"
              >
                <Paperclip size={18} />
              </button>

              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full bg-stone-50 text-stone-800 ring-1 ring-stone-200"
              >
                <Camera size={18} />
              </button>

              <VoiceRecorder conversationId={conversation_id} />

              <input
                name="content"
                placeholder="Skriv meddelande om beställningen..."
                className="h-11 rounded-full border border-stone-200 bg-stone-50 px-4 text-sm font-semibold outline-none focus:border-pink-300 focus:bg-white"
              />

              <button
                type="submit"
                className="grid h-11 w-11 place-items-center rounded-full bg-pink-600 text-white shadow-lg shadow-pink-600/20"
              >
                <Send size={18} />
              </button>
            </form>
          </footer>
        </section>

        <aside className="hidden border-l border-stone-200 bg-white lg:block">
          <div className="p-5">
            <div className="overflow-hidden rounded-[26px] bg-stone-50 ring-1 ring-stone-200">
              <div className="relative h-36 bg-pink-100">
                <Image
                  src="/design-preview/buketter/bukett-romantisk-rosa-1000.jpg"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-black">{floristName}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-stone-500">
                  <MapPin size={15} className="text-pink-600" />
                  Stockholm
                </p>
                <p className="mt-2 flex items-center gap-1 text-sm font-black text-amber-600">
                  <Star size={15} fill="currentColor" />
                  4.9 · 127 omdömen
                </p>

                <div className="mt-4 grid gap-2">
                  <Link
                    href="/florists"
                    className="rounded-full bg-stone-950 px-4 py-2 text-center text-sm font-black !text-white"
                  >
                    Visa floristprofil
                  </Link>
                  <Link
                    href="/order/private/guest-v4"
                    className="rounded-full bg-pink-600 px-4 py-2 text-center text-sm font-black !text-white"
                  >
                    Skapa beställning
                  </Link>
                </div>
              </div>
            </div>

            <InfoBox />

            <section className="mt-5 rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-stone-200">
              <h3 className="flex items-center gap-2 text-lg font-black">
                <ShoppingBag size={19} />
                Bästa produkter
              </h3>

              <div className="mt-4 space-y-3">
                {demoProducts.map((product) => (
                  <Link
                    key={product.title}
                    href="/order/private/guest-v4"
                    className="flex gap-3 rounded-2xl bg-stone-50 p-3 ring-1 ring-stone-200 transition hover:bg-pink-50"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black">{product.title}</p>
                      <p className="mt-1 text-xs font-semibold text-stone-500">
                        {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ProductSuggestionCard() {
  return (
    <div className="flex justify-start">
      <div className="max-w-md overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-stone-200">
        <div className="relative h-44">
          <Image
            src="/design-preview/buketter/bukett-romantisk-rosa-1000.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">
            Produktförslag
          </p>
          <h3 className="mt-2 text-lg font-black">Romantisk bukett</h3>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Rosa och vit bukett med säsongens blommor. Floristen kan anpassa
            färg, storlek och stil efter önskemål.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/order/private/guest-v4"
              className="rounded-full bg-pink-600 px-4 py-2 text-sm font-black text-white"
            >
              Beställ denna
            </Link>
            <button className="rounded-full bg-stone-50 px-4 py-2 text-sm font-black text-stone-800 ring-1 ring-stone-200">
              Fråga om ändring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox() {
  return (
    <section className="mt-5 rounded-[26px] bg-emerald-50 p-5 ring-1 ring-emerald-100">
      <h3 className="text-lg font-black">Specialiteter</h3>
      <div className="mt-3 grid gap-2">
        {[
          [Flower2, "Buketter & romantiska arrangemang"],
          [Package, "Företagsblommor och event"],
          [CalendarDays, "Bröllop och planerade uppdrag"],
          [CheckCircle2, "Leverans i Stockholm"],
        ].map(([Icon, text]) => (
          <div
            key={text as string}
            className="flex items-center gap-2 text-sm font-semibold text-stone-700"
          >
            <Icon size={16} className="text-emerald-700" />
            {text as string}
          </div>
        ))}
      </div>
    </section>
  );
}
