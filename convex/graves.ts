import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

// Sayfalı liste — büyük bölümler (5.000+ mezar) tek seferde çekilemeyecek
// kadar büyük olduğu için kaydırdıkça yüklenir. En güncel kayıp en üstte,
// yılı olmayanlar sona (desc sıralamada deathYear'ı olmayanlar en sona düşer).
export const page = query({
  args: {
    section: v.union(
      v.literal("sehitler"),
      v.literal("kadinlar"),
      v.literal("genel"),
    ),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("graves")
      .withIndex("by_section_year", (q) => q.eq("section", args.section))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const count = query({
  args: {
    section: v.union(
      v.literal("sehitler"),
      v.literal("kadinlar"),
      v.literal("genel"),
    ),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("graves")
      .withIndex("by_section", (q) => q.eq("section", args.section))
      .collect();
    return docs.length;
  },
});

export const listBySection = query({
  args: {
    section: v.union(
      v.literal("sehitler"),
      v.literal("kadinlar"),
      v.literal("genel"),
    ),
  },
  handler: async (ctx, args) => {
    const graves = await ctx.db
      .query("graves")
      .withIndex("by_section", (q) => q.eq("section", args.section))
      .collect();
    // En güncel kayıp en üstte; yılı olmayanlar sona
    return graves.sort(
      (a, b) => (b.deathYear ?? 0) - (a.deathYear ?? 0),
    );
  },
});

export const get = query({
  args: { id: v.id("graves") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Kullanıcılar yalnızca "genel" bölümüne mezar ekleyebilir;
// şehitler ve kadınlar bölümleri seed ile yönetilir.
export const add = mutation({
  args: {
    name: v.string(),
    birthYear: v.optional(v.number()),
    deathYear: v.optional(v.number()),
    epitaph: v.optional(v.string()),
    story: v.optional(v.string()),
    addedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    if (name.length === 0 || name.length > 120) {
      throw new Error("Geçersiz isim");
    }
    return await ctx.db.insert("graves", {
      section: "genel",
      name,
      birthYear: args.birthYear,
      deathYear: args.deathYear,
      epitaph: args.epitaph?.trim() || undefined,
      story: args.story?.trim() || undefined,
      addedBy: args.addedBy?.trim() || undefined,
      candles: 0,
      roses: 0,
    });
  },
});

export const lightCandle = mutation({
  args: { id: v.id("graves") },
  handler: async (ctx, args) => {
    const grave = await ctx.db.get(args.id);
    if (!grave) throw new Error("Mezar bulunamadı");
    await ctx.db.patch(args.id, { candles: grave.candles + 1 });
  },
});

export const leaveRose = mutation({
  args: { id: v.id("graves") },
  handler: async (ctx, args) => {
    const grave = await ctx.db.get(args.id);
    if (!grave) throw new Error("Mezar bulunamadı");
    await ctx.db.patch(args.id, { roses: grave.roses + 1 });
  },
});
