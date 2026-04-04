import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: "v1" });

const PROMPT = `あなたはハオルチアの専門家です。以下の4品種を識別してください。

【識別対象品種】

1. 旧氷砂糖（Haworthia turgida f. variegata）
   - 白い斑（白斑）が入った軟葉系
   - 白と緑のまだら模様、結晶のような白い部分が特徴
   - 小型のロゼット、半透明感がある
   - 「氷砂糖」の名の通り白くキラキラした見た目

2. 青雲の舞（Haworthia vittata）
   - 三角形の緑の葉
   - 葉の側面に白い縦縞（窓）が走る
   - 逆光で縦筋が透けて見える
   - やや硬めの葉質

3. シンビフォルミス（Haworthia cymbiformis）
   - 船形（舟形）の柔らかい葉
   - 葉先に透明な窓がある
   - 明るい黄緑色、丸みのある葉先
   - 透明感が高く初心者にも人気の原種

4. ウンブラティコーラ（Haworthia umbraticola）
   - やや硬めの葉質
   - 葉に白い模様や突起（テスタ）がある
   - コンパクトなロゼット
   - 日陰を好む性質を持つ

【回答形式】
必ず以下のJSON形式のみで回答してください。説明文は不要です。

{
  "species": "品種名（日本語）",
  "scientific_name": "学名",
  "confidence": 確信度（0〜100の整数）,
  "description": "この個体の特徴（60字以内、です・ます調）",
  "is_haworthia": true
}

ハオルチア以外の植物が写っている場合、または上記4品種に該当しない場合：
{
  "species": "",
  "scientific_name": "",
  "confidence": 0,
  "description": "",
  "is_haworthia": false
}`;

export async function POST(request) {
  try {
    const { image, mimeType } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const imagePart = {
      inlineData: {
        data: image,
        mimeType: mimeType || "image/jpeg",
      },
    };

    const result = await model.generateContent([PROMPT, imagePart]);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const data = JSON.parse(jsonMatch[0]);
    return Response.json(data);
  } catch (error) {
    console.error("詳細エラー:", error.message);
    return Response.json({ error: "識別に失敗しました", detail: error.message }, { status: 500 });
  }
}
