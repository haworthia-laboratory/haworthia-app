"use client";

import Link from "next/link";
import { useState } from "react";
import { species } from "../zukan/data";

function getTraits(s) {
  const text = s.name + " " + s.description;
  const id = s.id;

  const isSoft =
    text.includes("軟葉") || text.includes("柔らか") || text.includes("ぷっくり") ||
    text.includes("船形") || text.includes("窓") ||
    ["obtusa", "cymbiformis", "truncata", "maughanii", "cooperi", "turgida", "bayeri",
     "comptoniana", "emelyae", "pygmaea", "splendens", "picta", "retusa", "mutica",
     "correcta", "springbok", "mirabilis", "lockwoodii", "maraisii", "nortieri",
     "soubi", "suichuu", "shizukuishi", "badin", "badia", "wimii", "green-jem",
     "hakujaden", "shiroko", "hakugei", "tiger-pig", "red-flash", "shiro-usagi",
     "black-magic", "murasaki-botan", "mikaeri-bijin", "hakuseijo", "emerald-flash",
     "kikka-no-mai", "hagoromo", "magnifica"].some(k => id.includes(k)) ||
    s.type === "交配種" || s.type === "選抜種" || s.type === "園芸種";

  // 硬葉系：軟葉系と重複する品種は除外
  const isHard =
    (text.includes("硬葉") || text.includes("硬め") || text.includes("とげ") ||
    ["fasciata", "attenuata", "reinwardtii", "coarctata", "viscosa", "pumila", "maxima",
     "arachnoidea", "bolusii", "blackbeardiana", "serrata", "bruynsii", "koelmaniorum",
     "nitidula", "floribunda", "tessellata", "angustifolia", "translucens",
     "chloracantha", "wittebergensis", "glauca", "decipiens"].some(k => id.includes(k))) &&
    !isSoft;

  // 葉の並び方
  const isFanShape = ["truncata"].some(k => id.includes(k)); // 扇形二列
  const isTower = ["reinwardtii", "coarctata", "viscosa", "glauca"].some(k => id.includes(k)); // 塔状

  // 葉先の形
  const tipRound = // 丸くぷっくり（オブツーサ型）
    ["obtusa", "cooperi", "cymbiformis", "turgida", "pygmaea", "emelyae", "bayeri",
     "splendens", "picta", "mutica", "mirabilis", "correcta", "springbok"].some(k => id.includes(k)) ||
    s.type === "交配種" || s.type === "選抜種";
  const tipFlat = // 平らな切断面（万象・玉扇型）
    ["maughanii", "truncata"].some(k => id.includes(k));
  const tipPointed = // 先が尖る
    ["fasciata", "attenuata", "retusa", "reinwardtii", "coarctata", "viscosa", "pumila",
     "maxima", "tessellata", "arachnoidea", "bolusii", "blackbeardiana", "serrata",
     "bruynsii", "koelmaniorum", "nitidula", "floribunda", "angustifolia", "translucens",
     "herbacea", "chloracantha", "wittebergensis", "glauca", "decipiens",
     "seiun", "vittata", "comptoniana"].some(k => id.includes(k));

  // 窓のパターン
  const windowClear = // クリア・無模様
    ["obtusa", "cymbiformis", "cooperi", "turgida", "pygmaea", "bayeri", "emelyae",
     "mutica", "splendens", "picta"].some(k => id.includes(k)) ||
    s.type === "交配種" || s.type === "選抜種";
  const windowLines = // 条理・細い線
    ["retusa", "vittata", "seiun", "emelyae", "correcta", "springbok", "mirabilis"].some(k => id.includes(k));
  const windowNet = // 網目・格子
    ["tessellata", "comptoniana", "bayeri", "maraisii"].some(k => id.includes(k));
  const windowNone = isHard && !isSoft; // 窓なし（硬葉系）

  // 白い毛
  const hairAll = ["arachnoidea", "cooperi-venusta"].some(k => id.includes(k));
  const hairTip = ["cooperi-pilifera"].some(k => id.includes(k));
  const hairEdge = ["bolusii"].some(k => id.includes(k));

  const hasStripes =
    text.includes("縞") || text.includes("突起") || text.includes("テスタ") ||
    text.includes("白い模様") || text.includes("白点") || text.includes("縦筋") || text.includes("白い線") ||
    ["fasciata", "attenuata", "pumila", "arachnoidea", "tessellata", "vittata", "seiun"].some(k => id.includes(k));

  const isVariegated =
    text.includes("斑") || text.includes("錦") || text.includes("白斑") || text.includes("黄色い") ||
    id.includes("nishiki") || id.includes("variegata") || id.includes("korisato") ||
    id.includes("truncata-variegata") || id.includes("maughanii-variegata");

  const color = s.colorGroup || "green";

  // 購入場所
  const isCommon = // ホームセンター・100均で売られる定番種
    ["fasciata", "attenuata", "cymbiformis", "reinwardtii", "coarctata"].some(k => id.includes(k));
  const isRare = // 専門店・高額品
    ["maughanii", "truncata", "comptoniana", "bayeri", "picta", "splendens",
     "springbok", "dodson", "black-obtusa", "murasaki-obtusa-om", "truncata-elite",
     "maughanii-elite"].some(k => id.includes(k));

  const isSpecies = s.type === "原種";
  const isCultivar = s.type === "園芸種" || s.type === "交配種" || s.type === "選抜種";

  return {
    isSoft, isHard, isFanShape, isTower,
    tipRound, tipFlat, tipPointed,
    windowClear, windowLines, windowNet, windowNone,
    hairAll, hairTip, hairEdge,
    hasStripes, isVariegated, color,
    isCommon, isRare, isSpecies, isCultivar,
  };
}

// 全問終了後に出す追加質問（品種特定モード用・シビア）
const EXTRA_QUESTIONS = [
  {
    id: "size",
    text: "株の大きさは？",
    hint: "ロゼット全体の直径の目安",
    options: [
      { label: "3cm以下（親指くらい）", value: "tiny" },
      { label: "5〜10cm（手のひらサイズ）", value: "medium" },
      { label: "10cm以上（大きめ）", value: "large" },
      { label: "わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const id = s.id;
      if (v === "tiny") return ["pygmaea", "bruynsii", "cooperi-doldii", "cooperi-gordoniana"].some(k => id.includes(k));
      if (v === "large") return ["comptoniana", "blackbeardiana", "pumila", "maxima", "bolusii"].some(k => id.includes(k));
      return true;
    },
  },
  {
    id: "color-change",
    text: "季節や光で\n葉の色が変わる？",
    hint: "秋〜冬に色が濃くなったり赤くなったりするか",
    options: [
      { label: "紫・黒に変わる", value: "purple" },
      { label: "赤・ピンクに変わる", value: "red" },
      { label: "あまり変わらない", value: "stable" },
      { label: "わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const text = s.name + s.description;
      if (v === "purple") return text.includes("紫") || text.includes("黒") || text.includes("ブラック");
      if (v === "red") return text.includes("赤") || text.includes("紅") || text.includes("ピンク");
      if (v === "stable") return !text.includes("紫") && !text.includes("黒") && !text.includes("赤") && !text.includes("紅");
      return true;
    },
  },
  {
    id: "child",
    text: "子株（脇芽）が\nよく出る？",
    hint: "親株の周りに小さい株が出てくるか",
    options: [
      { label: "たくさん出る", value: "yes" },
      { label: "ほとんど出ない", value: "no" },
      { label: "わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const id = s.id;
      if (v === "no") return ["maughanii", "truncata"].some(k => id.includes(k));
      if (v === "yes") return ["tessellata", "cooperi", "cymbiformis", "turgida"].some(k => id.includes(k));
      return true;
    },
  },
];

// おすすめ探しモード用追加質問（好み・雰囲気ベース）
const EXTRA_QUESTIONS_EXPLORE = [
  {
    id: "size-pref",
    text: "どのくらいの\nサイズが好き？",
    hint: "育てるスペースや好みのサイズ感で",
    options: [
      { label: "小さくてかわいい（ミニサイズ）", value: "tiny" },
      { label: "手のひらにのる、ちょうどいいサイズ", value: "medium" },
      { label: "どっしり大きめの存在感がほしい", value: "large" },
      { label: "こだわらない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const id = s.id;
      if (v === "tiny") return ["pygmaea", "bruynsii", "cooperi-doldii", "cooperi-gordoniana"].some(k => id.includes(k));
      if (v === "large") return ["comptoniana", "blackbeardiana", "pumila", "maxima", "bolusii"].some(k => id.includes(k));
      return true;
    },
  },
  {
    id: "color-pref",
    text: "どんな色に\n変化する子が好き？",
    hint: "秋〜冬の光を浴びたときの姿",
    options: [
      { label: "紫・黒に染まる神秘的な子", value: "purple" },
      { label: "赤・ピンクに色づく華やかな子", value: "red" },
      { label: "一年中安定した緑でいてほしい", value: "stable" },
      { label: "どちらでも", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const text = s.name + s.description;
      if (v === "purple") return text.includes("紫") || text.includes("黒") || text.includes("ブラック");
      if (v === "red") return text.includes("赤") || text.includes("紅") || text.includes("ピンク");
      if (v === "stable") return !text.includes("紫") && !text.includes("黒") && !text.includes("赤") && !text.includes("紅");
      return true;
    },
  },
];

const QUESTIONS = [
  {
    id: "group",
    text: "どの系統に\n興味がありますか？",
    hint: "好きな系統があれば絞り込めます。わからなければ「気にしない」でOK",
    options: [
      { label: "オブツーサ系　ぷっくり・半透明の窓", value: "オブツーサ系" },
      { label: "万象・玉扇系　葉先が平ら・幾何学模様", value: "万象・玉扇系" },
      { label: "クーペリー系　繊細・毛や繊維がある", value: "クーペリー系" },
      { label: "コンプトニアナ系　網目模様・大型", value: "コンプトニアナ系" },
      { label: "ボエルゲリー系　青みがかった丸い窓", value: "ボエルゲリー系" },
      { label: "軟葉系　ぷっくり系その他の原種", value: "軟葉系" },
      { label: "硬葉系　硬くてとがった葉・縞模様", value: "硬葉系" },
      { label: "交配種　品種改良・カラフルな個体", value: "交配種" },
      { label: "気にしない・わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      return s.group === v;
    },
  },
  {
    id: "color",
    text: "葉の色は？",
    hint: "パッと見の印象で選んでください",
    options: [
      { label: "緑・青みがかった緑", value: "green" },
      { label: "紫・黒っぽい", value: "dark" },
      { label: "白・斑入り・グレーっぽい", value: "pale" },
    ],
    filter: (s, v) => {
      const t = getTraits(s);
      if (v === "dark") return t.color === "dark" || t.color === "purple";
      if (v === "pale") return t.color === "white" || t.color === "gray" || t.isVariegated;
      return t.color === "green" || t.color === "blue";
    },
  },
  {
    id: "hair",
    text: "葉に白い毛や\n糸状のものがある？",
    hint: "目立つ毛・繊維があればすぐわかります",
    options: [
      { label: "葉全体が白い毛で覆われている", value: "all" },
      { label: "葉先だけに長い毛がある", value: "tip" },
      { label: "縁に白い糸・繊維が出ている", value: "edge" },
      { label: "毛はない", value: "none" },
    ],
    filter: (s, v) => {
      const t = getTraits(s);
      if (v === "all") return t.hairAll;
      if (v === "tip") return t.hairTip;
      if (v === "edge") return t.hairEdge;
      return !t.hairAll && !t.hairTip && !t.hairEdge;
    },
  },
  {
    id: "texture",
    text: "葉は柔らかくて\nぷっくりしている？",
    hint: "触るとぷにぷに vs かたくてとがっている",
    options: [
      { label: "ぷっくり柔らかい", value: "soft" },
      { label: "硬くてとがっている", value: "hard" },
      { label: "わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const t = getTraits(s);
      if (v === "soft") return t.isSoft || !t.isHard;
      if (v === "hard") return t.isHard || !t.isSoft;
      return true;
    },
  },
  {
    id: "tip",
    text: "葉の先端の形は？",
    hint: "葉の一番先っちょを見てください",
    options: [
      { label: "丸くぷっくりしている", value: "round" },
      { label: "平らに切断されたような面がある", value: "flat" },
      { label: "先が尖っている", value: "pointed" },
      { label: "わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const t = getTraits(s);
      if (v === "round") return t.tipRound;
      if (v === "flat") return t.tipFlat;
      if (v === "pointed") return t.tipPointed;
      return true;
    },
  },
  {
    id: "rosette",
    text: "株全体の形は？",
    hint: "少し引いて全体を見てみてください",
    options: [
      { label: "扇形に二列に並んでいる", value: "fan" },
      { label: "茎が伸びて塔・柱のようになっている", value: "tower" },
      { label: "花のように放射状に広がっている", value: "rosette" },
      { label: "わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const t = getTraits(s);
      if (v === "fan") return t.isFanShape;
      if (v === "tower") return t.isTower;
      if (v === "rosette") return !t.isFanShape && !t.isTower;
      return true;
    },
  },
  {
    id: "stripes",
    text: "葉に白い縞や\n突起がある？",
    hint: "白い点・線・イボ状の突起など",
    options: [
      { label: "ある", value: "yes" },
      { label: "ない・目立たない", value: "no" },
      { label: "わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const t = getTraits(s);
      if (v === "yes") return t.hasStripes;
      if (v === "no") return !t.hasStripes;
      return true;
    },
  },
  {
    id: "window-pattern",
    text: "葉を光にかざすと\n透明な部分（窓）に模様は？",
    hint: "スマホライトを当てると見やすいです",
    options: [
      { label: "クリアで模様がない", value: "clear" },
      { label: "細い平行な筋が走っている", value: "lines" },
      { label: "網目・格子状の模様がある", value: "net" },
      { label: "透明な部分がない", value: "none" },
      { label: "わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const t = getTraits(s);
      if (v === "clear") return t.windowClear;
      if (v === "lines") return t.windowLines;
      if (v === "net") return t.windowNet;
      if (v === "none") return t.windowNone;
      return true;
    },
  },
  {
    id: "source",
    text: "どこで手に入れましたか？",
    hint: "覚えている範囲で選んでください",
    options: [
      { label: "ホームセンター・100均（〜1000円）", value: "common" },
      { label: "多肉専門店・ネット通販（1万円以上）", value: "rare" },
      { label: "もらいもの・わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const t = getTraits(s);
      if (v === "common") return t.isCommon || (!t.isRare && !t.isCultivar);
      if (v === "rare") return t.isRare || t.isCultivar;
      return true;
    },
  },
];

function IdentifyIcon() {
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      <defs><filter id="fi"><feGaussianBlur stdDeviation="0.5"/></filter></defs>
      <circle cx="26" cy="26" r="16" fill="rgba(160,148,136,0.18)" stroke="#b0a498" strokeWidth="1.8" filter="url(#fi)"/>
      <circle cx="26" cy="26" r="16" fill="none" stroke="#887870" strokeWidth="1.1" opacity="0.8"/>
      <line x1="38" y1="38" x2="51" y2="51" stroke="#9a8e84" strokeWidth="2.8" strokeLinecap="round"/>
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      <line x1="32" y1="52" x2="32" y2="38" stroke="#9a8e84" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M32,38 Q24,32 15,22" fill="none" stroke="#9a8e84" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M32,38 Q40,32 49,22" fill="none" stroke="#9a8e84" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="38" x2="32" y2="20" stroke="#9a8e84" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="13" cy="18" rx="7" ry="5.5" fill="rgba(122,154,122,0.28)" stroke="#7a9a7a" strokeWidth="1.4"/>
      <ellipse cx="51" cy="18" rx="7" ry="5.5" fill="rgba(122,154,122,0.28)" stroke="#7a9a7a" strokeWidth="1.4"/>
      <ellipse cx="32" cy="14" rx="7" ry="5.5" fill="rgba(122,154,122,0.28)" stroke="#7a9a7a" strokeWidth="1.4"/>
      <circle cx="32" cy="53" r="2.5" fill="rgba(160,148,136,0.35)" stroke="#9a8e84" strokeWidth="1.2"/>
    </svg>
  );
}

// 「品種を特定する」モード：グループ質問を除いた特徴質問
const IDENTIFY_QUESTIONS = QUESTIONS.filter(q => q.id !== "group");
// 「系統から探す」モード：グループ質問を先頭に、残りは好み寄りの質問
const EXPLORE_QUESTIONS = QUESTIONS;

// 名前の雰囲気カテゴリ
const NAME_CATEGORIES = [
  {
    value: "myth",
    label: "🐉 神話・伝説系",
    desc: "酒呑童子・九尾狐・白蛇伝など",
    filter: (s) => /[龍竜鬼狐童仙妖神獣麒麟鳳凰玄武朱雀白虎蛇]/.test(s.name) ||
      ["kyubi", "ryujo", "shuten", "hakuteijo", "mermaid", "hakujaden", "hakugei"].some(k => s.id.includes(k)) ||
      s.name.includes("マーメイド"),
    sub: [
      {
        label: "🦊 和の霊獣・妖怪",
        desc: "九尾狐・酒呑童子・白蛇伝など",
        filter: (s) => /[龍竜鬼狐童仙妖獣蛇]/.test(s.name) ||
          ["kyubi", "ryujo", "shuten", "hakujaden", "shiroko", "onigawara", "sennyokou"].some(k => s.id.includes(k)),
      },
      {
        label: "🧜 ファンタジー・幻想生物",
        desc: "マーメイド・白鯨など",
        filter: (s) => s.name.includes("マーメイド") || s.name.includes("白鯨") || ["mermaid", "hakugei"].some(k => s.id.includes(k)),
      },
      {
        label: "🏯 幻の城・宮殿",
        desc: "白帝城・紫禁城・夢殿など",
        filter: (s) => /[城宮殿宝楼]/.test(s.name) ||
          ["hakuteijo"].some(k => s.id.includes(k)),
      },
      { label: "すべて見る", desc: "", filter: (s) => /[龍竜鬼狐童仙妖神獣麒麟鳳凰玄武朱雀白虎蛇]/.test(s.name) || ["kyubi", "ryujo", "shuten", "hakuteijo", "mermaid", "hakujaden", "hakugei"].some(k => s.id.includes(k)) || s.name.includes("マーメイド") },
    ],
  },
  {
    value: "nature",
    label: "🌊 自然・情景系",
    desc: "氷河・群雲・翠嵐など",
    filter: (s) => /[氷雲嵐雪川滝海山森霧霜露空星月風雨]/.test(s.name) ||
      ["hyoga", "murakumo", "suiran", "hikawa"].some(k => s.id.includes(k)),
    sub: [
      {
        label: "❄️ 水・氷・雪",
        desc: "氷河・氷川など",
        filter: (s) => /[氷雪川滝海露霜]/.test(s.name) || ["hyoga", "hikawa"].some(k => s.id.includes(k)),
      },
      {
        label: "🌫️ 空・雲・嵐",
        desc: "群雲・翠嵐など",
        filter: (s) => /[雲嵐霧空風星月]/.test(s.name) || ["murakumo", "suiran"].some(k => s.id.includes(k)),
      },
      {
        label: "🏔️ 山・森・大地",
        desc: "山・森などの名を持つ品種",
        filter: (s) => /[山森岳峰野原]/.test(s.name),
      },
      { label: "すべて見る", desc: "", filter: (s) => /[氷雲嵐雪川滝海山森霧霜露空星月風雨]/.test(s.name) || ["hyoga", "murakumo", "suiran", "hikawa"].some(k => s.id.includes(k)) },
    ],
  },
  {
    value: "wabi",
    label: "🌸 和の情景系",
    desc: "氷川玉露・花時計・青雲の舞など",
    filter: (s) => /[玉花舞姫錦雅美麗華彩紫桜梅菊蘭]/.test(s.name) ||
      ["hanadokei", "hikawa-gyokuro", "seiun"].some(k => s.id.includes(k)),
    sub: [
      {
        label: "🌸 花・植物",
        desc: "花時計など",
        filter: (s) => /[花桜梅菊蘭藤葵]/.test(s.name) || ["hanadokei"].some(k => s.id.includes(k)),
      },
      {
        label: "💎 玉・宝石",
        desc: "氷川玉露など",
        filter: (s) => /[玉珠璃宝]/.test(s.name) || ["hikawa-gyokuro"].some(k => s.id.includes(k)),
      },
      {
        label: "💃 舞・動き・情景",
        desc: "青雲の舞など",
        filter: (s) => /[舞踊景色彩]/.test(s.name) || ["seiun"].some(k => s.id.includes(k)),
      },
      { label: "すべて見る", desc: "", filter: (s) => /[玉花舞姫錦雅美麗華彩紫桜梅菊蘭]/.test(s.name) || ["hanadokei", "hikawa-gyokuro", "seiun"].some(k => s.id.includes(k)) },
    ],
  },
  {
    value: "fantasy",
    label: "💎 宝石・スイーツ系",
    desc: "氷砂糖・碧瑠璃・琥珀など",
    filter: (s) => /[瑠璃晶玻璃翡翠琥珀碧]/.test(s.name) || /[砂糖蜜]/.test(s.name) ||
      ["heki-ruri", "kyu-korisato", "shin-korisato", "kori-sato", "hybrid-amber"].some(k => s.id.includes(k)),
    sub: [
      {
        label: "💎 宝石・鉱物",
        desc: "碧瑠璃・琥珀など",
        filter: (s) => /[瑠璃晶玻璃翡翠琥珀碧]/.test(s.name) || ["heki-ruri", "hybrid-amber"].some(k => s.id.includes(k)),
      },
      {
        label: "🍬 スイーツ・甘い名前",
        desc: "氷砂糖など",
        filter: (s) => /[砂糖蜜]/.test(s.name) || ["kyu-korisato", "shin-korisato", "kori-sato"].some(k => s.id.includes(k)),
      },
      { label: "すべて見る", desc: "", filter: (s) => /[瑠璃晶玻璃翡翠琥珀碧]/.test(s.name) || /[砂糖蜜]/.test(s.name) || ["heki-ruri", "kyu-korisato", "shin-korisato", "kori-sato", "hybrid-amber"].some(k => s.id.includes(k)) },
    ],
  },
];

// 印象・雰囲気カテゴリ
const IMPRESSION_CATEGORIES = [
  {
    value: "cool",
    label: "🖤 かっこいい・神秘的",
    desc: "暗い色・鋭い葉・存在感のある品種",
    filter: (s) => ["black", "purple", "dark", "gray"].includes(s.colorGroup) ||
      ["atrofusca", "shuten", "kyubi", "redbull", "murakumo"].some(k => s.id.includes(k)),
  },
  {
    value: "cute",
    label: "🌸 可愛い・やわらかい",
    desc: "丸くてぷっくり・小ぶりな品種",
    filter: (s) => {
      const t = getTraits(s);
      return t.isSoft && t.tipRound && !["comptoniana", "blackbeardiana"].some(k => s.id.includes(k));
    },
  },
  {
    value: "elegant",
    label: "💎 美しい・上品",
    desc: "窓模様・繊細な線・希少品種",
    filter: (s) => ["maughanii", "truncata", "comptoniana", "picta", "splendens", "bayeri", "correcta"].some(k => s.id.includes(k)) ||
      (s.group === "万象・玉扇系"),
  },
  {
    value: "fresh",
    label: "🌿 爽やか・清涼感",
    desc: "青みがかった色・透明感のある葉",
    filter: (s) => ["blue", "green", "white"].includes(s.colorGroup) &&
      ["cooperi", "obtusa", "cymbiformis", "heki-ruri", "hyoga", "hikawa"].some(k => s.id.includes(k)),
  },
  {
    value: "colorful",
    label: "🌈 カラフル・個性的",
    desc: "斑入り・変わった色・目を引く品種",
    filter: (s) => s.type === "園芸種" || s.type === "選抜種" ||
      s.id.includes("nishiki") || s.id.includes("variegata") ||
      ["red", "purple", "blue"].includes(s.colorGroup),
  },
  {
    value: "minimal",
    label: "🤍 シンプル・ミニマル",
    desc: "すっきりした形・定番で育てやすい品種",
    filter: (s) => {
      const t = getTraits(s);
      return t.isCommon || (t.isHard && !t.isVariegated);
    },
  },
];

// 名前の雰囲気アイコン：カラフルなインクがふわふわ混ざるイメージ
function NameIcon() {
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur-ink"><feGaussianBlur stdDeviation="3.5" /></filter>
      </defs>
      {/* ふわふわ混ざるインク */}
      <ellipse cx="26" cy="30" rx="13" ry="10" fill="rgba(130,180,220,0.55)" filter="url(#blur-ink)" />
      <ellipse cx="38" cy="26" rx="11" ry="9" fill="rgba(190,140,210,0.55)" filter="url(#blur-ink)" />
      <ellipse cx="32" cy="38" rx="10" ry="8" fill="rgba(120,200,160,0.55)" filter="url(#blur-ink)" />
      <ellipse cx="22" cy="22" rx="8" ry="7" fill="rgba(240,180,120,0.45)" filter="url(#blur-ink)" />
    </svg>
  );
}

// 印象・雰囲気アイコン：いろんな形が混ざるイメージ
function ImpressionIcon() {
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      {/* 丸（左下） */}
      <circle cx="22" cy="40" r="9" fill="none" stroke="#9ab89c" strokeWidth="1.8" opacity="0.85"/>
      {/* 三角（右上） */}
      <polygon points="42,10 54,30 30,30" fill="none" stroke="#b0a498" strokeWidth="1.8" opacity="0.85"/>
      {/* 菱形（右下） */}
      <polygon points="44,36 52,46 44,56 36,46" fill="none" stroke="#a8a8c0" strokeWidth="1.8" opacity="0.85"/>
    </svg>
  );
}

export default function AkinatorPage() {
  const [mode, setMode] = useState(null); // "identify" | "explore" | "name" | "impression"
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [candidates, setCandidates] = useState(species);
  const [done, setDone] = useState(false);
  const [extraStep, setExtraStep] = useState(0);
  const [inExtra, setInExtra] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null); // サブカテゴリ表示用

  const activeQuestions = mode === "explore" ? EXPLORE_QUESTIONS : IDENTIFY_QUESTIONS;
  const activeExtraQuestions = (mode === "explore" || mode === "name" || mode === "impression")
    ? EXTRA_QUESTIONS_EXPLORE
    : EXTRA_QUESTIONS;

  const handleAnswer = (value) => {
    const q = inExtra ? activeExtraQuestions[extraStep] : activeQuestions[step];
    const next = candidates.filter(s => q.filter(s, value));
    setAnswers([...answers, { q: q.id, v: value }]);
    setCandidates(next);

    if (inExtra) {
      const nextExtra = extraStep + 1;
      if (next.length <= 4 || nextExtra >= activeExtraQuestions.length) {
        setInExtra(false);
        setDone(true);
      } else {
        setExtraStep(nextExtra);
      }
    } else {
      const nextStep = step + 1;
      if (next.length <= 4 || nextStep >= activeQuestions.length) {
        setDone(true);
      } else {
        setStep(nextStep);
      }
    }
  };

  const startExtra = () => {
    setExtraStep(0);
    setInExtra(true);
    setDone(false);
  };

  const selectNameCategory = (cat) => {
    if (cat.sub) {
      setSelectedCat(cat);
    } else {
      const results = species.filter(cat.filter);
      setCandidates(results);
      setDone(true);
    }
  };

  const selectSub = (subFilter) => {
    const results = species.filter(subFilter);
    setCandidates(results);
    setSelectedCat(null);
    setDone(true);
  };

  const selectImpressionCategory = (cat) => {
    const results = species.filter(cat.filter);
    setCandidates(results);
    setDone(true);
  };

  const reset = () => {
    setMode(null);
    setStep(0);
    setAnswers([]);
    setCandidates(species);
    setDone(false);
    setExtraStep(0);
    setInExtra(false);
    setSelectedCat(null);
  };

  const totalQuestions = inExtra ? activeExtraQuestions.length : activeQuestions.length;
  const currentStep = inExtra ? extraStep : step;
  const progress = Math.round((currentStep / totalQuestions) * 100);

  return (
    <main>
      <div className="container">
        <div className="home-hero">
          <div className="home-hero-bg" style={{ backgroundImage: "url('/images/akinator-hero.webp')", opacity: 0.35 }} />
          <Link href="/" className="back-link" style={{ color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.8)", fontWeight: "700", background: "rgba(0,0,0,0.25)", padding: "2px 10px", borderRadius: "20px" }}>← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>品種診断</h1>
        </div>

        {/* モード選択 */}
        {!mode ? (
          <div className="aki-mode-select">
            <button className="aki-mode-btn" onClick={() => setMode("identify")}>
              <div className="aki-mode-icon"><IdentifyIcon /></div>
              <span className="aki-mode-title">品種を特定する</span>
              <span className="aki-mode-desc">手元の株が何か調べたい</span>
            </button>
            <button className="aki-mode-btn" onClick={() => setMode("explore")}>
              <div className="aki-mode-icon"><ExploreIcon /></div>
              <span className="aki-mode-title">系統から探す</span>
              <span className="aki-mode-desc">好きな系統のおすすめを知りたい</span>
            </button>
            <button className="aki-mode-btn" onClick={() => setMode("name")}>
              <div className="aki-mode-icon"><NameIcon /></div>
              <span className="aki-mode-title">名前の雰囲気から探す</span>
              <span className="aki-mode-desc">神話・伝説・自然・宝石系など</span>
            </button>
            <button className="aki-mode-btn" onClick={() => setMode("impression")}>
              <div className="aki-mode-icon"><ImpressionIcon /></div>
              <span className="aki-mode-title">印象・雰囲気から探す</span>
              <span className="aki-mode-desc">かっこいい・可愛い・爽やかなど</span>
            </button>
          </div>
        ) : mode === "name" && !done && !inExtra && selectedCat ? (
          <div className="aki-card">
            <div className="aki-question">{selectedCat.label}</div>
            <div className="aki-hint">さらに絞り込めます</div>
            <div className="aki-options">
              {selectedCat.sub.map(sub => (
                <button key={sub.label} className="aki-option-btn" onClick={() => selectSub(sub.filter)}>
                  <span>{sub.label}</span>
                  {sub.desc && <span style={{ fontSize: "0.65rem", color: "#a0b8a2", display: "block", marginTop: "0.2rem" }}>{sub.desc}</span>}
                </button>
              ))}
            </div>
            <button className="aki-back-btn" onClick={() => setSelectedCat(null)}>← カテゴリ選択に戻る</button>
          </div>
        ) : mode === "name" && !done && !inExtra ? (
          <div className="aki-card">
            <div className="aki-question">名前の雰囲気で選んでください</div>
            <div className="aki-hint">ぴんとくるカテゴリを選ぶと該当品種を表示します</div>
            <div className="aki-options">
              {NAME_CATEGORIES.map(cat => (
                <button key={cat.value} className="aki-option-btn" onClick={() => selectNameCategory(cat)}>
                  <span>{cat.label}</span>
                  <span style={{ fontSize: "0.65rem", color: "#a0b8a2", display: "block", marginTop: "0.2rem" }}>{cat.desc}</span>
                </button>
              ))}
            </div>
            <button className="aki-back-btn" onClick={reset}>← モード選択に戻る</button>
          </div>
        ) : mode === "impression" && !done && !inExtra ? (
          <div className="aki-card">
            <div className="aki-question">どんな印象の品種を探していますか？</div>
            <div className="aki-hint">直感で選んでください</div>
            <div className="aki-options">
              {IMPRESSION_CATEGORIES.map(cat => (
                <button key={cat.value} className="aki-option-btn" onClick={() => selectImpressionCategory(cat)}>
                  <span>{cat.label}</span>
                  <span style={{ fontSize: "0.65rem", color: "#a0b8a2", display: "block", marginTop: "0.2rem" }}>{cat.desc}</span>
                </button>
              ))}
            </div>
            <button className="aki-back-btn" onClick={reset}>← モード選択に戻る</button>
          </div>
        ) : !done ? (
          <>
            {/* モード切替タブ */}
            <div className="aki-mode-tabs">
              <button
                className={`aki-mode-tab${mode === "identify" ? " active" : ""}`}
                onClick={() => { setMode("identify"); setStep(0); setAnswers([]); setCandidates(species); setDone(false); setInExtra(false); setExtraStep(0); }}
              >品種を特定する</button>
              <button
                className={`aki-mode-tab${mode === "explore" ? " active" : ""}`}
                onClick={() => { setMode("explore"); setStep(0); setAnswers([]); setCandidates(species); setDone(false); setInExtra(false); setExtraStep(0); }}
              >系統から探す</button>
            </div>

            <div className="aki-progress-wrap">
              <div className="aki-progress-bar">
                <div className="aki-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="aki-progress-label">{inExtra ? "追加Q" : "Q"}{currentStep + 1} / {totalQuestions}</span>
            </div>

            <div className="aki-candidates-count">
              候補：<strong>{candidates.length}</strong> 種
            </div>

            <div className="aki-card">
              <div className="aki-question">
                {(inExtra ? activeExtraQuestions[extraStep] : activeQuestions[step]).text.split("\n").map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 ? <br /> : ""}</span>
                ))}
              </div>
              <div className="aki-hint">{(inExtra ? activeExtraQuestions[extraStep] : activeQuestions[step]).hint}</div>
              <div className="aki-options">
                {(inExtra ? activeExtraQuestions[extraStep] : activeQuestions[step]).options.filter((opt) => {
                  const q = inExtra ? activeExtraQuestions[extraStep] : activeQuestions[step];
                  if (opt.value === "unknown") return true;
                  return candidates.filter(s => q.filter(s, opt.value)).length > 0;
                }).map((opt) => (
                  <button
                    key={opt.value}
                    className="aki-option-btn"
                    onClick={() => handleAnswer(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {step > 0 && !inExtra && (
              <button className="aki-back-btn" onClick={() => {
                const prevStep = step - 1;
                setStep(prevStep);
                const prevAnswers = answers.slice(0, -1);
                setAnswers(prevAnswers);
                let c = species;
                for (let i = 0; i < prevStep; i++) {
                  c = c.filter(s => activeQuestions[i].filter(s, prevAnswers[i].v));
                }
                setCandidates(c);
              }}>← 前の質問に戻る</button>
            )}
            {step === 0 && !inExtra && (
              <button className="aki-back-btn" onClick={reset}>← モード選択に戻る</button>
            )}
          </>
        ) : (
          <>
            {/* モード切替タブ（結果画面でも表示） */}
            <div className="aki-mode-tabs">
              <button
                className={`aki-mode-tab${mode === "identify" ? " active" : ""}`}
                onClick={() => { setMode("identify"); setStep(0); setAnswers([]); setCandidates(species); setDone(false); setInExtra(false); setExtraStep(0); }}
              >品種を特定する</button>
              <button
                className={`aki-mode-tab${mode === "explore" ? " active" : ""}`}
                onClick={() => { setMode("explore"); setStep(0); setAnswers([]); setCandidates(species); setDone(false); setInExtra(false); setExtraStep(0); }}
              >系統から探す</button>
            </div>

            <div className="aki-result-header">
              {candidates.length === 0 ? (
                <p className="aki-no-result">候補が見つかりませんでした。<br />「わからない」を多めに使って再挑戦してみてください。</p>
              ) : (
                <p className="aki-result-label">
                  {(mode === "explore" || mode === "name" || mode === "impression")
                    ? (candidates.length === 1 ? "この子がおすすめ" : `${candidates.length} 種がおすすめです`)
                    : (candidates.length === 1 ? "これでは？" : `候補は ${candidates.length} 種あります`)}
                </p>
              )}
            </div>

            <div className="aki-results">
              {candidates.slice(0, 8).map((s, i) => (
                <Link key={s.id} href={`/zukan/${s.id}`} className="aki-result-card" style={{ "--accent": s.accent }}>
                  <div className="aki-result-rank">{i + 1}</div>
                  <div className="aki-result-body">
                    <div className="aki-result-type">{s.type}</div>
                    <div className="aki-result-name">{s.name}</div>
                    <div className="aki-result-sci">{s.scientific}</div>
                  </div>
                  <div className="aki-result-arrow">›</div>
                </Link>
              ))}
            </div>

            {candidates.length > 4 && !inExtra && activeExtraQuestions.length > 0 && (
              <button className="aki-extra-btn" onClick={startExtra}>
                もう少し絞り込む（追加質問へ）
              </button>
            )}
            <button className="aki-reset-btn" onClick={reset}>モード選択に戻る</button>
          </>
        )}
      </div>
    </main>
  );
}
