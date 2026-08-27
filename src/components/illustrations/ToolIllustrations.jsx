const Sheet = ({ x, y, w = 150, h = 190, fill = '#ffffff', stroke = 'var(--color-line)' }) => (
  <rect x={x} y={y} width={w} height={h} rx="8" fill={fill} stroke={stroke} strokeWidth="1.5" />
);

const Line = ({ x, y, w, color = 'var(--color-line)' }) => <rect x={x} y={y} width={w} height="6" rx="3" fill={color} />;

const frame = 'h-auto w-full max-w-md';

export const SummaryIllustration = () => (
  <svg viewBox="0 0 380 280" className={frame} role="img" aria-label="A document being condensed into a short summary">
    <rect x="24" y="22" width="330" height="236" rx="16" fill="var(--color-brand-50)" />
    <Sheet x="52" y="46" />
    <Line x="72" y="74" w={92} />
    <Line x="72" y="92" w={110} />
    <Line x="72" y="110" w={78} />
    <Line x="72" y="128" w={104} />
    <Line x="72" y="146" w={64} />
    <Line x="72" y="164" w={96} />
    <Line x="72" y="182" w={70} />
    <Line x="72" y="200" w={88} />

    <rect x="196" y="70" width="132" height="42" rx="8" fill="var(--color-brand-600)" />
    <text x="262" y="97" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="700" fontFamily="var(--font-sans)">
      Summary
    </text>

    <Sheet x="196" y="124" w={132} h={96} />
    <Line x="212" y="146" w={86} color="var(--color-brand-300)" />
    <Line x="212" y="164" w={100} color="var(--color-brand-200)" />
    <Line x="212" y="182" w={72} color="var(--color-brand-200)" />
    <Line x="212" y="200" w={92} color="var(--color-brand-200)" />

    <circle cx="176" cy="96" r="4" fill="var(--color-brand-400)" />
    <circle cx="176" cy="146" r="4" fill="var(--color-brand-400)" />
  </svg>
);

export const AskIllustration = () => (
  <svg viewBox="0 0 380 280" className={frame} role="img" aria-label="A question answered with a citation back to the document">
    <rect x="24" y="22" width="330" height="236" rx="16" fill="var(--color-brand-50)" />
    <Sheet x="46" y="52" w={128} h={176} />
    <Line x="62" y="76" w={72} />
    <rect x="62" y="94" width="96" height="26" rx="5" fill="var(--color-amber-200, #fde68a)" />
    <Line x="62" y="132" w={84} />
    <Line x="62" y="150" w={68} />
    <Line x="62" y="168" w={90} />
    <Line x="62" y="186" w={60} />

    <rect x="196" y="62" width="150" height="46" rx="10" fill="var(--color-brand-600)" />
    <Line x="212" y="78" w={88} color="rgba(255,255,255,.85)" />
    <Line x="212" y="92" w={58} color="rgba(255,255,255,.55)" />

    <rect x="196" y="124" width="150" height="86" rx="10" fill="#ffffff" stroke="var(--color-line)" strokeWidth="1.5" />
    <Line x="212" y="144" w={112} color="var(--color-brand-300)" />
    <Line x="212" y="162" w={92} color="var(--color-brand-200)" />
    <Line x="212" y="180" w={104} color="var(--color-brand-200)" />

    <path d="M158 107 L196 107" stroke="var(--color-brand-400)" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="158" cy="107" r="4" fill="var(--color-amber-400, #fbbf24)" />
  </svg>
);

export const EntitiesIllustration = () => (
  <svg viewBox="0 0 380 280" className={frame} role="img" aria-label="Key phrases and named entities pulled out of a document">
    <rect x="24" y="22" width="330" height="236" rx="16" fill="var(--color-brand-50)" />

    <Sheet x="46" y="52" w={122} h={176} />
    <Line x="62" y="76" w={70} />
    <rect x="62" y="94" width="58" height="18" rx="4" fill="var(--color-brand-200)" />
    <Line x="62" y="124" w={82} />
    <rect x="62" y="142" width="44" height="18" rx="4" fill="#a7f3d0" />
    <Line x="62" y="172" w={76} />
    <rect x="62" y="190" width="66" height="18" rx="4" fill="#fde68a" />

    <rect x="198" y="60" width="112" height="28" rx="14" fill="var(--color-brand-600)" />
    <rect x="198" y="98" width="80" height="28" rx="14" fill="#34d399" />
    <rect x="286" y="98" width="52" height="28" rx="14" fill="var(--color-brand-300)" />
    <rect x="198" y="136" width="96" height="28" rx="14" fill="#fbbf24" />
    <rect x="198" y="174" width="128" height="28" rx="14" fill="var(--color-brand-200)" />

    <path d="M168 103 L198 103" stroke="var(--color-brand-400)" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M168 151 L198 151" stroke="var(--color-brand-400)" strokeWidth="2" strokeDasharray="4 4" />
  </svg>
);

export const ExportIllustration = () => (
  <svg viewBox="0 0 380 280" className={frame} role="img" aria-label="A formatted report downloaded as PDF or DOCX">
    <rect x="24" y="22" width="330" height="236" rx="16" fill="var(--color-brand-50)" />

    <Sheet x="70" y="46" w={150} h={168} />
    <rect x="70" y="46" width="150" height="34" rx="8" fill="var(--color-brand-600)" />
    <Line x="86" y="60" w={72} color="rgba(255,255,255,.85)" />
    <Line x="86" y="98" w={104} color="var(--color-brand-300)" />
    <Line x="86" y="116" w={118} color="var(--color-line)" />
    <Line x="86" y="134" w={90} color="var(--color-line)" />
    <rect x="86" y="152" width="52" height="18" rx="9" fill="#34d399" />
    <rect x="144" y="152" width="44" height="18" rx="9" fill="#fbbf24" />
    <Line x="86" y="184" w={110} color="var(--color-line)" />

    <rect x="238" y="76" width="76" height="34" rx="8" fill="#ffffff" stroke="var(--color-line)" strokeWidth="1.5" />
    <text x="276" y="99" textAnchor="middle" fill="var(--color-brand-700)" fontSize="14" fontWeight="700" fontFamily="var(--font-sans)">
      PDF
    </text>
    <rect x="238" y="122" width="76" height="34" rx="8" fill="#ffffff" stroke="var(--color-line)" strokeWidth="1.5" />
    <text x="276" y="145" textAnchor="middle" fill="var(--color-brand-700)" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)">
      DOCX
    </text>

    <rect x="120" y="228" width="140" height="34" rx="8" fill="var(--color-brand-600)" />
    <path d="M156 238 v11 M151 245 l5 5 l5 -5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <text x="200" y="250" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)">
      Download
    </text>
  </svg>
);

export const ILLUSTRATIONS = {
  summary: SummaryIllustration,
  ask: AskIllustration,
  entities: EntitiesIllustration,
  export: ExportIllustration,
};
