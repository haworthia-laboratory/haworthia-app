import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);

  // is_public = true の植物を取得
  const { data: publicPlants, error: plantsError } = await supabase
    .from("plants")
    .select("id, name, species_name")
    .eq("is_public", true);

  if (plantsError || !publicPlants || publicPlants.length === 0) {
    return NextResponse.json([]);
  }

  const publicPlantIds = publicPlants.map(p => p.id);
  const plantMap = new Map(publicPlants.map(p => [p.id, p]));

  // 各植物の最新エントリを1件ずつ取得（photos全体ではなく1枚目だけ）
  const results = await Promise.all(
    publicPlantIds.map(plantId =>
      supabase
        .from("diary_entries")
        .select("plant_id, date, note, photos->0")
        .eq("plant_id", plantId)
        .order("date", { ascending: false })
        .limit(1)
        .single()
    )
  );

  const groups = results
    .map(({ data }) => {
      if (!data) return null;
      const photo = data["photos->0"] || data.photos;
      if (!photo) return null;
      const plant = plantMap.get(data.plant_id);
      return {
        plantId: data.plant_id,
        plantName: plant?.name,
        speciesName: plant?.species_name,
        photos: [photo],
        latestDate: data.date,
        latestNote: data.note,
      };
    })
    .filter(Boolean);

  return NextResponse.json(groups);
}
