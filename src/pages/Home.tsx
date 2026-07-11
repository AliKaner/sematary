import { useRef } from "react";
import { Link } from "react-router-dom";
import { SECTIONS, SECTION_KEYS, type SectionKey } from "../sections";

function Panel({
  section,
  position,
}: {
  section: SectionKey;
  position: "first" | "middle" | "last";
}) {
  const info = SECTIONS[section];
  // Kenar paneller ekran dışına taştığı için yazıyı görünür merkeze kaydır
  const labelShift =
    position === "first"
      ? "md:pl-[7vh]"
      : position === "last"
        ? "md:pr-[7vh]"
        : "";
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    videoRef.current?.play().catch(() => {});
  };
  const pause = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <Link
      to={`/bolum/${section}`}
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
      className="group relative block flex-1 overflow-hidden transition-all duration-700 ease-out
                 min-h-0 hover:flex-[1.4]
                 md:-skew-x-6 md:not-first:-ml-px
                 md:first-of-type:ml-[-7vh] md:last-of-type:mr-[-7vh]"
    >
      {/* Skew'i geri alan iç katman — görüntü düz kalır */}
      <div className="absolute inset-0 md:skew-x-6 md:scale-125">
        <img
          src={info.image}
          alt={info.title}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        />
        <video
          ref={videoRef}
          src={info.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />
        {/* Karartma */}
        <div className="absolute inset-0 bg-black/45 transition-colors duration-700 group-hover:bg-black/25" />
      </div>

      {/* Bölüm yazısı — hover'da biraz yukarı süzülür */}
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col items-center pb-16 text-center transition-transform duration-700 ease-out group-hover:-translate-y-10 md:skew-x-6 ${labelShift}`}
      >
        <span
          className="mb-3 h-px w-16 opacity-60"
          style={{ background: info.accent }}
        />
        <h2 className="text-3xl tracking-[0.2em] uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] md:text-[clamp(1.4rem,2.3vw,2.25rem)]">
          {info.title}
        </h2>
        <p className="mt-3 max-w-[26ch] text-sm tracking-widest text-bone/0 italic transition-all duration-700 group-hover:text-bone/90">
          {info.tagline}
        </p>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="flex h-screen flex-col overflow-hidden md:flex-row">
      {SECTION_KEYS.map((key, i) => (
        <Panel
          key={key}
          section={key}
          position={
            i === 0 ? "first" : i === SECTION_KEYS.length - 1 ? "last" : "middle"
          }
        />
      ))}

      {/* Başlık */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-8">
        <h1 className="text-lg tracking-[0.5em] uppercase text-bone/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Anıt Mezarlık
        </h1>
      </header>
    </main>
  );
}
