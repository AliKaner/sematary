export type SectionKey = "sehitler" | "kadinlar" | "genel";

export const SECTIONS: Record<
  SectionKey,
  {
    title: string;
    tagline: string;
    description: string;
    image: string;
    video: string;
    accent: string;
  }
> = {
  sehitler: {
    title: "Şehitler",
    tagline: "Vatan için toprağa düşenler",
    description:
      "Bu topraklar uğruna canını veren kahramanların anıt mezarları. Hepsinin başında bir kılıç, üstünde bir bayrak nöbet tutar.",
    image: "/media/sehitler-1.png",
    video: "/media/sehitler-video.mp4",
    accent: "#b3392f",
  },
  kadinlar: {
    title: "Kadınlar",
    tagline: "Yaşamları yarım bırakılanlar",
    description:
      "Hayatları ellerinden alınan kadınların anısına. Her mezar taşının dibinde güller açar; unutmuyoruz, unutturmayacağız.",
    image: "/media/kadinlar-1.png",
    video: "/media/kadinlar-video-1.mp4",
    accent: "#c04a5e",
  },
  genel: {
    title: "Sevdiklerimiz",
    tagline: "Tanıdıklarımız, kaybettiklerimiz",
    description:
      "Kaybettiğiniz bir yakınınız için burada bir anıt mezar oluşturabilir, onun anısına mum yakıp gül bırakabilirsiniz.",
    image: "/media/kadinlar-3.png",
    video: "/media/kadinlar-video-2.mp4",
    accent: "#8a7f5c",
  },
};

export const SECTION_KEYS: SectionKey[] = ["sehitler", "kadinlar", "genel"];
