import { supabase } from "@/lib/supabase"
import FloristProfile from "@/components/FloristProfile"

export default async function FloristPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: florist } = await supabase
    .from("florists")
    .select("*")
    .eq("id", id)
    .single()

  const myFloristId = "0d4fbbd0-c02e-46c0-a27a-6fd2a8bb52f3"

  return (
    <FloristProfile
      florist={florist}
      myFloristId={myFloristId}
    />
  )
}
