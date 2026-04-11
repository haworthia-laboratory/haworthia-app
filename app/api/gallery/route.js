import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);

  // diary_entries.is_public = true のエントリを取得
  const { data: entries, error } = await supabase
    .from("diary_entries")
    .select("plant_id, date, photos, note, plant_name, species_name")
    .eq("is_public", true)
    .order("date", { ascending: false });

  if (error || !entries || entries.length === 0) {
    return NextResponse.json([]);
  }

  // plant_id ごとにグループ化
  const plantMap = new Map();
  for (const entry of entries) {
    const key = entry.plant_id || `${entry.plant_name}_${entry.species_name}`;
    if (!plantMap.has(key)) {
      plantMap.set(key, {
        plantId: entry.plant_id,
        plantName: entry.plant_name,
        speciesName: entry.species_name,
        photos: [],
        latestDate: entry.date,
        latestNote: entry.note,
      });
    }
    const group = plantMap.get(key);
    for (const src of (entry.photos || [])) {
      if (!group.photos.includes(src)) {
        group.photos.push(src);
      }
    }
    if (entry.date > group.latestDate) {
      group.latestDate = entry.date;
      group.latestNote = entry.note;
    }
  }

  return NextResponse.json([...plantMap.values()].filter(g => g.photos.length > 0));
}
