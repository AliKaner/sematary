import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  graves: defineTable({
    section: v.union(
      v.literal("sehitler"),
      v.literal("kadinlar"),
      v.literal("genel"),
    ),
    name: v.string(),
    birthYear: v.optional(v.number()),
    deathYear: v.optional(v.number()),
    epitaph: v.optional(v.string()),
    story: v.optional(v.string()),
    addedBy: v.optional(v.string()),
    candles: v.number(),
    roses: v.number(),
  })
    .index("by_section", ["section"])
    // Sayfalı listeleme için: bölüm içinde ölüm yılına göre sıralı
    .index("by_section_year", ["section", "deathYear"]),
});
