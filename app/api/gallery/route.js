import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: plants } = await supabase
    .from("plants")
    .select("id, name, species_name")
    .eq("is_public", true);

  if (!plants || plants.length === 0) {
    return NextResponse.json([]);
  }

  const plantIds = plants.map(p => p.id);
  const { data: entries } = await supabase
    .from("diary_entries")
    .select("plant_id, date, photos, note")
    .in("plant_id", plantIds)
    .order("date", { ascending: false });

  const flat = [];
  const seen = new Set();
  for (const entry of (entries || [])) {
    for (const src of (entry.photos || [])) {
      if (!seen.has(src)) {
        seen.add(src);
        const plant = plants.find(p => p.id === entry.plant_id);
        flat.push({
          src,
          date: entry.date,
          plantName: plant?.name,
          speciesName: plant?.species_name,
          note: entry.note,
        });
      }
    }
  }

  return NextResponse.json(flat);
}
