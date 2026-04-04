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
     "correcta", "springbok", "mirabilis"].some(k => id.includes(k)) ||
    s.type === "交配種" || s.type === "選抜種";

  const isHard =
    text.includes("硬葉") || text.includes("硬め") || text.includes("とげ") || text.includes("三角") ||
    ["fasciata", "attenuata", "reinwardtii", "coarctata", "viscosa", "pumila", "maxima",
     "arachnoidea", "bolusii", "blackbeardiana", "serrata", "bruynsii", "koelmaniorum",
     "nitidula", "floribunda", "tessellata", "angustifolia", "translucens", "herbacea",
     "chloracantha", "wittebergensis", "glauca", "decipiens"].some(k => id.includes(k));

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

  const color = (() => {
    if (text.includes("黒") || text.includes("ブラック") || text.includes("黒紫")) return "dark";
    if (text.includes("紫") || text.includes("パープル")) return "purple";
    if (text.includes("赤") || text.includes("紅") || text.includes("ピンク")) return "red";
    if (text.includes("白斑") || text.includes("錦") || text.includes("乳白") || isVariegated) return "white";
    if (text.includes("青") || text.includes("ブルー")) return "blue";
    if (text.includes("グレー") || text.includes("灰") || text.includes("シルバー")) return "gray";
    return "green";
  })();

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

const QUESTIONS = [
  {
    id: "rosette",
    text: "葉はどのように\n並んでいますか？",
    hint: "全体の形・配置の印象で選んでください",
    options: [
      { label: "扇形に二列に並んでいる", value: "fan" },
      { label: "茎が縦に伸びて塔状になっている", value: "tower" },
      { label: "放射状に広がるロゼット", value: "rosette" },
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
    id: "texture",
    text: "葉は柔らかくて\nぷっくりしている？",
    hint: "触るとゼリーのような軟葉系 vs とがった硬葉系",
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
    hint: "葉の一番先っちょの形",
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
    id: "color",
    text: "葉の主な色は？",
    hint: "全体の印象で選んでください",
    options: [
      { label: "緑", value: "green" },
      { label: "紫・黒っぽい", value: "dark" },
      { label: "白・斑入り", value: "white" },
      { label: "青みがかった緑", value: "blue" },
      { label: "グレー・シルバー", value: "gray" },
    ],
    filter: (s, v) => {
      const t = getTraits(s);
      if (v === "dark") return t.color === "dark" || t.color === "purple";
      if (v === "white") return t.color === "white" || t.isVariegated;
      if (v === "blue") return t.color === "blue";
      if (v === "gray") return t.color === "gray";
      return t.color === "green";
    },
  },
  {
    id: "window-pattern",
    text: "葉の透明な部分（窓）の\n模様は？",
    hint: "光にかざして窓の中を見てみてください",
    options: [
      { label: "クリアで模様がない（透明感が高い）", value: "clear" },
      { label: "細い平行線や筋が走っている", value: "lines" },
      { label: "網目・格子状の模様がある", value: "net" },
      { label: "窓がない・目立たない", value: "none" },
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
    id: "hair",
    text: "葉に白い毛や\n繊維がある？",
    hint: "毛・糸・繊維状のものが葉についているか",
    options: [
      { label: "葉全体が白い毛で覆われている", value: "all" },
      { label: "葉先だけに長い毛がある", value: "tip" },
      { label: "縁に白い糸・繊維が出ている", value: "edge" },
      { label: "毛はない", value: "none" },
      { label: "わからない", value: "unknown" },
    ],
    filter: (s, v) => {
      if (v === "unknown") return true;
      const t = getTraits(s);
      if (v === "all") return t.hairAll;
      if (v === "tip") return t.hairTip;
      if (v === "edge") return t.hairEdge;
      if (v === "none") return !t.hairAll && !t.hairTip && !t.hairEdge;
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
    id: "source",
    text: "どこで手に入れましたか？",
    hint: "購入場所の記憶があれば",
    options: [
      { label: "ホームセンター・100均（数百〜1000円）", value: "common" },
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

export default function AkinatorPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [candidates, setCandidates] = useState(species);
  const [done, setDone] = useState(false);

  const handleAnswer = (value) => {
    const q = QUESTIONS[step];
    const next = candidates.filter(s => q.filter(s, value));
    const newAnswers = [...answers, { q: q.id, v: value }];
    setAnswers(newAnswers);
    setCandidates(next);

    const nextStep = step + 1;
    if (next.length <= 4 || nextStep >= QUESTIONS.length) {
      setDone(true);
    } else {
      setStep(nextStep);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setCandidates(species);
    setDone(false);
  };

  const progress = Math.round((step / QUESTIONS.length) * 100);

  return (
    <main>
      <div className="container">
        <header>
          <Link href="/" className="back-link">← 研究室に戻る</Link>
          <h1 style={{ marginTop: "0.8rem" }}>品種診断</h1>
          <p className="subtitle">質問に答えて品種を絞り込もう</p>
        </header>

        {!done ? (
          <>
            <div className="aki-progress-wrap">
              <div className="aki-progress-bar">
                <div className="aki-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="aki-progress-label">Q{step + 1} / {QUESTIONS.length}</span>
            </div>

            <div className="aki-candidates-count">
              候補：<strong>{candidates.length}</strong> 種
            </div>

            <div className="aki-card">
              <div className="aki-question">
                {QUESTIONS[step].text.split("\n").map((line, i) => (
                  <span key={i}>{line}{i === 0 && QUESTIONS[step].text.includes("\n") ? <br /> : ""}</span>
                ))}
              </div>
              <div className="aki-hint">{QUESTIONS[step].hint}</div>
              <div className="aki-options">
                {QUESTIONS[step].options.map((opt) => (
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

            {step > 0 && (
              <button className="aki-back-btn" onClick={() => {
                const prevStep = step - 1;
                setStep(prevStep);
                const prevAnswers = answers.slice(0, -1);
                setAnswers(prevAnswers);
                let c = species;
                for (let i = 0; i < prevStep; i++) {
                  c = c.filter(s => QUESTIONS[i].filter(s, prevAnswers[i].v));
                }
                setCandidates(c);
              }}>← 前の質問に戻る</button>
            )}
          </>
        ) : (
          <>
            <div className="aki-result-header">
              {candidates.length === 0 ? (
                <p className="aki-no-result">候補が見つかりませんでした。<br />「わからない」を多めに使って再挑戦してみてください。</p>
              ) : (
                <p className="aki-result-label">
                  {candidates.length === 1 ? "これでは？" : `候補は ${candidates.length} 種あります`}
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

            <button className="aki-reset-btn" onClick={reset}>もう一度試す</button>
          </>
        )}
      </div>
    </main>
  );
}
