import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export async function POST(req) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.email !== ADMIN_EMAIL) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { targetId, type } = await req.json();
    if (!targetId || !type) return NextResponse.json({ error: "Invalid params" }, { status: 400 });

    if (type === "topic") {
      await supabaseAdmin.from("forum_likes").delete().eq("target_id", targetId);
      const { data: replies } = await supabaseAdmin.from("forum_replies").select("id").eq("topic_id", targetId);
      if (replies?.length) {
        const replyIds = replies.map((r) => r.id);
        await supabaseAdmin.from("forum_likes").delete().in("target_id", replyIds);
      }
      await supabaseAdmin.from("forum_replies").delete().eq("topic_id", targetId);
      await supabaseAdmin.from("forum_topics").delete().eq("id", targetId);
    } else if (type === "reply") {
      await supabaseAdmin.from("forum_likes").delete().eq("target_id", targetId);
      await supabaseAdmin.from("forum_replies").delete().eq("id", targetId);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
