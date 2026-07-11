import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { SECTIONS } from "../sections";

function TributeButton({
  emoji,
  label,
  count,
  onClick,
  flame,
}: {
  emoji: string;
  label: string;
  count: number;
  onClick: () => void;
  flame?: boolean;
}) {
  const [bursts, setBursts] = useState<number[]>([]);

  const handle = () => {
    onClick();
    const id = Date.now();
    setBursts((b) => [...b, id]);
    setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 1300);
  };

  return (
    <button
      onClick={handle}
      className="relative flex flex-col items-center gap-2 rounded border border-bone/25 px-8 py-4
                 transition-colors hover:border-bone/60 hover:bg-bone/5"
    >
      {bursts.map((id) => (
        <span key={id} className="float-up absolute -top-2 text-2xl">
          {emoji}
        </span>
      ))}
      <span className={`text-3xl ${flame ? "flame" : ""}`}>{emoji}</span>
      <span className="text-sm tracking-[0.2em] uppercase">{label}</span>
      <span className="text-bone/60">{count}</span>
    </button>
  );
}

export default function Grave() {
  const { id } = useParams<{ id: string }>();
  const grave = useQuery(api.graves.get, { id: id as Id<"graves"> });
  const lightCandle = useMutation(api.graves.lightCandle);
  const leaveRose = useMutation(api.graves.leaveRose);

  if (grave === undefined) {
    return (
      <main className="flex h-screen items-center justify-center text-bone/50 italic">
        Yükleniyor…
      </main>
    );
  }
  if (grave === null) {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-4">
        <p>Bu mezar bulunamadı.</p>
        <Link to="/" className="underline">
          Girişe dön
        </Link>
      </main>
    );
  }

  const info = SECTIONS[grave.section];
  const years =
    grave.birthYear && grave.deathYear
      ? `${grave.birthYear} — ${grave.deathYear}`
      : grave.deathYear
        ? `${grave.deathYear}`
        : null;

  return (
    <main className="relative min-h-screen">
      <img
        src={info.image}
        alt=""
        className="fixed inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="fixed inset-0 bg-gradient-to-b from-night/70 via-night/85 to-night" />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center px-6 py-14">
        <Link
          to={`/bolum/${grave.section}`}
          className="self-start text-sm tracking-[0.3em] text-bone/60 uppercase hover:text-bone"
        >
          ← {info.title}
        </Link>

        {/* Mezar taşı */}
        <div className="mt-10 w-full max-w-md rounded-t-[45%] border border-bone/20 bg-gradient-to-b from-[#1c241f] to-[#0e130e] px-10 pt-16 pb-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <span className="mx-auto block h-px w-16 bg-bone/25" />
          <h1 className="mt-6 text-4xl leading-tight">{grave.name}</h1>
          {years && (
            <p className="mt-2 tracking-[0.3em] text-bone/60">{years}</p>
          )}
          {grave.epitaph && (
            <p className="mt-8 text-lg text-bone/80 italic">
              “{grave.epitaph}”
            </p>
          )}
        </div>

        {grave.story && (
          <p className="mt-10 max-w-lg text-center leading-relaxed text-bone/75">
            {grave.story}
          </p>
        )}
        {grave.addedBy && (
          <p className="mt-4 text-sm text-bone/50 italic">
            Bu anıtı {grave.addedBy} oluşturdu.
          </p>
        )}

        {/* Anma */}
        <div className="mt-12 flex gap-6">
          <TributeButton
            emoji="🕯"
            label="Mum yak"
            count={grave.candles}
            flame
            onClick={() => lightCandle({ id: grave._id })}
          />
          <TributeButton
            emoji="🌹"
            label="Gül bırak"
            count={grave.roses}
            onClick={() => leaveRose({ id: grave._id })}
          />
        </div>
      </div>
    </main>
  );
}
