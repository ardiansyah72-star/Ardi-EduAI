require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "..")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =========================================================
   ARDI EDUAI V6.3
   AI LEARNING CONTENT GENERATOR
   =========================================================
   GENERATOR:
   1. Media Interaktif
   2. Materi Pembelajaran
   3. Presentasi / Slide
   4. LKPD
   5. Game / Kuis
   6. HTML Interaktif
   7. RPM Pembelajaran Mendalam
   8. Blanko Nilai & Pengolahan Asesmen

   ENGINE:
   - Adaptive Class 1-6
   - Fase A/B/C
   - Visual Design Engine
   - Deep Learning
   - Differentiation
   - Student Engagement
   ========================================================= */


/* =========================================================
   HELPER DASAR
   ========================================================= */

function safe(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function getClassNumber(kelas) {
  const match = safe(kelas).match(/\d+/);
  return match ? Number(match[0]) : 6;
}

function getPhase(kelas) {
  const n = getClassNumber(kelas);

  if (n <= 2) return "Fase A";
  if (n <= 4) return "Fase B";
  return "Fase C";
}


/* =========================================================
   ADAPTIVE CLASS ENGINE
   ========================================================= */

function getClassProfile(kelas) {
  const n = getClassNumber(kelas);

  const profiles = {
    1: {
      label: "Kelas 1 SD",
      phase: "Fase A",
      level: "SD awal",
      language:
        "Gunakan bahasa sangat sederhana, pendek, konkret, hangat, ceria, dan mudah dipahami anak kelas 1.",
      visual:
        "Gunakan objek nyata, gambar besar, warna cerah, ikon sederhana, karakter ramah, dan ekspresi yang menyenangkan.",
      narrative:
        "Gunakan cerita sangat pendek, percakapan sederhana, dan situasi dekat dengan kehidupan anak.",
      activity:
        "Aktivitas dapat berupa menunjuk, memilih, mencocokkan, mengelompokkan, menyebutkan, menirukan, dan mengangkat tangan.",
      thinking:
        "Fokus pada mengenali, menyebutkan, memilih, mencocokkan, dan membedakan secara sederhana.",
      structure:
        "Gunakan potongan informasi pendek dengan banyak bantuan visual.",
      visualText:
        "Teks visual sebaiknya pendek, sekitar 5–7 kata pada setiap poin utama."
    },

    2: {
      label: "Kelas 2 SD",
      phase: "Fase A",
      level: "SD awal",
      language:
        "Gunakan bahasa sederhana, konkret, komunikatif, dan menyenangkan.",
      visual:
        "Gunakan gambar, ikon, objek nyata, warna cerah, dan ilustrasi yang mudah dikenali.",
      narrative:
        "Gunakan cerita pendek, percakapan sederhana, dan pertanyaan yang dekat dengan pengalaman anak.",
      activity:
        "Gunakan aktivitas memilih, mencocokkan, mengelompokkan, mengurutkan, mengamati, dan menjawab singkat.",
      thinking:
        "Fokus pada mengenali, mengelompokkan, membandingkan sederhana, memilih, dan memberikan jawaban singkat.",
      structure:
        "Gunakan bagian pendek dan jelas.",
      visualText:
        "Utamakan kalimat pendek dan poin visual."
    },

    3: {
      label: "Kelas 3 SD",
      phase: "Fase B",
      level: "SD menengah",
      language:
        "Gunakan bahasa sederhana tetapi mulai memperkenalkan konsep dan alasan secara bertahap.",
      visual:
        "Gunakan diagram sederhana, tabel ringan, gambar kontekstual, ikon, dan ilustrasi edukatif.",
      narrative:
        "Gunakan cerita, situasi sehari-hari, masalah sederhana, dan pertanyaan pemandu.",
      activity:
        "Gunakan klasifikasi, mencocokkan, pengamatan, diskusi ringan, praktik, dan tantangan.",
      thinking:
        "Fokus pada memahami, mengklasifikasi, membandingkan, menerapkan, dan menjelaskan alasan sederhana.",
      structure:
        "Boleh menggunakan beberapa bagian informasi yang lebih lengkap.",
      visualText:
        "Jaga teks tetap ringkas dan seimbang dengan visual."
    },

    4: {
      label: "Kelas 4 SD",
      phase: "Fase B",
      level: "SD menengah",
      language:
        "Gunakan bahasa terstruktur, jelas, kontekstual, dan tetap ramah anak.",
      visual:
        "Gunakan diagram, tabel, peta konsep, infografis, dan ilustrasi kontekstual.",
      narrative:
        "Gunakan storytelling, pertanyaan mengapa dan bagaimana, serta masalah yang dekat dengan kehidupan siswa.",
      activity:
        "Gunakan observasi, diskusi, klasifikasi, perbandingan, kasus ringan, dan tantangan.",
      thinking:
        "Fokus pada memahami, menerapkan, membandingkan, memberikan alasan, dan pemecahan masalah sederhana.",
      structure:
        "Gunakan struktur yang sistematis dan bertahap.",
      visualText:
        "Gunakan hierarki visual yang jelas agar informasi tidak terlalu padat."
    },

    5: {
      label: "Kelas 5 SD",
      phase: "Fase C",
      level: "SD akhir",
      language:
        "Gunakan bahasa lebih lengkap dan sedikit akademik tetapi tetap ramah siswa SD.",
      visual:
        "Gunakan infografis, diagram, tabel, ilustrasi kontekstual, dan peta konsep.",
      narrative:
        "Gunakan masalah nyata, kasus, situasi kehidupan sehari-hari, dan pertanyaan kritis.",
      activity:
        "Gunakan diskusi, observasi, analisis sederhana, eksperimen, pemecahan masalah, dan mini proyek.",
      thinking:
        "Fokus pada memahami, menerapkan, menganalisis, membandingkan, menyimpulkan, dan memberikan alasan.",
      structure:
        "Informasi boleh lebih lengkap dan sistematis.",
      visualText:
        "Gunakan visual sebagai pendukung analisis, bukan sekadar dekorasi."
    },

    6: {
      label: "Kelas 6 SD",
      phase: "Fase C",
      level: "SD akhir",
      language:
        "Gunakan bahasa matang, jelas, sistematis, tetapi tetap sesuai perkembangan siswa SD.",
      visual:
        "Gunakan infografis, diagram, tabel, peta konsep, ilustrasi kontekstual, dan visual data sederhana.",
      narrative:
        "Gunakan masalah nyata, storytelling, kasus, pertanyaan mengapa dan bagaimana, serta refleksi.",
      activity:
        "Gunakan diskusi, analisis kasus, pemecahan masalah, observasi, praktik, tantangan, dan refleksi.",
      thinking:
        "Fokus pada memahami, menerapkan, menganalisis, mengevaluasi, memberikan alasan, dan merefleksi.",
      structure:
        "Materi harus terasa seperti pengalaman belajar, bukan sekadar kumpulan definisi.",
      visualText:
        "Gunakan teks yang ringkas dengan visual yang membantu siswa memahami konsep."
    }
  };

  return profiles[n] || profiles[6];
}


/* =========================================================
   PLATFORM ENGINE
   ========================================================= */

function getPlatformInstruction(platform) {
  const p = safe(platform).toLowerCase();

  if (p.includes("canva")) {
    return `
PLATFORM: CANVA AI

Buat prompt yang dapat langsung digunakan untuk membuat desain pembelajaran
di Canva AI.

Prioritaskan:
- desain visual
- halaman/section yang jelas
- ilustrasi edukatif
- ikon
- warna konsisten
- tipografi ramah siswa
- kartu informasi
- aktivitas visual
- pertanyaan interaktif
- mini challenge
- ruang jawaban
- hierarki visual
- tata letak yang tidak terlalu padat

Jangan membuat desain seperti dokumen administrasi biasa.
`;
  }

  if (p.includes("html")) {
    return `
PLATFORM: HTML INTERAKTIF

Rancang materi sebagai pengalaman digital interaktif.

Prioritaskan:
- kartu interaktif
- tombol next/back
- accordion
- popup fakta
- quiz
- feedback
- progress indicator
- navigasi sederhana
- aktivitas klik
- animasi/transisi ringan
- responsive untuk desktop dan mobile
- keterbacaan tinggi
`;
  }

  return `
PLATFORM: AI UMUM

Buat materi lengkap yang siap digunakan guru atau dikembangkan
menjadi media digital.

Gunakan:
- heading
- subheading
- bullet
- tabel jika diperlukan
- aktivitas
- pertanyaan
- tantangan
- evaluasi
- refleksi
- diferensiasi
`;
}


/* =========================================================
   VISUAL DESIGN ENGINE
   ========================================================= */

function buildVisualDesignInstruction(data) {
  const theme =
    safe(data.visualTheme, "✨ AI memilih tema otomatis");

  const palette =
    safe(data.colorPalette, "✨ AI memilih sesuai materi");

  const illustration =
    safe(data.illustrationStyle, "🎯 Sesuaikan Materi");

  const density =
    safe(data.visualDensity, "Seimbang");

  const elements = Array.isArray(data.visualElements)
    ? data.visualElements
    : [];

  let recommendedTheme = "";

  const subject = safe(data.mapel).toLowerCase();
  const material = safe(data.materi).toLowerCase();

  if (
    subject.includes("ipas") &&
    (material.includes("hewan") ||
      material.includes("tumbuhan") ||
      material.includes("alam"))
  ) {
    recommendedTheme = `
REKOMENDASI OTOMATIS:
Tema: Petualangan Dunia Alam
Palet: hijau alam + biru langit + kuning cerah
Visual: hewan/tumbuhan, daun, jejak kaki, lingkungan alam.
`;
  } else if (
    subject.includes("agama") ||
    material.includes("halal") ||
    material.includes("haram")
  ) {
    recommendedTheme = `
REKOMENDASI OTOMATIS:
Tema: Jelajah Makanan Halal
Palet: hijau + cream + aksen emas
Visual: makanan, keranjang belanja, anak memilih makanan,
ikon halal yang digunakan secara tepat.
`;
  } else if (
    subject.includes("matematika") &&
    (
      material.includes("tambah") ||
      material.includes("penjumlahan") ||
      material.includes("angka")
    )
  ) {
    recommendedTheme = `
REKOMENDASI OTOMATIS:
Tema: Misi Matematika
Palet: biru + kuning + oranye
Visual: angka, roket, planet, bintang, anak belajar.
`;
  }

  return `
=========================================================
🎨 VISUAL DESIGN ENGINE
=========================================================

TEMA VISUAL:
${theme}

PALET WARNA:
${palette}

GAYA ILUSTRASI:
${illustration}

KEPADATAN VISUAL:
${density}

ELEMEN VISUAL YANG DIMINTA:
${elements.length ? elements.join(", ") : "AI memilih yang paling sesuai"}

${recommendedTheme}

ATURAN VISUAL WAJIB:

1. Jangan menghasilkan desain dominan hitam-putih.
2. Gunakan warna secara konsisten pada:
   - heading
   - kotak aktivitas
   - ikon
   - ilustrasi
   - badge
   - tabel
   - tombol
   - navigasi
3. Gunakan ilustrasi yang benar-benar relevan dengan materi.
4. Gunakan karakter/objek yang sesuai usia siswa.
5. Gunakan hierarchy visual yang jelas.
6. Gunakan ruang kosong secukupnya.
7. Hindari halaman yang penuh teks.
8. Jangan menggunakan terlalu banyak warna sekaligus.
9. Warna harus membantu membedakan bagian pembelajaran.
10. Gunakan ikon untuk membantu pemahaman.
11. Gunakan visual sebagai bagian dari pembelajaran,
    bukan hanya hiasan.
12. Pertahankan keterbacaan.
13. Untuk materi anak SD, tampilkan suasana ceria,
    aktif, ramah, dan menyenangkan.
14. Jika platform mendukung interaksi, gunakan animasi/transisi
    ringan yang tidak mengganggu pembelajaran.

CATATAN:
Jika pengguna memilih gaya kartun, gunakan ilustrasi bergaya
kartun/animasi secara visual. Untuk HTML/game, animasi dapat
diwujudkan sebagai animasi/transisi aktual.
Untuk dokumen statis, gunakan ilustrasi bergaya kartun sebagai
representasi visual.
`;
}


/* =========================================================
   CHARACTER ENGINE
   ========================================================= */

function getCharacterText(character) {
  if (!character) return "Karakter umum siswa SD.";

  if (Array.isArray(character)) {
    return character.join(", ");
  }

  return safe(character);
}


/* =========================================================
   MATERIAL PEMBELAJARAN
   ========================================================= */

function buildMaterialPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
ANDA ADALAH:
- instructional designer
- guru SD berpengalaman
- ahli Pembelajaran Mendalam
- penulis bahan ajar ramah anak
- ahli student engagement
- ahli storytelling
- ahli gamifikasi
- ahli media digital
- ahli diferensiasi pembelajaran
- ahli AI education

TUGAS:
Buat bahan pembelajaran yang membuat siswa penasaran,
aktif, berpikir, mencoba, berdiskusi, dan merefleksi.

Jangan hanya membuat kumpulan definisi.

=========================================================
DATA PEMBELAJARAN
=========================================================

Mata Pelajaran:
${safe(data.mapel)}

Kelas:
${safe(data.kelas)}

Fase:
${getPhase(data.kelas)}

Materi:
${safe(data.materi)}

Tujuan Pembelajaran:
${safe(data.tujuan)}

Karakter Siswa:
${getCharacterText(data.character)}

Kesulitan:
${safe(data.kesulitan, "Sedang")}

Jenis Materi:
${safe(data.jenisMateri, "Materi Interaktif")}

Gaya Materi:
${safe(data.gayaMateri, "Ceria dan Menarik")}

Panjang:
${safe(data.panjangMateri, "Sedang")}

Platform:
${safe(data.platform, "AI Umum")}

=========================================================
ADAPTIVE CLASS ENGINE
=========================================================

Profil:
${profile.label}

Level:
${profile.level}

Bahasa:
${profile.language}

Visual:
${profile.visual}

Narasi:
${profile.narrative}

Aktivitas:
${profile.activity}

Kemampuan berpikir:
${profile.thinking}

Struktur:
${profile.structure}

Teks visual:
${profile.visualText}

=========================================================
PEMBELAJARAN MENDALAM
=========================================================

Pastikan pembelajaran:
- berkesadaran
- bermakna
- menggembirakan

Bangun pengalaman:
- memahami
- mengaplikasi
- merefleksi

=========================================================
STRUKTUR HASIL
=========================================================

A. IDENTITAS
B. HOOK / PEMBUKA PERHATIAN
C. PERTANYAAN PEMANTIK
D. TUJUAN BELAJAR VERSI SISWA
E. PETA KONSEP
F. EKSPLORASI AWAL
G. MATERI INTI
H. CONTOH DALAM KEHIDUPAN SEHARI-HARI
I. TAHUKAH KAMU?
J. AYO AMATI
K. COBA TEBAK
L. AKTIVITAS SISWA
M. MINI CHALLENGE
N. CEK PEMAHAMAN
O. LATIHAN
P. EVALUASI MINIMAL 5 SOAL
Q. REFLEKSI
R. RINGKASAN
S. PESAN PENUTUP
T. SARAN VISUAL
U. DIFERENSIASI
V. CATATAN GURU

=========================================================
HOOK
=========================================================

Awali dengan salah satu:
- pertanyaan mengejutkan
- situasi sehari-hari
- cerita pendek
- teka-teki
- fakta menarik
- gambar yang perlu diamati
- mini challenge

Jangan langsung memulai dengan definisi panjang.

=========================================================
MISCONCEPTION
=========================================================

Identifikasi konsep yang berpotensi disalahpahami siswa.
Berikan:
- miskonsepsi
- konsep yang benar
- cara sederhana menjelaskannya

=========================================================
KARAKTER SISWA
=========================================================

Sesuaikan aktivitas dengan karakter siswa.
Jangan memaksakan semua karakter sekaligus.

=========================================================
KUALITAS
=========================================================

Pastikan:
- sesuai usia
- aman
- akurat
- tidak menyesatkan
- tidak terlalu sulit
- tidak terlalu panjang
- tujuan pembelajaran terlihat
- aktivitas benar-benar dapat dilakukan siswa
- evaluasi sesuai materi
- refleksi bermakna
- diferensiasi realistis

${getPlatformInstruction(data.platform)}

${buildVisualDesignInstruction(data)}

HASIL AKHIR SAJA.
`;
}


/* =========================================================
   MEDIA INTERAKTIF
   ========================================================= */

function buildMediaPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Bertindak sebagai instructional designer, guru SD,
ahli media pembelajaran digital, ahli Pembelajaran Mendalam,
dan ahli visual design.

Buat MEDIA PEMBELAJARAN INTERAKTIF.

DATA:
Mata Pelajaran: ${safe(data.mapel)}
Kelas: ${safe(data.kelas)}
Fase: ${getPhase(data.kelas)}
Materi: ${safe(data.materi)}
Tujuan: ${safe(data.tujuan)}
Karakter: ${getCharacterText(data.character)}
Jenis Media: ${safe(data.jenisMedia, "Presentasi Interaktif")}
Gaya Media: ${safe(data.gayaMedia, "Ceria dan Colorful")}
Kesulitan: ${safe(data.kesulitan, "Sedang")}

PROFIL KELAS:
${profile.language}
${profile.visual}
${profile.activity}
${profile.thinking}

WAJIB ADA:
1. Hook
2. Pertanyaan pemantik
3. Eksplorasi
4. Materi inti
5. Interaksi
6. Aktivitas siswa
7. Quiz
8. Feedback
9. Mini challenge
10. Refleksi
11. Penutup

Jika platform HTML:
buat interaksi nyata berupa tombol, kartu, feedback,
progress, animasi ringan, dan navigasi.

${getPlatformInstruction(data.platform)}

${buildVisualDesignInstruction(data)}

HASIL HARUS SIAP DIGUNAKAN.
`;
}


/* =========================================================
   PRESENTASI
   ========================================================= */

function buildPresentationPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah ahli desain presentasi pembelajaran SD,
instructional designer, guru SD, dan ahli Pembelajaran Mendalam.

BUAT PRESENTASI PEMBELAJARAN.

Mata Pelajaran: ${safe(data.mapel)}
Kelas: ${safe(data.kelas)}
Fase: ${getPhase(data.kelas)}
Materi: ${safe(data.materi)}
Tujuan: ${safe(data.tujuan)}
Jenis Presentasi: ${safe(data.jenisPresentasi, "Presentasi Interaktif")}
Gaya: ${safe(data.gayaPresentasi, "Ramah Anak")}
Jumlah Slide: ${safe(data.jumlahSlide, "8–10 slide")}
Karakter: ${getCharacterText(data.character)}

PROFIL SISWA:
${profile.language}
${profile.visual}
${profile.narrative}
${profile.thinking}

STRUKTUR SLIDE:
1. Cover
2. Hook
3. Pertanyaan pemantik
4. Tujuan belajar
5. Eksplorasi
6. Materi inti
7. Contoh
8. Aktivitas
9. Quiz/check understanding
10. Mini challenge
11. Refleksi
12. Penutup

Sesuaikan jumlah slide dengan pilihan pengguna.

JANGAN memenuhi slide dengan paragraf panjang.
Gunakan:
- visual
- diagram
- ikon
- kartu informasi
- pertanyaan
- ilustrasi
- ruang berpikir siswa.

${getPlatformInstruction(data.platform)}

${buildVisualDesignInstruction(data)}

HASIL AKHIR BERUPA RANCANGAN PRESENTASI LENGKAP.
`;
}


/* =========================================================
   LKPD
   ========================================================= */

function buildLKPDPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah ahli instructional design, guru Pendidikan SD,
penulis LKPD ramah anak, ahli Pembelajaran Mendalam,
dan visual designer.

BUAT LKPD CETAK/DIGITAL YANG MENARIK.

DATA:
Mapel: ${safe(data.mapel)}
Kelas: ${safe(data.kelas)}
Fase: ${getPhase(data.kelas)}
Materi: ${safe(data.materi)}
Tujuan: ${safe(data.tujuan)}
Jenis LKPD: ${safe(data.jenisLKPD, "Individu")}
Gaya: ${safe(data.gayaLKPD, "Ceria")}
Karakter: ${getCharacterText(data.character)}

PROFIL:
${profile.language}
${profile.visual}
${profile.activity}
${profile.thinking}

LKPD WAJIB MEMILIKI:
1. Identitas siswa
2. Judul menarik
3. Petunjuk
4. Tujuan pembelajaran
5. Pemantik
6. Ayo Mengamati
7. Ayo Mencoba
8. Aktivitas utama
9. Diskusi
10. Tantangan
11. Latihan
12. Evaluasi
13. Refleksi
14. Rubrik jika diperlukan

ATURAN:
- Jangan terlalu banyak teks.
- Sediakan ruang jawaban.
- Gunakan aktivitas yang benar-benar dapat dilakukan siswa.
- Sesuaikan tingkat kesulitan dengan kelas.
- Gunakan visual sebagai bagian aktivitas.

${getPlatformInstruction(data.platform)}

${buildVisualDesignInstruction(data)}

KHUSUS JIKA CANVA:
Hasil akhir harus terasa seperti LKPD anak modern dan menarik
secara visual, bukan dokumen administrasi hitam-putih.

Setiap halaman harus memiliki:
- hierarki visual
- aksen warna
- ilustrasi edukatif
- karakter/objek relevan
- elemen dekoratif
- kotak aktivitas
- ruang jawaban

Jangan menghasilkan desain dominan hitam-putih.

HASIL AKHIR SAJA.
`;
}


/* =========================================================
   GAME / KUIS
   ========================================================= */

function buildGamePrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah game-based learning designer, guru SD,
instructional designer, dan ahli Pembelajaran Mendalam.

BUAT GAME/KUIS EDUKATIF.

Mapel: ${safe(data.mapel)}
Kelas: ${safe(data.kelas)}
Fase: ${getPhase(data.kelas)}
Materi: ${safe(data.materi)}
Tujuan: ${safe(data.tujuan)}
Jenis Game: ${safe(data.jenisGame, "Kuis Cepat")}
Gaya: ${safe(data.gayaGame, "Ceria")}
Jumlah Soal: ${safe(data.jumlahSoal, "10 soal")}
Karakter: ${getCharacterText(data.character)}

PROFIL KELAS:
${profile.language}
${profile.visual}
${profile.activity}
${profile.thinking}

WAJIB ADA:
- cerita/game hook
- aturan permainan
- soal
- pilihan jawaban jika sesuai
- kunci jawaban
- skor
- feedback
- reward
- mini challenge
- hasil akhir
- refleksi singkat

Jika pengguna memilih:
Timer → buat konsep timer.
Level → buat level.
Nyawa → buat sistem nyawa.
Animasi → jelaskan animasi.
Suara → jelaskan audio.
Reward → gunakan bintang/poin/badge.

Pastikan game tetap edukatif, bukan hanya hiburan.

${getPlatformInstruction(data.platform)}

${buildVisualDesignInstruction(data)}

HASIL AKHIR SAJA.
`;
}


/* =========================================================
   HTML INTERAKTIF
   ========================================================= */

function buildHTMLPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah senior frontend developer,
instructional designer, guru SD, UX designer,
dan ahli game-based learning.

BUAT KONSEP HTML PEMBELAJARAN INTERAKTIF.

Mapel: ${safe(data.mapel)}
Kelas: ${safe(data.kelas)}
Fase: ${getPhase(data.kelas)}
Materi: ${safe(data.materi)}
Tujuan: ${safe(data.tujuan)}
Jenis HTML: ${safe(data.jenisHTML, "Materi Interaktif")}
Gaya: ${safe(data.gayaHTML, "Colorful")}
Karakter: ${getCharacterText(data.character)}

PROFIL SISWA:
${profile.language}
${profile.visual}
${profile.activity}
${profile.thinking}

FITUR:
${Array.isArray(data.fitur) ? data.fitur.join(", ") : safe(data.fitur)}

HTML HARUS MEMILIKI KONSEP:
- header
- progress
- navigation
- learning section
- interactive activity
- quiz
- feedback
- challenge
- reflection
- final result

JIKA FITUR DIPILIH:
Progress → progress indicator
Navigasi → next/back
Quiz → quiz interaktif
Feedback → feedback langsung
Skor → sistem skor
Animasi → CSS animation/transitions
Audio → konsep audio yang aman digunakan
Refleksi → pertanyaan refleksi

DESAIN:
- responsive
- mobile friendly
- tombol besar
- readable
- visual menarik
- tidak terlalu padat

${buildVisualDesignInstruction(data)}

${getPlatformInstruction("HTML Interaktif")}

Jika diminta kode HTML, hasilkan satu file HTML mandiri
yang dapat langsung dibuka di browser.

HASIL AKHIR SAJA.
`;
}


/* =========================================================
   RPM PEMBELAJARAN MENDALAM
   ========================================================= */

function buildRPMPrompt(data) {
  const phase = safe(data.fase, getPhase(data.kelas));

  return `
ANDA ADALAH:
- ahli perencanaan pembelajaran SD
- guru SD berpengalaman
- instructional designer
- ahli Pembelajaran Mendalam
- ahli asesmen
- ahli Kurikulum Merdeka
- ahli penyusunan Rencana Pembelajaran Mendalam (RPM)

TUGAS:
Buat Rencana Pembelajaran Mendalam (RPM) yang praktis,
realistis, sistematis, dan siap disalin ke Word.

=========================================================
RUJUKAN DAN PRINSIP
=========================================================

Selaraskan rancangan dengan:
- Panduan Pembelajaran dan Asesmen edisi revisi 2025
  Kemendikdasmen
- Permendikdasmen Nomor 13 Tahun 2025
- prinsip Pembelajaran Mendalam

Gunakan prinsip:
1. Berkesadaran
2. Bermakna
3. Menggembirakan

Pengalaman belajar:
1. Memahami
2. Mengaplikasi
3. Merefleksi

Kerangka pembelajaran:
1. Praktik pedagogis
2. Kemitraan pembelajaran
3. Lingkungan pembelajaran
4. Pemanfaatan digital

=========================================================
DELIMITASI DATA RESMI
=========================================================

JANGAN mengarang Capaian Pembelajaran resmi.

Jika CP tidak diberikan oleh pengguna:
tulis:
"CP perlu diverifikasi/ditempelkan oleh guru sesuai dokumen
kurikulum yang digunakan satuan pendidikan."

Jika CP diberikan pengguna:
gunakan CP tersebut dan jangan mengubah makna resminya.

=========================================================
IDENTITAS
=========================================================

Satuan Pendidikan:
${safe(data.satuanPendidikan, "SD")}

Nama Guru:
${safe(data.namaGuru)}

Mata Pelajaran:
${safe(data.mapel)}

Kelas:
${safe(data.kelas)}

Fase:
${phase}

Semester:
${safe(data.semester, "Ganjil")}

Tahun Pelajaran:
${safe(data.tahunPelajaran, "2026/2027")}

Materi:
${safe(data.materi)}

Tujuan Pembelajaran:
${safe(data.tujuan)}

Capaian Pembelajaran:
${safe(data.cp, "CP perlu diverifikasi/ditempelkan oleh guru sesuai dokumen kurikulum yang digunakan satuan pendidikan.")}

Alokasi Waktu:
${safe(data.alokasiWaktu, "2 JP")}

Jenis RPM:
${safe(data.jenisRPM, "RPM Lengkap")}

Model Pedagogis:
${safe(data.modelPedagogis, "Kontekstual dan aktif")}

Format:
${safe(data.formatRPM, "Tabel + Narasi")}

Dimensi Profil Lulusan:
${safe(
  data.dimensi,
  "Pilih yang paling relevan dengan tujuan dan aktivitas pembelajaran"
)}

Fitur:
${safe(
  data.fitur,
  "Asesmen awal, asesmen formatif, asesmen sumatif, diferensiasi, rubrik, refleksi, tindak lanjut"
)}

=========================================================
8 DIMENSI PROFIL LULUSAN
=========================================================

Gunakan hanya dimensi yang benar-benar relevan.

1. Keimanan dan Ketakwaan terhadap Tuhan YME
2. Kewargaan
3. Penalaran Kritis
4. Kreativitas
5. Kolaborasi
6. Kemandirian
7. Kesehatan
8. Komunikasi

Untuk setiap dimensi yang dipilih:
jelaskan hubungan dengan tujuan dan aktivitas pembelajaran.

=========================================================
OUTPUT RPM
=========================================================

A. IDENTITAS
B. CP DAN TP
C. PEMAHAMAN BERMAKNA / IDE BESAR
D. PERTANYAAN PEMANTIK
E. DIMENSI PROFIL LULUSAN + ALASAN
F. KERANGKA PEMBELAJARAN
   - Praktik pedagogis
   - Kemitraan pembelajaran
   - Lingkungan pembelajaran
   - Pemanfaatan digital
G. PRINSIP PEMBELAJARAN
   - Berkesadaran
   - Bermakna
   - Menggembirakan
H. ASESMEN AWAL
I. PENGALAMAN BELAJAR
   - Memahami
   - Mengaplikasi
   - Merefleksi
J. LANGKAH PEMBELAJARAN DALAM TABEL

Kolom:
Tahap | Waktu | Aktivitas Guru | Aktivitas Murid |
Prinsip Pembelajaran Mendalam | Bukti/Asesmen

K. ASESMEN FORMATIF
L. ASESMEN SUMATIF
M. INSTRUMEN / RUBRIK
N. KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN
O. DIFERENSIASI DAN DUKUNGAN
P. PENGAYAAN DAN TINDAK LANJUT
Q. MEDIA DAN SUMBER BELAJAR
R. REFLEKSI MURID
S. REFLEKSI GURU
T. LAMPIRAN INSTRUMEN
U. QUALITY CHECK

=========================================================
QUALITY CHECK
=========================================================

Periksa:
- tujuan selaras dengan kegiatan
- kegiatan selaras dengan asesmen
- asesmen mengumpulkan bukti yang relevan
- ada pengalaman memahami, mengaplikasi, merefleksi
- prinsip berkesadaran, bermakna, menggembirakan terlihat nyata
- diferensiasi realistis
- aktivitas sesuai kelas
- waktu realistis
- instrumen dapat digunakan guru
- tidak ada CP resmi yang dibuat-buat
- bahasa praktis untuk guru SD

HASIL AKHIR SAJA.
`;
}


/* =========================================================
   BLANKO NILAI & PENGOLAHAN ASESMEN
   ========================================================= */

function buildBlankoNilaiPrompt(data) {
  return `
ANDA ADALAH:
- ahli asesmen pendidikan SD
- guru SD berpengalaman
- ahli administrasi penilaian
- ahli pengolahan nilai
- instructional designer
- ahli Pembelajaran Mendalam

TUGAS:
Buat BLANKO NILAI DAN PENGOLAHAN ASESMEN yang realistis,
praktis, rapi, dan siap disalin ke Word atau Excel.

=========================================================
PRINSIP ASESMEN
=========================================================

Gunakan istilah dan struktur asesmen yang sesuai dengan
praktik asesmen pendidikan saat ini.

Jangan menjadikan istilah lama seperti:
- Tugas Harian
- PR
- UTS
- UAS

sebagai struktur utama.

Jika diperlukan, jelaskan pemetaan istilah lama secara singkat.

Gunakan kategori:

1. Asesmen Awal
2. Asesmen Formatif — Aktivitas Pembelajaran
3. Asesmen Formatif — Tugas Belajar Mandiri
4. Asesmen Formatif — Cek Pemahaman
5. Asesmen Formatif — Unjuk Kinerja
6. Asesmen Formatif/Sumatif — Projek/Produk
7. Asesmen Sumatif — Akhir Lingkup Pembelajaran
8. Asesmen Sumatif — Akhir Semester

Tidak semua jenis harus digunakan.
Pilih sesuai kebutuhan pembelajaran.

=========================================================
DATA
=========================================================

Satuan Pendidikan:
${safe(data.satuanPendidikan, "SD")}

Nama Guru:
${safe(data.namaGuru)}

Mata Pelajaran:
${safe(data.mapel)}

Kelas:
${safe(data.kelas)}

Semester:
${safe(data.semester, "Ganjil")}

Tahun Pelajaran:
${safe(data.tahunPelajaran, "2026/2027")}

Materi:
${safe(data.materi)}

Model Pengolahan:
${safe(
  data.modelPengolahan,
  "Lengkap — Nilai + Ketercapaian + Deskripsi"
)}

Jumlah Murid:
${safe(data.jumlahMurid, "30")}

Jumlah Formatif:
${safe(data.jumlahFormatif, "6")}

Jumlah Sumatif Akhir Lingkup:
${safe(data.jumlahSumatifLingkup, "3")}

Asesmen Sumatif Akhir Semester:
${safe(data.sas, "Ya")}

Deskripsi Capaian:
${safe(data.deskripsi, "Ya")}

KKTP:
${safe(data.kktp, "Ya")}

Bobot:
${safe(
  data.bobot,
  "Tidak menetapkan bobot nasional tetap; gunakan sesuai kebijakan satuan pendidikan"
)}

=========================================================
OUTPUT
=========================================================

A. IDENTITAS
B. PETUNJUK PENGGUNAAN
C. DAFTAR MURID
D. TABEL ASESMEN AWAL
E. TABEL ASESMEN FORMATIF
F. TABEL ASESMEN SUMATIF
G. REKAP KETERCAPAIAN TUJUAN PEMBELAJARAN
H. REKAP NILAI AKHIR JIKA DIPERLUKAN
I. KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN
J. CATATAN / UMPAN BALIK
K. DESKRIPSI CAPAIAN MURID
L. TINDAK LANJUT
   - Perlu Pendampingan
   - Sudah Mencapai Tujuan
   - Pengayaan
M. REKAPITULASI KELAS
N. CATATAN GURU
O. RUMUS / CARA PERHITUNGAN
P. FORMAT SIAP SALIN WORD / EXCEL

=========================================================
ATURAN PENTING
=========================================================

1. Jangan menetapkan bobot nasional tetap.
2. Jika menggunakan bobot, jelaskan bahwa bobot disesuaikan
   dengan kebijakan satuan pendidikan.
3. Tidak semua bentuk asesmen wajib digunakan.
4. Nilai kosong/blanko TIDAK sama dengan nilai 0.
5. Bedakan bukti asesmen formatif dan sumatif.
6. Sertakan catatan kualitatif jika relevan.
7. Deskripsi harus berorientasi pada kompetensi/tujuan,
   bukan sekadar angka.
8. Setiap rumus harus dijelaskan.
9. Buat tabel realistis untuk guru SD.
10. Jangan membuat angka siswa secara asal jika pengguna
    meminta blanko kosong.
11. Gunakan kolom yang mudah dipindahkan ke Excel.
12. Gunakan TP/Kriteria Ketercapaian Tujuan Pembelajaran
    sebagai dasar pengolahan jika dipilih pengguna.
13. Pengolahan nilai harus dapat dipahami guru.

=========================================================
CONTOH STRUKTUR TABEL
=========================================================

Buat tabel yang praktis.

Daftar murid:
No | NIS/NISN | Nama Murid

Asesmen awal:
No | Nama | TP/Kompetensi Awal | Bukti | Catatan

Formatif:
No | Nama | F1 | F2 | F3 | F4 | F5 | F6 | Catatan

Sumatif:
No | Nama | SL1 | SL2 | SL3 | SAS | Catatan

Rekap:
No | Nama | TP1 | TP2 | TP3 | Status | Tindak Lanjut

Jangan memaksakan jumlah TP jika pengguna tidak memberikan
TP secara spesifik. Gunakan placeholder yang jelas.

=========================================================
PEMBELAJARAN MENDAALAM
=========================================================

Jika relevan, hubungkan asesmen dengan:
- memahami
- mengaplikasi
- merefleksi

Pastikan asesmen tidak hanya mengukur hafalan.

=========================================================
QUALITY CHECK
=========================================================

Periksa:
- tabel mudah digunakan
- blanko tidak diisi angka palsu
- rumus jelas
- tidak ada bobot nasional yang dibuat-buat
- ketercapaian TP terlihat
- tindak lanjut tersedia
- deskripsi kompetensi tersedia jika diminta
- format dapat disalin ke Word/Excel
- sesuai jenjang SD

HASIL AKHIR SAJA.
`;
}


/* =========================================================
   AI ENGINE
   ========================================================= */

async function generateWithAI(prompt) {
  const response = await client.responses.create({
    model: "gpt-5.6-luna",
    input: prompt
  });

  return response.output_text;
}


/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/health", (req, res) => {
  res.json({
    success: true,
    version: "V6.3",
    status: "AI Learning Content Generator aktif",
    adaptiveClass: "Kelas 1–6",
    phases: ["Fase A", "Fase B", "Fase C"],

    generators: {
      media: true,
      material: true,
      presentation: true,
      lkpd: true,
      game: true,
      html: true,
      rpm: true,
      blankoNilai: true
    },

    visualDesignEngine: true,
    deepLearning: true
  });
});


/* =========================================================
   MAIN GENERATE API
   ========================================================= */

app.post("/generate", async (req, res) => {
  try {
    const data = req.body || {};

    const contentType = safe(data.contentType, "media");

    console.log("");
    console.log("==============================================");
    console.log("🤖 ARDI EDUAI V6.3");
    console.log("==============================================");
    console.log("Generator :", contentType);
    console.log("Mapel     :", safe(data.mapel));
    console.log("Kelas     :", safe(data.kelas));
    console.log("Fase      :", getPhase(data.kelas));
    console.log("Materi    :", safe(data.materi));
    console.log("Platform  :", safe(data.platform));
    console.log("==============================================");

    let prompt = "";

    switch (contentType) {

      /* =============================================
         1. MEDIA
         ============================================= */

      case "media":
        console.log("🎨 MEDIA INTERAKTIF");
        prompt = buildMediaPrompt(data);
        break;


      /* =============================================
         2. MATERI
         ============================================= */

      case "materi":
        console.log("📚 MATERI PEMBELAJARAN");
        prompt = buildMaterialPrompt(data);
        break;


      /* =============================================
         3. PRESENTATION
         ============================================= */

      case "presentation":
        console.log("📊 PRESENTASI");
        prompt = buildPresentationPrompt(data);
        break;


      /* =============================================
         4. LKPD
         ============================================= */

      case "lkpd":
        console.log("📋 LKPD");
        prompt = buildLKPDPrompt(data);
        break;


      /* =============================================
         5. GAME
         ============================================= */

      case "game":
        console.log("🎮 GAME / KUIS");
        prompt = buildGamePrompt(data);
        break;


      /* =============================================
         6. HTML
         ============================================= */

      case "html":
        console.log("💻 HTML INTERAKTIF");
        prompt = buildHTMLPrompt(data);
        break;


      /* =============================================
         7. RPM
         ============================================= */

      case "rpm":
        console.log("📋 RPM PEMBELAJARAN MENDALAM");
        prompt = buildRPMPrompt(data);
        break;


      /* =============================================
         8. BLANKO NILAI
         ============================================= */

      case "blankoNilai":
        console.log("📊 BLANKO NILAI & PENGOLAHAN ASESMEN");
        prompt = buildBlankoNilaiPrompt(data);
        break;


      /* =============================================
         INVALID
         ============================================= */

      default:
        return res.status(400).json({
          success: false,
          version: "V6.3",
          message: "Jenis generator tidak dikenali.",
          supportedTypes: [
            "media",
            "materi",
            "presentation",
            "lkpd",
            "game",
            "html",
            "rpm",
            "blankoNilai"
          ]
        });
    }


    /* =============================================
       GENERATE AI
       ============================================= */

    const hasil = await generateWithAI(prompt);

    console.log("✅ AI BERHASIL MEMBUAT HASIL");
    console.log("==============================================");

    res.json({
      success: true,
      version: "V6.3",
      contentType: contentType,
      classLevel: safe(data.kelas),
      phase: getPhase(data.kelas),
      platform: safe(data.platform),
      prompt: hasil
    });

  } catch (error) {

    console.error("");
    console.error("❌ ERROR ARDI EDUAI V6.3");
    console.error(error);

    res.status(500).json({
      success: false,
      version: "V6.3",
      message: "Terjadi kesalahan saat membuat konten AI.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined
    });
  }
});


/* =========================================================
   404
   ========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    version: "V6.3",
    message: "Endpoint tidak ditemukan."
  });
});


/* =========================================================
   START SERVER
   ========================================================= */

app.listen(PORT, () => {
  console.log("");
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║          🚀 ARDI EDUAI V6.3                 ║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log("║ 🤖 AI Learning Content Generator             ║");
  console.log("║ 📚 Adaptive Class Engine 1–6                 ║");
  console.log("║ 📋 RPM Pembelajaran Mendalam                 ║");
  console.log("║ 📊 Blanko Nilai & Asesmen                   ║");
  console.log("║ 🎨 Visual Design Engine                     ║");
  console.log("║ 🧠 Deep Learning                            ║");
  console.log("║                                              ║");
  console.log(`║ 🌐 http://localhost:${PORT}                  ║`);
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");
});