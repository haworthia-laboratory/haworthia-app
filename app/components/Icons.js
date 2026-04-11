// 共通SVGアイコン（細線・薄塗り・グレーブラウン統一テイスト）
// size prop でサイズ変更可能

export function IconHome({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <path d="M16,5 L4,15 L4,28 L12,28 L12,20 L20,20 L20,28 L28,28 L28,15 Z"
        fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M11,28 L11,21 L21,21 L21,28" fill="rgba(160,148,136,0.1)" stroke="#9a8e84" strokeWidth="1.2"/>
    </svg>
  );
}

export function IconZukan({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <path d="M6,6 L10,6 L10,26 L6,26 Z" fill="rgba(130,118,106,0.3)" stroke="#8a7e72" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M10,6 L26,6 L26,26 L10,26 Z" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.4" strokeLinejoin="round"/>
      <line x1="14" y1="11" x2="22" y2="11" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="14" y1="15" x2="22" y2="15" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <line x1="14" y1="19" x2="20" y2="19" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
      {/* しおり */}
      <path d="M20,6 L20,11 L18,9 L16,11 L16,6 Z" fill="rgba(175,145,115,0.4)" stroke="#b89870" strokeWidth="0.8"/>
    </svg>
  );
}

export function IconDiagnose({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="fd-s"><feGaussianBlur stdDeviation="0.4"/></filter>
      </defs>
      <circle cx="16" cy="16" r="11" fill="rgba(160,148,136,0.18)" stroke="#b0a498" strokeWidth="1.4" filter="url(#fd-s)"/>
      <circle cx="16" cy="16" r="11" fill="none" stroke="#887870" strokeWidth="0.9" opacity="0.7"/>
      <text x="16" y="22" textAnchor="middle" fontSize="14" fill="#b0a498" fontWeight="300" fontFamily="serif">?</text>
    </svg>
  );
}

export function IconColumn({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="4" width="22" height="24" rx="2.5" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.4"/>
      <rect x="9" y="6" width="7" height="3.5" rx="0.8" fill="rgba(160,148,136,0.28)" stroke="#9a8e84" strokeWidth="0.7"/>
      <line x1="9" y1="14" x2="23" y2="14" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="9" y1="18" x2="23" y2="18" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="9" y1="22" x2="18" y2="22" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

export function IconDiary({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <path d="M16,7 Q9,6 4,7.5 L4,26 Q10,24.5 16,25.5 Z"
        fill="rgba(160,148,136,0.15)" stroke="#9a8e84" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M16,7 Q23,6 28,7.5 L28,26 Q22,24.5 16,25.5 Z"
        fill="rgba(160,148,136,0.15)" stroke="#9a8e84" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M16,7 Q15.5,16 16,25.5" fill="none" stroke="#9a8e84" strokeWidth="0.9" opacity="0.5"/>
      <line x1="7" y1="13" x2="13" y2="12.5" stroke="#c4b8b0" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
      <line x1="7" y1="17" x2="13" y2="16.5" stroke="#c4b8b0" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
      <g transform="translate(25,7) rotate(30)">
        <rect x="-1.5" y="-9" width="3" height="2.5" rx="0.6" fill="rgba(200,178,168,0.5)" stroke="#a08878" strokeWidth="0.8"/>
        <rect x="-1.5" y="-6.5" width="3" height="10" rx="0.4" fill="rgba(168,152,132,0.35)" stroke="#9a8878" strokeWidth="1"/>
        <polygon points="-1.5,3.5 1.5,3.5 0,7" fill="rgba(190,168,138,0.5)" stroke="#908060" strokeWidth="0.7"/>
      </g>
    </svg>
  );
}

export function IconGallery({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="12" height="11" rx="2" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.3"/>
      <rect x="17" y="7" width="12" height="11" rx="2" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.3"/>
      <rect x="3" y="20" width="12" height="5" rx="2" fill="rgba(160,148,136,0.12)" stroke="#9a8e84" strokeWidth="1.1"/>
      <rect x="17" y="20" width="12" height="5" rx="2" fill="rgba(160,148,136,0.12)" stroke="#9a8e84" strokeWidth="1.1"/>
      <circle cx="7" cy="11" r="1.5" fill="rgba(200,178,138,0.4)" stroke="#b8a878" strokeWidth="0.8"/>
      <polyline points="3,16 7,12 11,15 15,10" fill="none" stroke="#9a8e84" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconBoard({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="26" height="18" rx="3" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.4"/>
      <path d="M10,23 L10,27 L16,23" fill="rgba(160,148,136,0.25)" stroke="#9a8e84" strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1="8" y1="11" x2="24" y2="11" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="8" y1="15" x2="24" y2="15" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="8" y1="19" x2="18" y2="19" stroke="#b8aca0" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

export function IconContact({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="26" height="18" rx="3" fill="rgba(160,148,136,0.18)" stroke="#9a8e84" strokeWidth="1.4"/>
      <polyline points="3,9 16,18 29,9" fill="none" stroke="#9a8e84" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconLight({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="fl-s"><feGaussianBlur stdDeviation="0.4"/></filter>
      </defs>
      <circle cx="16" cy="13" r="6" fill="rgba(220,200,140,0.3)" stroke="#c8b870" strokeWidth="1.4" filter="url(#fl-s)"/>
      <circle cx="16" cy="13" r="6" fill="none" stroke="#a89848" strokeWidth="0.9" opacity="0.8"/>
      {[0,45,90,135,180,225,270,315].map((a, i) => {
        const rad = a * Math.PI / 180;
        const x1 = 16 + 8 * Math.cos(rad), y1 = 13 + 8 * Math.sin(rad);
        const x2 = 16 + 11 * Math.cos(rad), y2 = 13 + 11 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c8b870" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>;
      })}
      <rect x="10" y="24" width="12" height="2.5" rx="1.2" fill="rgba(160,148,136,0.2)" stroke="#b0a498" strokeWidth="1"/>
      <rect x="12" y="26.5" width="8" height="2" rx="1" fill="rgba(160,148,136,0.15)" stroke="#b0a498" strokeWidth="0.9"/>
    </svg>
  );
}
