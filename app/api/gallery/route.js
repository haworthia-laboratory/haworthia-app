import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: entries, error } = await supabase
    .from("diary_entries")
    .select("plant_id, date, photos, note, plant_name, species_name")
    .eq("is_public", true)
    .not("photos", "is", null)
    .order("date", { ascending: false });

  if (error || !entries || entries.length === 0) {
    return NextResponse.json([]);
  }

  const flat = [];
  const seen = new Set();
  for (const entry of entries) {
    for (const src of (entry.photos || [])) {
      if (!seen.has(src)) {
        seen.add(src);
        flat.push({
          src,
          date: entry.date,
          plantName: entry.plant_name,
          speciesName: entry.species_name,
          note: entry.note,
        });
      }
    }
  }

  return NextResponse.json(flat);
}
