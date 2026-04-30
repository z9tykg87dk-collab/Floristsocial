import { SupabaseClient } from "@supabase/supabase-js"

export const startChat = async (
  supabase: SupabaseClient,
  myFloristId: string,
  targetFloristId: string
) => {
  // 1. Kolla om conversation redan finns
  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("*")
    .or(
      `and(florist_1.eq.${myFloristId},florist_2.eq.${targetFloristId}),and(florist_1.eq.${targetFloristId},florist_2.eq.${myFloristId})`
    )
    .limit(1)
    .maybeSingle()

  if (findError) {
    console.error("Find conversation error:", findError)
    throw findError
  }

  // 2. Om finns → returnera den
  if (existing) {
    return existing.id
  }

  // 3. Annars skapa ny
  const { data: convo, error } = await supabase
    .from("conversations")
    .insert({
      florist_1: myFloristId,
      florist_2: targetFloristId,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Create conversation error:", error)
    throw error
  }

  return convo.id
}
