require("dotenv").config({
  path: require("path").join(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "..")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =========================================================
   ARDI EDUAI V6.4
   AI LEARNING CONTENT GENERATOR
   ========================================================= */

/* =========================================================
   HELPER
   ========================================================= */

function safe(value, fallback = "") {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return String(value).trim();
}

function getClassNumber(kelas) {
  const match = String(kelas || "").match(/\d+/);

  if (!match) {
    return 3;
  }

  const number = parseInt(match[0], 10);

  if (number < 1) return 1;
  if (number > 6) return 6;

  return number;
}

function getPhase(kelas) {
  const number = getClassNumber(kelas);

  if (number <= 2) {
    return "Fase A";
  }

  if (number <= 4) {
    return "Fase B";
  }

  return "Fase C";
}

function getClassProfile(kelas) {
  const number = getClassNumber(kelas);

  const profiles = {
    1: {
      kelas: "Kelas 1",
      fase: "Fase A",
      karakter:
        "Peserta didik kelas 1 SD. Gunakan bahasa sangat sederhana, kalimat pendek, konkret, ceria, banyak contoh dari kehidupan sehari-hari, dan aktivitas sederhana."
    },

    2: {
      kelas: "Kelas 2",
      fase: "Fase A",
      karakter:
        "Peserta didik kelas 2 SD. Gunakan bahasa sederhana, konkret, komunikatif, dekat dengan kehidupan sehari-hari, dengan instruksi yang jelas dan tidak terlalu panjang."
    },

    3: {
      kelas: "Kelas 3",
      fase: "Fase B",
      karakter:
        "Peserta didik kelas 3 SD. Gunakan bahasa komunikatif dan konkret, mulai mendorong kemampuan menjelaskan alasan, membandingkan, mengelompokkan, dan menerapkan konsep."
    },

    4: {
      kelas: "Kelas 4",
      fase: "Fase B",
      karakter:
        "Peserta didik kelas 4 SD. Gunakan bahasa yang jelas dan sesuai usia, dengan aktivitas yang mendorong pemahaman, penerapan, analisis sederhana, dan pemecahan masalah."
    },

    5: {
      kelas: "Kelas 5",
      fase: "Fase C",
      karakter:
        "Peserta didik kelas 5 SD. Gunakan bahasa akademik ringan namun tetap ramah anak. Dorong penerapan, analisis, penalaran, dan keterkaitan dengan kehidupan nyata."
    },

    6: {
      kelas: "Kelas 6",
      fase: "Fase C",
      karakter:
        "Peserta didik kelas 6 SD. Gunakan bahasa yang jelas dan sesuai usia. Dorong penalaran, penerapan konsep, analisis, evaluasi sederhana, dan penyelesaian masalah kontekstual."
    }
  };

  return profiles[number];
}

/* =========================================================
   PLATFORM INSTRUCTION
   ========================================================= */

function getPlatformInstruction(platform) {
  const value = safe(platform).toLowerCase();

  if (value.includes("canva")) {
    return `
PLATFORM: CANVA AI

Buat prompt yang sangat jelas untuk Canva AI.
Prioritaskan:
- desain visual yang menarik;
- hierarki informasi yang jelas;
- warna yang konsisten;
- ilustrasi edukatif;
- elemen interaktif jika sesuai;
- layout yang mudah digunakan guru dan peserta didik.

Jangan membuat desain yang dominan hitam-putih.
`;
  }

  if (value.includes("powerpoint")) {
    return `
PLATFORM: MICROSOFT POWERPOINT

Buat struktur slide yang jelas.
Setiap slide harus memiliki:
- judul;
- isi utama;
- visual yang relevan;
- aktivitas atau interaksi jika diperlukan.

Hindari slide yang terlalu penuh teks.
`;
  }

  if (value.includes("word")) {
    return `
PLATFORM: MICROSOFT WORD

Buat format yang mudah dipindahkan ke Microsoft Word.
Gunakan:
- heading;
- tabel;
- poin-poin;
- ruang jawaban;
- struktur dokumen yang rapi.
`;
  }

  if (value.includes("html")) {
    return `
PLATFORM: HTML WEB

Buat rancangan yang cocok untuk halaman web interaktif.
Prioritaskan:
- navigasi;
- tombol;
- kartu informasi;
- feedback;
- responsif;
- interaksi peserta didik.
`;
  }

  return `
PLATFORM: ${safe(platform, "Umum")}

Sesuaikan format hasil dengan platform yang dipilih.
`;
}

/* =========================================================
   VISUAL DESIGN ENGINE
   ========================================================= */

function buildVisualDesignInstruction(data) {
  const visualTheme = safe(
    data.visualTheme,
    "AI memilih otomatis berdasarkan materi"
  );

  const colorPalette = safe(
    data.colorPalette,
    "AI memilih otomatis"
  );

  const illustrationStyle = safe(
    data.illustrationStyle,
    "Sesuaikan materi"
  );

  const visualDensity = safe(
    data.visualDensity,
    "Sedang"
  );

  const visualMode = safe(
    data.visualMode,
    "Digital Berwarna"
  );

  const visualElements = Array.isArray(data.visualElements)
    ? data.visualElements.join(", ")
    : safe(
        data.visualElements,
        "Ilustrasi utama, karakter anak, gambar objek sesuai materi, ikon/badge"
      );

  return `
==================================================
VISUAL DESIGN ENGINE
==================================================

Tema visual:
${visualTheme}

Palet warna:
${colorPalette}

Gaya ilustrasi:
${illustrationStyle}

Kepadatan visual:
${visualDensity}

Mode:
${visualMode}

Elemen visual yang diinginkan:
${visualElements}

ATURAN VISUAL:

1. Jangan menghasilkan desain dominan hitam-putih.

2. Gunakan warna secara konsisten pada:
- heading;
- kotak aktivitas;
- ikon;
- ilustrasi;
- badge;
- tabel;
- elemen navigasi.

3. Gunakan ilustrasi yang relevan dengan materi.

4. Pertahankan keterbacaan teks.

5. Jangan menggunakan warna secara berlebihan.

6. Gunakan hierarki visual yang jelas.

7. Untuk LKPD, hasil akhir harus terasa seperti LKPD anak modern dan menarik secara visual, bukan dokumen administrasi hitam-putih.

8. Setiap halaman LKPD harus memiliki:
- hierarki visual;
- aksen warna;
- ilustrasi edukatif;
- karakter atau objek yang relevan;
- elemen dekoratif yang mendukung aktivitas belajar.

9. Visual harus mendukung pembelajaran, bukan sekadar hiasan.

==================================================
`;
}

/* =========================================================
   CHARACTER
   ========================================================= */

function getCharacterText(data) {
  if (Array.isArray(data.character)) {
    return data.character.join(", ");
  }

  return safe(
    data.character,
    "Gunakan karakter yang sesuai dengan usia peserta didik."
  );
}

/* =========================================================
   MATERIAL
   ========================================================= */

function buildMaterialPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah ahli instructional design, guru profesional SD, dan penulis materi pembelajaran berbasis Pembelajaran Mendalam.

BUAT MATERI PEMBELAJARAN.

DATA:
Mata Pelajaran: ${safe(data.mapel)}
Kelas: ${profile.kelas}
Fase: ${profile.fase}
Materi: ${safe(data.materi)}
Tujuan Pembelajaran: ${safe(data.tujuan)}
Kesulitan: ${safe(data.kesulitan)}
Karakter: ${getCharacterText(data)}

${getPlatformInstruction(data.platform)}

${buildVisualDesignInstruction(data)}

KARAKTER PESERTA DIDIK:
${profile.karakter}

PRINSIP:
- Materi harus akurat.
- Gunakan bahasa sesuai fase.
- Materi harus bermakna.
- Hubungkan dengan kehidupan sehari-hari.
- Gunakan contoh konkret.
- Dorong pemahaman, penerapan, dan penalaran.
- Hindari penjelasan terlalu abstrak.
- Jangan mengarang informasi yang tidak relevan.

FORMAT OUTPUT:

1. Judul
2. Tujuan Pembelajaran
3. Apersepsi
4. Materi inti
5. Contoh
6. Aktivitas peserta didik
7. Pertanyaan pemantik
8. Latihan
9. Refleksi
10. Ringkasan
11. Evaluasi singkat
12. Saran visual
`;
}

/* =========================================================
   MEDIA INTERAKTIF
   ========================================================= */

function buildMediaPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah ahli instructional design, guru SD, pengembang media pembelajaran interaktif, dan ahli Pembelajaran Mendalam.

BUAT PROMPT MEDIA PEMBELAJARAN INTERAKTIF.

DATA:
Mata Pelajaran: ${safe(data.mapel)}
Kelas: ${profile.kelas}
Fase: ${profile.fase}
Materi: ${safe(data.materi)}
Tujuan Pembelajaran: ${safe(data.tujuan)}
Platform: ${safe(data.platform)}
Kesulitan: ${safe(data.kesulitan)}
Karakter: ${getCharacterText(data)}

${getPlatformInstruction(data.platform)}

${buildVisualDesignInstruction(data)}

KARAKTER PESERTA DIDIK:
${profile.karakter}

MEDIA HARUS:
- menarik;
- interaktif;
- ramah anak;
- bermakna;
- kontekstual;
- sesuai usia;
- mendorong peserta didik aktif;
- memiliki feedback;
- memiliki navigasi yang jelas.

STRUKTUR OUTPUT:

1. Judul media
2. Sasaran peserta didik
3. Tujuan pembelajaran
4. Konsep utama
5. Alur media
6. Halaman pembuka
7. Materi interaktif
8. Aktivitas peserta didik
9. Kuis/evaluasi
10. Feedback jawaban
11. Reward
12. Penutup
13. Prompt visual lengkap
14. Catatan teknis implementasi
`;
}

/* =========================================================
   PRESENTATION
   ========================================================= */

function buildPresentationPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah ahli desain presentasi pendidikan SD dan Pembelajaran Mendalam.

BUAT RANCANGAN PRESENTASI PEMBELAJARAN.

DATA:
Mata Pelajaran: ${safe(data.mapel)}
Kelas: ${profile.kelas}
Fase: ${profile.fase}
Materi: ${safe(data.materi)}
Tujuan Pembelajaran: ${safe(data.tujuan)}
Platform: ${safe(data.platform)}
Kesulitan: ${safe(data.kesulitan)}
Karakter: ${getCharacterText(data)}

${getPlatformInstruction(data.platform)}

${buildVisualDesignInstruction(data)}

Buat presentasi yang:
- tidak terlalu penuh teks;
- menggunakan visual;
- memiliki alur pembelajaran;
- melibatkan peserta didik;
- menggunakan pertanyaan pemantik;
- memberikan contoh;
- memiliki aktivitas;
- memiliki evaluasi;
- memiliki refleksi.

FORMAT:

Slide 1: Cover
Slide 2: Tujuan Pembelajaran
Slide 3: Apersepsi
Slide 4 dan seterusnya: Materi
Slide aktivitas
Slide latihan
Slide evaluasi
Slide refleksi
Slide penutup

Untuk setiap slide tuliskan:
- Judul
- Isi
- Visual
- Aktivitas/interaksi
- Catatan guru
`;
}

/* =========================================================
   LKPD
   ========================================================= */

function buildLKPDPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah ahli instructional design, guru Pendidikan Dasar, dan penulis LKPD ramah anak.

BUAT LKPD CETAK.

DATA:
Mata Pelajaran: ${safe(data.mapel)}
Kelas: ${profile.kelas}
Fase: ${profile.fase}
Materi: ${safe(data.materi)}
Tujuan Pembelajaran: ${safe(data.tujuan)}
Platform: ${safe(data.platform)}
Kesulitan: ${safe(data.kesulitan)}
Karakter: ${getCharacterText(data)}

${getPlatformInstruction(data.platform)}

${buildVisualDesignInstruction(data)}

KARAKTER PESERTA DIDIK:
${profile.karakter}

LKPD HARUS:
- mudah dipahami;
- menarik;
- sesuai usia;
- memiliki ruang jawaban;
- menggunakan aktivitas nyata;
- mendorong berpikir;
- tidak terlalu banyak teks;
- memiliki instruksi jelas;
- dapat dicetak.

STRUKTUR:

1. Cover LKPD
2. Identitas peserta didik
3. Tujuan pembelajaran
4. Petunjuk
5. Apersepsi
6. Aktivitas 1
7. Aktivitas 2
8. Aktivitas 3
9. Tantangan
10. Refleksi
11. Kesimpulan
12. Penilaian

Pastikan LKPD tidak terasa seperti dokumen administrasi.
`;
}

/* =========================================================
   GAME / KUIS
   ========================================================= */

function buildGamePrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah ahli game-based learning untuk sekolah dasar.

BUAT GAME / KUIS PEMBELAJARAN.

DATA:
Mata Pelajaran: ${safe(data.mapel)}
Kelas: ${profile.kelas}
Fase: ${profile.fase}
Materi: ${safe(data.materi)}
Tujuan Pembelajaran: ${safe(data.tujuan)}
Platform: ${safe(data.platform)}
Kesulitan: ${safe(data.kesulitan)}
Karakter: ${getCharacterText(data)}

${getPlatformInstruction(data.platform)}

${buildVisualDesignInstruction(data)}

GAME HARUS:
- menyenangkan;
- mudah dimainkan;
- memiliki tujuan pembelajaran;
- memiliki aturan;
- memiliki skor;
- memberikan feedback;
- sesuai usia;
- tidak terlalu rumit.

FORMAT:

1. Judul game
2. Tujuan
3. Jumlah pemain
4. Durasi
5. Aturan
6. Cara bermain
7. Sistem skor
8. Soal/tantangan
9. Feedback
10. Reward
11. Penutup
`;
}

/* =========================================================
   HTML INTERAKTIF
   ========================================================= */

function buildHTMLPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah pengembang web pendidikan dan ahli instructional design.

BUAT PROMPT HTML INTERAKTIF.

DATA:
Mata Pelajaran: ${safe(data.mapel)}
Kelas: ${profile.kelas}
Fase: ${profile.fase}
Materi: ${safe(data.materi)}
Tujuan Pembelajaran: ${safe(data.tujuan)}
Platform: ${safe(data.platform)}
Kesulitan: ${safe(data.kesulitan)}
Karakter: ${getCharacterText(data)}

${buildVisualDesignInstruction(data)}

BUAT RANCANGAN HTML INTERAKTIF YANG MEMILIKI:
- halaman pembuka;
- materi;
- kartu informasi;
- tombol navigasi;
- aktivitas;
- kuis;
- feedback;
- skor;
- progress;
- hasil akhir.

DESAIN:
- responsif;
- ramah anak;
- modern;
- colorful;
- mudah digunakan;
- teks mudah dibaca.

OUTPUT:
Berikan kode HTML lengkap jika diminta untuk menghasilkan HTML.
Jika yang diminta adalah prompt, berikan prompt implementasi lengkap.
`;
}

/* =========================================================
   RPM PEMBELAJARAN MENDALAM
   ========================================================= */

function buildRPMPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah ahli Pembelajaran Mendalam dan perancang pembelajaran SD.

BUAT RENCANA PEMBELAJARAN MENDALAM (RPM).

DATA:
Mata Pelajaran: ${safe(data.mapel)}
Kelas: ${profile.kelas}
Fase: ${profile.fase}
Materi: ${safe(data.materi)}
Tujuan Pembelajaran: ${safe(data.tujuan)}
Karakter: ${getCharacterText(data)}

KARAKTER PESERTA DIDIK:
${profile.karakter}

PRINSIP PEMBELAJARAN MENDALAM:
- Berkesadaran
- Bermakna
- Menggembirakan
- Kontekstual
- Aktif
- Kolaboratif
- Reflektif
- Mendorong penalaran
- Menghubungkan pembelajaran dengan kehidupan nyata

SUSUN:

1. Identitas pembelajaran
2. Tujuan pembelajaran
3. Pemahaman bermakna
4. Pertanyaan pemantik
5. Kegiatan awal
6. Kegiatan inti
7. Eksplorasi
8. Elaborasi
9. Aplikasi
10. Refleksi
11. Asesmen diagnostik
12. Asesmen formatif
13. Asesmen sumatif
14. Diferensiasi
15. Media dan sumber belajar
16. Refleksi guru
`;
}

/* =========================================================
   BLANKO NILAI
   ========================================================= */

function buildBlankoNilaiPrompt(data) {
  const profile = getClassProfile(data.kelas);

  return `
Anda adalah ahli administrasi penilaian sekolah dasar.

BUAT BLANKO NILAI DAN PENGOLAHAN ASESMEN.

DATA:
Mata Pelajaran: ${safe(data.mapel)}
Kelas: ${profile.kelas}
Fase: ${profile.fase}
Materi: ${safe(data.materi)}
Tujuan Pembelajaran: ${safe(data.tujuan)}

BUAT FORMAT YANG DAPAT DIGUNAKAN GURU UNTUK:
- daftar nilai;
- asesmen formatif;
- asesmen sumatif;
- tugas;
- proyek;
- praktik;
- penilaian lainnya;
- rekapitulasi;
- nilai akhir.

Gunakan tabel yang rapi dan mudah dipindahkan ke Microsoft Excel atau Word.

Sertakan:
1. Identitas
2. Tabel nilai
3. Rumus/perhitungan
4. Rekap
5. Keterangan
6. Catatan guru
`;
}

/* =========================================================
   ASESMEN TENGAH PERIODE
   ========================================================= */

function buildAsesmenTengahPrompt(data) {
  const profile = getClassProfile(data.kelas);

  const jumlahSoal = safe(
    data.jumlahSoalAsesmen,
    "sesuai jumlah yang diminta guru"
  );

  const bentukSoal = safe(
    data.bentukSoalAsesmen,
    "Pilihan Ganda"
  );

  const levelKognitif = safe(
    data.levelKognitif,
    "Seimbang"
  );

  const komposisiKesulitan = safe(
    data.komposisiKesulitan,
    "Seimbang"
  );

  const sistemPenskoran = safe(
    data.sistemPenskoran,
    "Skor proporsional sesuai bentuk soal"
  );

  const komponenOutput = safe(
    data.komponenOutputAsesmen,
    "Kisi-kisi, soal, kunci jawaban, dan pedoman penskoran"
  );

  return `
============================================================
ARDI EDUAI V6.4
ASESMEN TENGAH PERIODE
============================================================

Anda adalah ahli asesmen pendidikan dasar, guru profesional SD,
ahli instructional design, dan ahli Pembelajaran Mendalam.

TUGAS UTAMA:
Buat perangkat ASESMEN TENGAH PERIODE berdasarkan data yang
diberikan oleh guru.

============================================================
IDENTITAS
============================================================

Satuan Pendidikan:
${safe(data.satuanPendidikan)}

Nama Guru:
${safe(data.namaGuru)}

Mata Pelajaran:
${safe(data.mapel)}

Kelas:
${profile.kelas}

Fase:
${profile.fase}

Semester:
${safe(data.semester)}

Tahun Pelajaran:
${safe(data.tahunPelajaran)}

============================================================
CAKUPAN MATERI
============================================================

MATERI YANG SUDAH DIAJARKAN SAMPAI TENGAH PERIODE:

${safe(data.materiSudahDiajarkan)}

TUJUAN PEMBELAJARAN YANG SUDAH DICAPAI:

${safe(data.tpAsesmen)}

============================================================
KETENTUAN ASESMEN
============================================================

Jumlah soal:
${jumlahSoal}

Bentuk soal:
${bentukSoal}

Dominasi kemampuan berpikir:
${levelKognitif}

Komposisi kesulitan:
${komposisiKesulitan}

Sistem penskoran:
${sistemPenskoran}

Komponen output:
${komponenOutput}

============================================================
ATURAN SANGAT PENTING
============================================================

INI ADALAH ASESMEN TENGAH PERIODE.

1. Soal HANYA boleh dibuat berdasarkan:
   a. Materi yang sudah diajarkan sampai tengah periode.
   b. Tujuan pembelajaran yang sudah dicapai dan diberikan guru.

2. JANGAN memasukkan:
   - materi yang belum diajarkan;
   - materi setelah tengah periode;
   - bab yang tidak tercantum;
   - konsep yang tidak tercantum;
   - tujuan pembelajaran yang tidak diberikan;
   - kompetensi tambahan yang diasumsikan oleh AI.

3. JANGAN mengarang atau memperluas cakupan materi hanya karena
   AI mengetahui materi tersebut dari pengetahuan umum.

4. Jika informasi yang diberikan guru terbatas, tetap gunakan
   informasi yang tersedia dan JANGAN memperluas cakupan secara
   asumtif.

5. Setiap soal WAJIB dapat ditelusuri kembali ke:
   - materi yang diberikan; dan
   - minimal satu tujuan pembelajaran yang diberikan guru.

6. Jangan membuat soal yang membutuhkan pengetahuan dari materi
   di luar daftar yang diberikan guru.

7. Soal boleh mengukur pemahaman, penerapan, analisis, dan
   penalaran selama masih menggunakan informasi dan konsep yang
   berasal dari materi yang sudah diajarkan.

8. Gunakan bahasa Indonesia yang sesuai dengan ${profile.kelas}
   dan ${profile.fase}.

9. Soal harus jelas dan tidak ambigu.

10. Untuk pilihan ganda:
    - hanya ada satu jawaban paling benar;
    - pengecoh harus masuk akal;
    - jangan membuat pilihan jawaban yang terlalu mudah ditebak.

11. Untuk soal uraian:
    - pertanyaan harus jelas;
    - sediakan jawaban ideal;
    - sediakan pedoman penskoran;
    - sediakan rubrik jika diperlukan.

12. Hindari pertanyaan yang hanya menguji hafalan apabila tujuan
    pembelajaran memungkinkan pengukuran penerapan atau penalaran.

13. Gunakan konteks kehidupan sehari-hari secara relevan, tetapi
    jangan memasukkan konsep baru yang belum dipelajari.

============================================================
KARAKTER PESERTA DIDIK
============================================================

${profile.karakter}

============================================================
FORMAT OUTPUT WAJIB
============================================================

Buat output dalam urutan berikut.

A. IDENTITAS ASESMEN

Tuliskan identitas lengkap asesmen.

B. PETUNJUK PESERTA DIDIK

Buat petunjuk pengerjaan yang sederhana dan sesuai usia.

C. KISI-KISI

Gunakan tabel dengan kolom:

| No | Tujuan Pembelajaran | Materi | Indikator Soal | Level Kognitif | Bentuk Soal | Nomor Soal | Kesulitan |

D. NASKAH SOAL

Susun semua soal sesuai jumlah dan bentuk yang diminta.

Jika Pilihan Ganda:
A.
B.
C.
D.

Jika bentuk lain, sesuaikan format.

E. KUNCI JAWABAN

Buat kunci jawaban lengkap berdasarkan nomor soal.

F. PEDOMAN PENSKORAN

Jelaskan skor setiap bentuk soal dan cara menghitung nilai.

G. RUBRIK SOAL URAIAN

Jika terdapat soal uraian, buat rubrik yang jelas.

H. PEMETAAN SOAL

Buat tabel:

| Nomor Soal | Materi | Tujuan Pembelajaran | Level Kognitif | Bentuk | Kesulitan |

I. KONTROL CAKUPAN MATERI

Buat pemeriksaan akhir dengan tabel:

| No Soal | Sesuai Materi yang Diberikan? | Sesuai TP? | Ada Materi di Luar Cakupan? |

Semua soal harus dinyatakan sesuai.

J. CATATAN KUALITAS

Berikan ringkasan:
- jumlah soal;
- distribusi bentuk soal;
- distribusi tingkat kognitif;
- distribusi kesulitan;
- ketercakupan tujuan pembelajaran;
- konfirmasi bahwa tidak ada materi di luar cakupan.

JANGAN menambahkan materi baru.

============================================================
`;
}

/* =========================================================
   ASESMEN AKHIR PERIODE
   ========================================================= */

function buildAsesmenAkhirPrompt(data) {
  const profile = getClassProfile(data.kelas);

  const jumlahSoal = safe(
    data.jumlahSoalAsesmen,
    "sesuai jumlah yang diminta guru"
  );

  const bentukSoal = safe(
    data.bentukSoalAsesmen,
    "Pilihan Ganda"
  );

  const levelKognitif = safe(
    data.levelKognitif,
    "Seimbang"
  );

  const komposisiKesulitan = safe(
    data.komposisiKesulitan,
    "Seimbang"
  );

  const sistemPenskoran = safe(
    data.sistemPenskoran,
    "Skor proporsional sesuai bentuk soal"
  );

  const komponenOutput = safe(
    data.komponenOutputAsesmen,
    "Kisi-kisi, soal, kunci jawaban, dan pedoman penskoran"
  );

  return `
============================================================
ARDI EDUAI V6.4
ASESMEN AKHIR PERIODE
============================================================

Anda adalah ahli asesmen pendidikan dasar, guru profesional SD,
ahli instructional design, dan ahli Pembelajaran Mendalam.

TUGAS UTAMA:
Buat perangkat ASESMEN AKHIR PERIODE berdasarkan keseluruhan
materi dan tujuan pembelajaran yang telah dipelajari selama
periode dan diberikan oleh guru.

============================================================
IDENTITAS
============================================================

Satuan Pendidikan:
${safe(data.satuanPendidikan)}

Nama Guru:
${safe(data.namaGuru)}

Mata Pelajaran:
${safe(data.mapel)}

Kelas:
${profile.kelas}

Fase:
${profile.fase}

Semester:
${safe(data.semester)}

Tahun Pelajaran:
${safe(data.tahunPelajaran)}

============================================================
CAKUPAN MATERI
============================================================

MATERI YANG SUDAH DIPELAJARI SELAMA PERIODE:

${safe(data.materiSudahDiajarkan)}

TUJUAN PEMBELAJARAN:

${safe(data.tpAsesmen)}

============================================================
KETENTUAN ASESMEN
============================================================

Jumlah soal:
${jumlahSoal}

Bentuk soal:
${bentukSoal}

Dominasi kemampuan berpikir:
${levelKognitif}

Komposisi kesulitan:
${komposisiKesulitan}

Sistem penskoran:
${sistemPenskoran}

Komponen output:
${komponenOutput}

============================================================
ATURAN SANGAT PENTING
============================================================

INI ADALAH ASESMEN AKHIR PERIODE.

1. Soal hanya boleh dibuat berdasarkan keseluruhan materi dan
   tujuan pembelajaran yang diberikan oleh guru.

2. Jangan mengarang atau menambahkan materi yang tidak tercantum.

3. Jangan mengasumsikan materi kurikulum lain yang tidak diberikan
   oleh guru.

4. Jangan menggunakan materi dari periode berikutnya.

5. Semua soal harus dapat ditelusuri ke materi dan tujuan
   pembelajaran yang diberikan.

6. Soal boleh mengintegrasikan beberapa materi yang memang
   tercantum dalam daftar materi.

7. Soal boleh menggunakan konteks kehidupan sehari-hari.

8. Soal boleh mengukur:
   - pemahaman;
   - penerapan;
   - analisis;
   - evaluasi sederhana;
   - penalaran;

   selama masih berada dalam cakupan materi yang diberikan.

9. Gunakan bahasa Indonesia yang sesuai dengan ${profile.kelas}
   dan ${profile.fase}.

10. Soal harus jelas dan tidak ambigu.

11. Untuk pilihan ganda:
    - hanya ada satu jawaban paling benar;
    - pengecoh harus logis;
    - jangan membuat pilihan jawaban yang membingungkan.

12. Untuk uraian:
    - buat jawaban ideal;
    - buat pedoman penskoran;
    - buat rubrik jika diperlukan.

13. Jangan mengukur kompetensi yang tidak diajarkan.

============================================================
KARAKTER PESERTA DIDIK
============================================================

${profile.karakter}

============================================================
FORMAT OUTPUT WAJIB
============================================================

A. IDENTITAS ASESMEN

B. PETUNJUK PESERTA DIDIK

C. KISI-KISI

Gunakan tabel:

| No | Tujuan Pembelajaran | Materi | Indikator Soal | Level Kognitif | Bentuk Soal | Nomor Soal | Kesulitan |

D. NASKAH SOAL

Susun seluruh soal sesuai jumlah dan bentuk yang diminta.

E. KUNCI JAWABAN

F. PEDOMAN PENSKORAN

G. RUBRIK SOAL URAIAN

Jika terdapat uraian, buat rubrik yang jelas.

H. PEMETAAN SOAL

| Nomor Soal | Materi | Tujuan Pembelajaran | Level Kognitif | Bentuk | Kesulitan |

I. KONTROL CAKUPAN

| No Soal | Sesuai Materi? | Sesuai TP? | Materi di Luar Cakupan? |

J. CATATAN KUALITAS

Berikan ringkasan:
- jumlah soal;
- distribusi bentuk soal;
- distribusi kognitif;
- distribusi kesulitan;
- ketercakupan tujuan pembelajaran;
- konfirmasi tidak ada materi di luar cakupan.

============================================================
`;
}

/* =========================================================
   AI GENERATION
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
    version: "V6.4",
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
      blankoNilai: true,
      asesmenTengah: true,
      asesmenAkhir: true
    },

    visualDesignEngine: true,
    deepLearning: true,
    assessmentEngine: true
  });
});

/* =========================================================
   MAIN GENERATE ENDPOINT
   ========================================================= */

app.post("/generate", async (req, res) => {
  try {
    const data = req.body || {};
    const contentType = safe(data.contentType, "media");

    const materiLog = safe(
      data.materi,
      data.materiSudahDiajarkan
    );

    console.log("");
    console.log("================================================");
    console.log("🤖 ARDI EDUAI V6.4");
    console.log("================================================");
    console.log("Generator :", contentType);
    console.log("Mapel     :", safe(data.mapel));
    console.log("Kelas     :", safe(data.kelas));
    console.log("Fase      :", getPhase(data.kelas));
    console.log("Materi    :", materiLog);
    console.log("Platform  :", safe(data.platform));
    console.log("================================================");

    let prompt = "";

    switch (contentType) {
      case "media":
        console.log("🎨 MEDIA INTERAKTIF");
        prompt = buildMediaPrompt(data);
        break;

      case "materi":
        console.log("📚 MATERI PEMBELAJARAN");
        prompt = buildMaterialPrompt(data);
        break;

      case "presentation":
        console.log("📊 PRESENTASI");
        prompt = buildPresentationPrompt(data);
        break;

      case "lkpd":
        console.log("📋 LKPD");
        prompt = buildLKPDPrompt(data);
        break;

      case "game":
        console.log("🎮 GAME / KUIS");
        prompt = buildGamePrompt(data);
        break;

      case "html":
        console.log("💻 HTML INTERAKTIF");
        prompt = buildHTMLPrompt(data);
        break;

      case "rpm":
        console.log("📋 RPM PEMBELAJARAN MENDALAM");
        prompt = buildRPMPrompt(data);
        break;

      case "blankoNilai":
        console.log("📊 BLANKO NILAI & PENGOLAHAN ASESMEN");
        prompt = buildBlankoNilaiPrompt(data);
        break;

      case "asesmenTengah":
        console.log("📝 ASESMEN TENGAH PERIODE");
        prompt = buildAsesmenTengahPrompt(data);
        break;

      case "asesmenAkhir":
        console.log("📝 ASESMEN AKHIR PERIODE");
        prompt = buildAsesmenAkhirPrompt(data);
        break;

      default:
        return res.status(400).json({
          success: false,
          version: "V6.4",
          message: "Jenis generator tidak dikenali.",
          supportedTypes: [
            "media",
            "materi",
            "presentation",
            "lkpd",
            "game",
            "html",
            "rpm",
            "blankoNilai",
            "asesmenTengah",
            "asesmenAkhir"
          ]
        });
    }

    const hasil = await generateWithAI(prompt);

    console.log("✅ AI BERHASIL MEMBUAT HASIL");
    console.log("================================================");

    res.json({
      success: true,
      version: "V6.4",
      contentType: contentType,
      classLevel: safe(data.kelas),
      phase: getPhase(data.kelas),
      platform: safe(data.platform),
      prompt: hasil
    });
  } catch (error) {
    console.error("");
    console.error("❌ ERROR ARDI EDUAI V6.4");
    console.error(error);

    res.status(500).json({
      success: false,
      version: "V6.4",
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
    version: "V6.4",
    message: "Endpoint tidak ditemukan."
  });
});

/* =========================================================
   SERVER START
   ========================================================= */

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log("");
    console.log("🚀 ARDI EDUAI V6.4");
    console.log(`🌐 http://localhost:${PORT}`);
  });
}

module.exports = app;