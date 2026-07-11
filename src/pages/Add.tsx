import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const inputCls =
  "w-full rounded border border-bone/25 bg-black/30 px-4 py-3 text-bone placeholder:text-bone/35 focus:border-bone/60 focus:outline-none";

export default function Add() {
  const navigate = useNavigate();
  const add = useMutation(api.graves.add);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) {
      setError("İsim boş olamaz.");
      return;
    }
    const birthYear = Number(form.get("birthYear")) || undefined;
    const deathYear = Number(form.get("deathYear")) || undefined;

    setSaving(true);
    setError(null);
    try {
      const id = await add({
        name,
        birthYear,
        deathYear,
        epitaph: String(form.get("epitaph") ?? "") || undefined,
        story: String(form.get("story") ?? "") || undefined,
        addedBy: String(form.get("addedBy") ?? "") || undefined,
      });
      navigate(`/mezar/${id}`);
    } catch {
      setError("Kaydedilemedi, lütfen tekrar deneyin.");
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-14">
      <Link
        to="/bolum/genel"
        className="text-sm tracking-[0.3em] text-bone/60 uppercase hover:text-bone"
      >
        ← Sevdiklerimiz
      </Link>

      <h1 className="mt-8 text-4xl">Bir anıt mezar oluşturun</h1>
      <p className="mt-3 text-bone/70 italic">
        Kaybettiğiniz bir yakınınızın anısı burada yaşasın. Ziyaretçiler onun
        için mum yakabilir, gül bırakabilir.
      </p>

      <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm tracking-[0.2em] uppercase text-bone/70">
            İsim *
          </span>
          <input name="name" required maxLength={120} className={inputCls} />
        </label>

        <div className="grid grid-cols-2 gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm tracking-[0.2em] uppercase text-bone/70">
              Doğum yılı
            </span>
            <input
              name="birthYear"
              type="number"
              min={1800}
              max={2026}
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm tracking-[0.2em] uppercase text-bone/70">
              Vefat yılı
            </span>
            <input
              name="deathYear"
              type="number"
              min={1800}
              max={2026}
              className={inputCls}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm tracking-[0.2em] uppercase text-bone/70">
            Mezar taşı yazısı
          </span>
          <input
            name="epitaph"
            maxLength={160}
            placeholder="Kısa bir söz…"
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm tracking-[0.2em] uppercase text-bone/70">
            Hikâyesi
          </span>
          <textarea
            name="story"
            rows={5}
            maxLength={2000}
            placeholder="Onu anlatan birkaç cümle…"
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm tracking-[0.2em] uppercase text-bone/70">
            Sizin adınız (isteğe bağlı)
          </span>
          <input name="addedBy" maxLength={80} className={inputCls} />
        </label>

        {error && <p className="text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded border border-bone/40 px-6 py-4 tracking-[0.25em] uppercase transition-colors hover:bg-bone/10 disabled:opacity-50"
        >
          {saving ? "Oluşturuluyor…" : "Anıt mezarı oluştur"}
        </button>
      </form>
    </main>
  );
}
