import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // サービスロールキーがあればRLS無視、なければ匿名キーで試みる
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);

  // plants.is_public = true の株を取得
  const { data: plants, error: plantErr } = await supabase
    .from("plants")
    .select("id, name, species_name")
    .eq("is_public", true);

  if (plantErr || !plants || plants.length === 0) {
    return NextResponse.json([]);
  }

  const plantIds = plants.map(p => p.id);

  // その株の全日記エントリを取得（写真あり）
  const { data: entries } = await supabase
    .from("diary_entries")
    .select("plant_id, date, photos, note")
    .in("plant_id", plantIds)
    .not("photos", "is", null)
    .order("date", { ascending: false });

  // plant_id ごとにグループ化
  const plantMap = new Map();
  for (const plant of plants) {
    plantMap.set(plant.id, {
      plantId: plant.id,
      plantName: plant.name,
      speciesName: plant.species_name,
      photos: [],
      latestDate: null,
      latestNote: null,
    });
  }

  for (const entry of (entries || [])) {
    const group = plantMap.get(entry.plant_id);
    if (!group) continue;
    for (const src of (entry.photos || [])) {
      if (!group.photos.includes(src)) {
        group.photos.push(src);
      }
    }
    if (!group.latestDate || entry.date > group.latestDate) {
      group.latestDate = entry.date;
      group.latestNote = entry.note;
    }
  }

  // 写真がある株のみ返す
  const result = [...plantMap.values()].filter(g => g.photos.length > 0);
  return NextResponse.json(result);
}
