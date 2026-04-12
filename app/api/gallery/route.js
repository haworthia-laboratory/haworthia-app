import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);

  // is_public = true の植物IDを取得
  const { data: publicPlants, error: plantsError } = await supabase
    .from("plants")
    .select("id, name, species_name, species_id")
    .eq("is_public", true);

  if (plantsError) return NextResponse.json({ debug: "plants error", error: plantsError.message });
  if (!publicPlants || publicPlants.length === 0) {
    return NextResponse.json({ debug: "no public plants", count: publicPlants?.length });
  }

  const publicPlantIds = publicPlants.map(p => p.id);
  const plantMap = new Map(publicPlants.map(p => [p.id, p]));

  // 公開植物のエントリを取得
  const { data: entries, error } = await supabase
    .from("diary_entries")
    .select("plant_id, date, photos, note, plant_name, species_name")
    .in("plant_id", publicPlantIds)
    .order("date", { ascending: false });

  if (error || !entries || entries.length === 0) {
    return NextResponse.json({ debug: "no entries", error: error?.message, plantsCount: publicPlants.length });
  }

  // plant_id ごとにグループ化
  const groupMap = new Map();
  for (const entry of entries) {
    const key = entry.plant_id;
    if (!groupMap.has(key)) {
      const plant = plantMap.get(key);
      groupMap.set(key, {
        plantId: key,
        plantName: plant?.name || entry.plant_name,
        speciesName: plant?.species_name || entry.species_name,
        photos: [],
        latestDate: entry.date,
        latestNote: entry.note,
      });
    }
    const group = groupMap.get(key);
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

  return NextResponse.json([...groupMap.values()].filter(g => g.photos.length > 0));
}
