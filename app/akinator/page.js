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

// 全問終了後に出す追加質問
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
      return true; // medium は大多数なので絞らない
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
      // 子株が出にくい品種（万象・玉扇）
      if (v === "no") return ["maughanii", "truncata"].some(k => id.includes(k));
      // 子株が出やすい品種（走出枝系・クーペリー系）
      if (v === "yes") return ["tessellata", "cooperi", "cymbiformis", "turgida"].some(k => id.includes(k));
      return true;
    },
  },
];

const QUESTIONS = [
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

export default function AkinatorPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [candidates, setCandidates] = useState(species);
  const [done, setDone] = useState(false);
  const [extraStep, setExtraStep] = useState(0); // 追加質問のインデックス
  const [inExtra, setInExtra] = useState(false); // 追加質問モード中か

  const handleAnswer = (value) => {
    const q = inExtra ? EXTRA_QUESTIONS[extraStep] : QUESTIONS[step];
    const next = candidates.filter(s => q.filter(s, value));
    setAnswers([...answers, { q: q.id, v: value }]);
    setCandidates(next);

    if (inExtra) {
      const nextExtra = extraStep + 1;
      if (next.length <= 4 || nextExtra >= EXTRA_QUESTIONS.length) {
        setInExtra(false);
        setDone(true);
      } else {
        setExtraStep(nextExtra);
      }
    } else {
      const nextStep = step + 1;
      if (next.length <= 4 || nextStep >= QUESTIONS.length) {
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

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setCandidates(species);
    setDone(false);
    setExtraStep(0);
    setInExtra(false);
  };

  const totalQuestions = inExtra ? EXTRA_QUESTIONS.length : QUESTIONS.length;
  const currentStep = inExtra ? extraStep : step;
  const progress = Math.round((currentStep / totalQuestions) * 100);

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
              <span className="aki-progress-label">{inExtra ? "追加Q" : "Q"}{currentStep + 1} / {totalQuestions}</span>
            </div>

            <div className="aki-candidates-count">
              候補：<strong>{candidates.length}</strong> 種
            </div>

            <div className="aki-card">
              <div className="aki-question">
                {(inExtra ? EXTRA_QUESTIONS[extraStep] : QUESTIONS[step]).text.split("\n").map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 ? <br /> : ""}</span>
                ))}
              </div>
              <div className="aki-hint">{(inExtra ? EXTRA_QUESTIONS[extraStep] : QUESTIONS[step]).hint}</div>
              <div className="aki-options">
                {(inExtra ? EXTRA_QUESTIONS[extraStep] : QUESTIONS[step]).options.map((opt) => (
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

            {candidates.length > 4 && !inExtra && EXTRA_QUESTIONS.length > 0 && (
              <button className="aki-extra-btn" onClick={startExtra}>
                もう少し絞り込む（追加質問へ）
              </button>
            )}
            <button className="aki-reset-btn" onClick={reset}>最初からやり直す</button>
          </>
        )}
      </div>
    </main>
  );
}
