import React from 'react';

interface MacroDonutProps {
  proteinG: number;
  carbsG: number;
  fatG: number;
  totalKcal: number;
}

export const MacroDonutChart: React.FC<MacroDonutProps> = ({
  proteinG,
  carbsG,
  fatG,
  totalKcal,
}) => {
  const pCal = proteinG * 4;
  const cCal = carbsG * 4;
  const fCal = fatG * 9;
  const sumCal = pCal + cCal + fCal;
  const radius = 56;
  const stroke = 14;
  const norm = radius - stroke;
  const circ = norm * 2 * Math.PI;

  const pPct = sumCal > 0 ? (pCal / sumCal) * 100 : 33;
  const cPct = sumCal > 0 ? (cCal / sumCal) * 100 : 34;
  const fPct = sumCal > 0 ? (fCal / sumCal) * 100 : 33;

  const pLen = (pPct / 100) * circ;
  const cLen = (cPct / 100) * circ;
  const fLen = (fPct / 100) * circ;

  return (
    <div className="flex items-center gap-4">
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90 transform">
          <circle stroke="rgba(148,163,184,0.12)" fill="transparent" strokeWidth={stroke} r={norm} cx={radius} cy={radius} />
          {sumCal > 0 && (
            <>
              <circle
                stroke="#0ea5e9"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${pLen} ${circ}`}
                strokeDashoffset={0}
                r={norm}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#f59e0b"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${cLen} ${circ}`}
                strokeDashoffset={-pLen}
                r={norm}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#f43f5e"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${fLen} ${circ}`}
                strokeDashoffset={-(pLen + cLen)}
                r={norm}
                cx={radius}
                cy={radius}
              />
            </>
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-extrabold text-white">{Math.round(totalKcal)}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400">kcal</span>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>Protein
          </span>
          <span className="font-bold text-white">{Math.round(pPct)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Carbs
          </span>
          <span className="font-bold text-white">{Math.round(cPct)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>Fat
          </span>
          <span className="font-bold text-white">{Math.round(fPct)}%</span>
        </div>
      </div>
    </div>
  );
};
