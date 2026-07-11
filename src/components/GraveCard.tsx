import { Link } from "react-router-dom";
import type { Doc } from "../../convex/_generated/dataModel";

export default function GraveCard({ grave }: { grave: Doc<"graves"> }) {
  const years =
    grave.birthYear && grave.deathYear
      ? `${grave.birthYear} — ${grave.deathYear}`
      : grave.deathYear
        ? `${grave.deathYear}`
        : null;

  return (
    <Link
      to={`/mezar/${grave._id}`}
      className="group relative flex flex-col items-center rounded-t-[48%] border border-bone/15 bg-gradient-to-b
                 from-[#1a221d] to-[#10150f] px-6 pt-12 pb-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.6)]
                 transition-all duration-300 hover:-translate-y-1.5 hover:border-bone/40"
    >
      <span className="mb-4 h-px w-10 bg-bone/25 transition-colors group-hover:bg-bone/50" />
      <h3 className="text-2xl leading-tight">{grave.name}</h3>
      {years && (
        <p className="mt-1 text-sm tracking-[0.2em] text-bone/60">{years}</p>
      )}
      {grave.epitaph && (
        <p className="mt-4 text-sm text-bone/70 italic">“{grave.epitaph}”</p>
      )}
      <div className="mt-auto flex gap-5 pt-6 text-sm text-bone/60">
        <span title="yakılan mum">🕯 {grave.candles}</span>
        <span title="bırakılan gül">🌹 {grave.roses}</span>
      </div>
    </Link>
  );
}
