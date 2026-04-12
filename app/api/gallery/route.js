import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);

  // 公開中の植物IDを取得
  const { data: publicPlants, error: plantsError } = await supabase
    .from("plants")
    .select("id, species_id, species_name")
    .eq("is_public", true);

  if (plantsError || !publicPlants || publicPlants.length === 0) {
    return NextResponse.json([]);
  }

  const publicPlantIds = publicPlants.map(p => p.id);

  // 公開株のエントリを日付降順で取得（1枚目のみ）
  const { data: entries, error } = await supabase
    .from("diary_entries")
    .select("plant_id, date, note, species_id, species_name, photos->0")
    .in("plant_id", publicPlantIds)
    .order("date", { ascending: false });

  if (error || !entries || entries.length === 0) {
    return NextResponse.json([]);
  }

  // 品種ごとに最新1件だけ残す
  const speciesMap = new Map();
  for (const entry of entries) {
    const photo = entry["photos->0"] || entry.photos;
    if (!photo) continue;
    const key = entry.species_id || entry.species_name || entry.plant_id;
    if (!speciesMap.has(key)) {
      speciesMap.set(key, {
        speciesId: entry.species_id,
        speciesName: entry.species_name,
        photos: [photo],
        latestDate: entry.date,
        latestNote: entry.note,
      });
    }
  }

  return NextResponse.json([...speciesMap.values()]);
}
