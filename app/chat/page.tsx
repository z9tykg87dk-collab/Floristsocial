import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export default async function ChatPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Not signed in</div>;
  }

  const supabase = await createSupabaseServerClient();

  const { data: conversations } = await (supabase as any)
    .from("conversation_participants")
    .select(
      `
      conversation_id,
      conversations (
        id,
        created_at
      )
    `,
    )
    .eq("profile_id", user.id);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Chats</h1>

      <div className="flex flex-col gap-3">
        {conversations?.map((c: { conversation_id: string }) => (
          <Link
            key={c.conversation_id}
            href={`/chat/${c.conversation_id}`}
            className="p-4 border rounded-xl hover:bg-gray-50"
          >
            Chat {c.conversation_id}
          </Link>
        ))}
      </div>
    </main>
  );
}
