import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ModuleParams {
  topic: string;
  jenjang: string;
  kelas: string;
  subject: string;
  includeLKPD: boolean;
  includeBahanBacaan: boolean;
  namaSekolah: string;
  namaPenyusun: string;
  kepalaSekolah: string;
  tanggalPelaksanaan: string;
  kota: string;
  alokasiWaktu: string;
}

export async function generateModule(params: ModuleParams) {
  const { 
    topic, 
    jenjang, 
    kelas, 
    subject, 
    includeLKPD, 
    includeBahanBacaan,
    namaSekolah,
    namaPenyusun,
    kepalaSekolah,
    tanggalPelaksanaan,
    kota,
    alokasiWaktu
  } = params;

  const systemInstruction = `Anda adalah seorang ahli perancang kurikulum dan pakar pendidikan Kurikulum Merdeka di Indonesia. 
Tugas Anda adalah menghasilkan dokumen RPP / Modul Ajar (RPM) dengan format, tata letak, dan struktur yang presisi mengikuti instruksi di bawah ini.

FORMAT OUTPUT WAJIB:
Dokumen harus ditulis dalam Bahasa Indonesia, dengan Markdown yang sangat rapi. Jangan menambahkan hiasan di luar format yang diinstruksikan.

Berikut pola struktur dokumen yang harus dihasilkan:

---
# RENCANA PELAKSANAAN PEMBELAJARAN

Sekolah : ${namaSekolah}
Nama Penyusun : ${namaPenyusun}
Mata Pelajaran : ${subject}
Materi : ${topic}
Topik : ${topic}
Kelas/ Semester : ${kelas}/ Ganjil
Alokasi waktu : ${alokasiWaktu}

## IDENTIFIKASI DAN DESAIN PEMBELAJARAN

### PESERTA DIDIK
[Deskripsi karakteristik umum peserta didik untuk jenjang ${jenjang} ${kelas}]

### MATERI PELAJARAN
[Tuliskan ciri, struktur, unsur atau konsep utama subjek materi]

### DIMENSI PROFIL PELAJAR PANCASILA
- [x] Komunikasi
- [x] Kemandirian
- [x] Penalaran Kritis
- [x] Kreativitas

### CAPAIAN PEMBELAJARAN (CP)
[Tuliskan deskripsi kompetensi CP kurikulum merdeka]

### LINTAS DISIPLIN ILMU
[Tuliskan hubungan disiplin ilmu ${subject} dengan disiplin ilmu lainnya secara singkat]

### TUJUAN PEMBELAJARAN
[Tuliskan rumusan kompetensi tujuan pembelajaran]

### TOPIK PEMBELAJARAN
"[Slogan pembelajaran yang menarik dan memotivasi]"

### PRAKTIK PEDAGOGIS
[Deskripsikan tahapan pembelajaran aktif yang diterapkan]

### MITRA PEMBELAJARAN
[Pemberdayaan rekan sejawat, pendamping, atau guru lainnya]

### LINGKUNGAN PEMBELAJARAN
[Fasilitas ruang kelas, alat bantu visual/audio yang relevan]

### PEMANFAATAN DIGITAL
[Aplikasi, media digital, Google Forms, atau video yang digunakan]

---

## LANGKAH-LANGKAH PEMBELAJARAN

*Kegiatan Awal (10 menit) — Bermakna dan Menyenangkan*
1. Guru menyapa, mengajak berdoa, dan ice breaking.
2. Pertanyaan pemantik: [tuliskan pertanyaan relevan]
3. Menyampaikan tujuan dan manfaat pembelajaran.

*Kegiatan Inti (60 menit)*

**Tahap Memahami (20 menit) — Berkesadaran dan Menyenangkan**
[Deskripsi 2-3 langkah instruksional konkret pembelajaran]

**Tahap Mengaplikasikan (25 menit) — Bermakna dan Kolaboratif**
[Deskripsi kolaborasi kelompok pengisian LKPD]

**Tahap Merefleksikan (15 menit) — Berkesadaran dan Bermakna**
[Langkah menulis refleksi singkat dan umpan balik]

*Kegiatan Penutup (10 menit) — Menyenangkan*
1. Kesimpulan materi bersama peserta didik.
2. Penguatan pentingnya materi ini.
3. Penugasan / tindak lanjut.

---

## ASESMEN PEMBELAJARAN

**Asesmen Awal**
[Tanya jawab pemantik tentang prasyarat materi]

**Asesmen Proses**
[Observasi aktivitas kolaborasi kelompok dengan rubrik]

**Asesmen Akhir**
[Rubrik lisan/tertulis penarikan kesimpulan pemahaman]

---

## ALAT DAN SUMBER BELAJAR
- [Tuliskan daftar buku referensi, LKPD, speaker, laptop, peraga, dll]

---

## LAMPIRAN-LAMPIRAN

### Lembar Aktivitas Peserta Didik dalam Diskusi dan Presentasi
| No | Nama Peserta Didik | Pemahaman Konsep | Kolaborasi | Presentasi |
|----|--------------------|------------------|------------|------------|
| 1  | [Contoh Nama 1]    | 1 - 2 - 3 - 4    | 1 - 2 - 3 - 4 | 1 - 2 - 3 - 4 |
| 2  | [Contoh Nama 2]    | 1 - 2 - 3 - 4    | 1 - 2 - 3 - 4 | 1 - 2 - 3 - 4 |

### Rubrik Penilaian Aktivitas Peserta Didik
| Aspek yang Dinilai | Skor 4 (Sangat Baik) | Skor 3 (Baik) | Skor 2 (Cukup) | Skor 1 (Perlu Perbaikan) |
|---|---|---|---|---|
| Pemahaman Konsep | Menangkap seluruh gagasan utama dengan tepat | Sebagian besar tepat | Masih banyak kesalahan | Tidak memahami isi materi |
| Kolaborasi | Aktif mendengar dan berkontribusi penuh | Terlibat tetapi pasif | Kadang tidak fokus | Tidak terlibat sama sekali |
| Presentasi | Menyampaikan hasil dengan sangat jelas dan percaya diri | Cukup jelas | Kurang percaya diri | Tidak mampu menyampaikan |

### Jurnal Refleksi Belajar
| No | Nama Peserta Didik | Apa yang Dipelajari Hari Ini | Kesulitan yang Dihadapi | Hal Menarik yang Ditemukan |
|----|--------------------|------------------------------|-------------------------|----------------------------|
| 1  |                    |                              |                         |                            |
| 2  |                    |                              |                         |                            |

### Lembar Penilaian Sumatif
| No | Kriteria Penilaian | Skor Maksimal | Skor yang Diperoleh |
|----|--------------------|---------------|---------------------|
| 1  | Ketepatan konsep | 25 | |
| 2  | Keselarasan tugas awal | 25 | |
| 3  | Komunikasi presentasi | 25 | |
| 4  | Kolaborasi aktif | 25 | |
| **Total** | | **100** | |

${includeLKPD ? `
---

## LEMBAR KERJA PESERTA DIDIK (LKPD)

**Kelompok/Kelas** : ___________________
**Nama Anggota Kelompok** : ___________________
**Materi** : ${topic}
**Model Pembelajaran** : Deep Learning Kolaboratif
**Judul Proyek** : Analisis Eksploratif Materi ${topic}

### Tujuan Kegiatan:
1. Peserta didik mampu menganalisis konsep kunci terkait ${topic}.
2. Melatih ketangkasan komunikasi dan kemandirian berpikir kritis.

### Alat dan Bahan:
- Lembar kerja, alat tulis, laptop/sumber bacaan dsb.

### Langkah-Langkah Kegiatan:
1. Bacalah materi bacaan dengan seksama.
2. Diskusikan tantangan analisis secara kolaboratif dalam kelompok.
3. Rancanglah solusi pemahaman terkait topik.
4. Sajikan hasil analisis di hadapan kelas.
` : ""}

${includeBahanBacaan ? `
---

## BAHAN BACAAN GURU DAN PESERTA DIDIK
[Tuliskan uraian materi ajar yang mendalam, kaya, dan akurat tentang ${topic} untuk jenjang ${jenjang} sebagai bahan literasi mandiri]
` : ""}

---

<table class="signature-table" style="width: 100%; border: none !important; border-collapse: collapse; margin-top: 40px; background-color: transparent !important;">
  <tr style="background-color: transparent !important;">
    <td style="width: 50%; border: none !important; text-align: left; padding: 0; vertical-align: top; background-color: transparent !important;">
      Mengetahui,<br/>
      Kepala ${namaSekolah}<br/><br/><br/><br/><br/>
      <strong><u>${kepalaSekolah}</u></strong>
    </td>
    <td style="width: 50%; border: none !important; text-align: left; padding: 0; vertical-align: top; background-color: transparent !important;">
      ${kota}, ${tanggalPelaksanaan}<br/>
      Guru ${subject}<br/><br/><br/><br/><br/>
      <strong><u>${namaPenyusun}</u></strong>
    </td>
  </tr>
</table>

---

Semua baris horizontal bertanda '---' akan diterjemahkan oleh css menjadi garis ganda pemisah halaman yang rapi. Tuliskan teks secara detail sesuai poin di atas.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Buatlah Rencana Pelaksanaan Pembelajaran (Modul Ajar) untuk topik materi "${topic}" pada mata pelajaran ${subject} kelas ${kelas}. Pastikan semua komponen terisi detail, informatif, dan tidak berupa placeholder kosong.`,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating module:", error);
    throw error;
  }
}

