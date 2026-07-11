import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SECTIONS, type SectionKey } from "../sections";
import GraveCard from "../components/GraveCard";

export default function Section() {
  const { section } = useParams<{ section: string }>();
  const key = (section ?? "") as SectionKey;
  const info = SECTIONS[key];
  const {
    results: graves,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.graves.page,
    info ? { section: key } : "skip",
    { initialNumItems: 48 },
  );
  const total = useQuery(api.graves.count, info ? { section: key } : "skip");

  // Sayfa sonuna yaklaşınca sıradaki mezarları yükle
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || status !== "CanLoadMore") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore(96);
      },
      { rootMargin: "800px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [status, loadMore]);

  if (!info) {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-4">
        <p>Böyle bir bölüm yok.</p>
        <Link to="/" className="underline">
          Girişe dön
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Bölüm başlığı */}
      <header className="relative flex h-[45vh] items-end overflow-hidden">
        <img
          src={info.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/20" />
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-10">
          <Link
            to="/"
            className="text-sm tracking-[0.3em] text-bone/60 uppercase hover:text-bone"
          >
            ← Anıt Mezarlık
          </Link>
          <h1 className="mt-4 text-5xl tracking-[0.15em] uppercase md:text-6xl">
            {info.title}
          </h1>
          <p className="mt-3 max-w-xl text-bone/75 italic">{info.description}</p>
          {total !== undefined && total > 0 && (
            <p className="mt-4 text-sm tracking-[0.3em] text-bone/50 uppercase">
              {total.toLocaleString("tr-TR")} anıt mezar
            </p>
          )}
        </div>
      </header>

      {/* Mezarlar */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        {key === "genel" && (
          <div className="mb-10 flex justify-center">
            <Link
              to="/ekle"
              className="rounded border border-bone/30 px-6 py-3 tracking-[0.2em] uppercase transition-colors hover:border-bone/70 hover:bg-bone/5"
            >
              Bir yakınınız için anıt mezar oluşturun
            </Link>
          </div>
        )}

        {status === "LoadingFirstPage" ? (
          <p className="text-center text-bone/50 italic">
            Mezarlık kapıları açılıyor…
          </p>
        ) : graves.length === 0 ? (
          <p className="text-center text-bone/50 italic">
            Bu bölümde henüz anıt mezar yok.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {graves.map((grave) => (
                <GraveCard key={grave._id} grave={grave} />
              ))}
            </div>
            <div ref={sentinelRef} />
            {status === "LoadingMore" ? (
              <p className="mt-10 text-center text-bone/50 italic">
                Mezarlığın derinliklerine yürünüyor…
              </p>
            ) : (
              total !== undefined &&
              graves.length < total && (
                <p className="mt-10 text-center text-sm tracking-[0.2em] text-bone/40">
                  {graves.length.toLocaleString("tr-TR")} /{" "}
                  {total.toLocaleString("tr-TR")}
                </p>
              )
            )}
          </>
        )}
      </section>
    </main>
  );
}
