import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, farm:farms(*), category:categories(*)");
  return Response.json({ data, error });
}
