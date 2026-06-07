import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  FileText, 
  Layers, 
  Loader2, 
  Plus, 
  Settings, 
  Sparkles,
  ClipboardCheck,
  Printer,
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateModule } from './services/gemini';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const JENJANG_OPTIONS = ["SMP", "SMA"];

const KELAS_MAP: Record<string, string[]> = {
  "SMP": ["Kelas 7", "Kelas 8", "Kelas 9"],
  "SMA": ["Kelas 10", "Kelas 11", "Kelas 12"]
};

const MAPEL_MAP: Record<string, string[]> = {
  "SMP": [
    "IPA", "IPS", "Matematika", "Bahasa Indonesia", "Bahasa Inggris", 
    "Informatika", "PJOK", "Seni Budaya", "PAI & Budi Pekerti", "PPKn", "Lainnya"
  ],
  "SMA": [
    "Matematika", "Fisika", "Kimia", "Biologi", "Ekonomi", "Geografi", 
    "Sosiologi", "Sejarah", "Bahasa Indonesia", "Bahasa Inggris", 
    "Informatika", "PJOK", "Seni Budaya", "PAI & Budi Pekerti", "PPKn", "Lainnya"
  ]
};

export default function App() {
  const [topic, setTopic] = useState('');
  const [jenjang, setJenjang] = useState(JENJANG_OPTIONS[0]);
  const [kelas, setKelas] = useState(KELAS_MAP[JENJANG_OPTIONS[0]][0]);
  const [subject, setSubject] = useState(MAPEL_MAP[JENJANG_OPTIONS[0]][0]);
  const [customSubject, setCustomSubject] = useState('');
  
  const [includeLKPD, setIncludeLKPD] = useState<boolean>(false);
  const [includeBahanBacaan, setIncludeBahanBacaan] = useState<boolean>(false);
  
  // Custom identity and school metadata
  const [namaSekolah, setNamaSekolah] = useState("SMP AL-Multazam");
  const [namaPenyusun, setNamaPenyusun] = useState("Aria Winardi, S.Pd.");
  const [kepalaSekolah, setKepalaSekolah] = useState("Saeful Kafi, S.Pd.");
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState("14 Juli 2025");
  const [kota, setKota] = useState("Mojokerto");
  const [alokasiWaktu, setAlokasiWaktu] = useState("2x40 menit (1 pertemuan)");
  const [showIdentitySettings, setShowIdentitySettings] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Update dynamic fields when jenjang changes
  useEffect(() => {
    setKelas(KELAS_MAP[jenjang][0]);
    setSubject(MAPEL_MAP[jenjang][0]);
    setCustomSubject('');
    
    // Auto-update school suffix or defaults for SMA
    if (jenjang === "SMA") {
      setNamaSekolah("SMA AL-Multazam");
    } else {
      setNamaSekolah("SMP AL-Multazam");
    }
  }, [jenjang]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (subject === "Lainnya" && !customSubject.trim()) return;
    
    setIsGenerating(true);
    setGeneratedContent(null);
    
    const finalSubject = subject === "Lainnya" ? customSubject.trim() : subject;
    
    try {
      const result = await generateModule({
        topic,
        jenjang,
        kelas,
        subject: finalSubject,
        includeLKPD,
        includeBahanBacaan,
        namaSekolah,
        namaPenyusun,
        kepalaSekolah,
        tanggalPelaksanaan,
        kota,
        alokasiWaktu
      });
      setGeneratedContent(result || "Gagal menghasilkan konten.");
    } catch (error) {
      console.error(error);
      setGeneratedContent("Terjadi kesalahan saat menghubungi AI. Pastikan koneksi internet stabil.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadDoc = () => {
    if (!generatedContent) return;

    const markdownContainer = document.querySelector('.markdown-body');
    if (!markdownContainer) return;

    const htmlContent = markdownContainer.innerHTML;
    
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Rencana Pelaksanaan Pembelajaran</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 21.0cm 29.7cm; /* A4 */
            margin: 1.5cm 1.5cm 1.5cm 1.5cm;
          }
          body { 
            font-family: 'Arial', 'Calibri', sans-serif; 
            font-size: 11pt; 
            line-height: 1.5; 
            color: #000000;
          }
          h1 { 
            font-size: 16pt; 
            font-weight: bold; 
            text-align: center; 
            text-transform: uppercase; 
            margin-bottom: 20px; 
            color: #000000;
          }
          h2 { 
            font-size: 11pt; 
            font-weight: bold; 
            background-color: #83cdfd; 
            padding: 6px 10px; 
            margin-top: 24px; 
            margin-bottom: 12px; 
            text-transform: uppercase;
            border-bottom: 1px solid #475569;
          }
          h3 { 
            font-size: 10pt; 
            font-weight: bold; 
            background-color: #ffff00; 
            padding: 4px 8px; 
            margin-top: 18px; 
            margin-bottom: 10px; 
            text-transform: uppercase;
          }
          p, li { 
            font-size: 10pt; 
            color: #1f2937;
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 15px 0; 
          }
          th, td { 
            border: 1px solid #94a3b8; 
            padding: 6px 10px; 
            font-size: 9.5pt;
            text-align: left;
          }
          th { 
            background-color: #f1f5f9; 
            font-weight: bold; 
            color: #000000;
            border-bottom: 2px solid #475569;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          ul, ol { 
            margin-bottom: 15px; 
            padding-left: 20px; 
          }
          li { 
            margin-bottom: 5px; 
          }
          hr { 
            border: none;
            border-top: 4px double #1f2937;
            margin: 24px 0;
          }
          blockquote {
            border-left: 4px solid #3b82f6;
            padding: 10px;
            margin: 15px 0;
            background-color: #f0f7ff;
            color: #1e3a8a;
          }
          .signature-table {
            width: 100%;
            border-collapse: collapse;
            border: none !important;
            margin-top: 40px;
          }
          .signature-table td {
            border: none !important;
            width: 50%;
            vertical-align: top;
            padding: 0 10px;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + header], {
      type: 'application/msword;charset=utf-8'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Modul_Ajar_${topic.replace(/\s+/g, '_') || 'Kurikulum_Merdeka'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isFormReady = topic.trim() && (subject !== "Lainnya" || customSubject.trim() !== "");

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F2937] font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ModulAjar <span className="text-blue-600">Generator</span></h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">RPM edisi 2026</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
              SMP & SMA Ready
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Form */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md">
            <h2 className="text-lg font-bold mb-6 text-center text-gray-800">
              Konfigurasi Modul
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Jenjang Pendidikan</label>
                <div className="grid grid-cols-2 gap-2">
                  {JENJANG_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setJenjang(opt)}
                      className={cn(
                        "py-2 rounded-lg text-sm font-semibold border transition-all",
                        jenjang === opt 
                          ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kelas</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer text-sm font-medium"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                  >
                    {KELAS_MAP[jenjang].map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mata Pelajaran</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer text-sm font-medium"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    {MAPEL_MAP[jenjang].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {subject === "Lainnya" && (
                <div className="animate-fadeIn p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Ketik Mata Pelajaran Lainnya</label>
                  <input 
                    type="text" 
                    placeholder="Misal: Bahasa Arab, Fiqh, Tauhid" 
                    className="w-full px-4 py-2 text-sm rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium shadow-sm shadow-blue-50"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Topik Materi</label>
                <input 
                  type="text" 
                  placeholder="Misal: Fotosintesis pada Tumbuhan"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {/* Accordion Identitas Guru/Sekolah */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowIdentitySettings(!showIdentitySettings)}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-blue-600 transition-colors py-2 border-t border-b border-gray-100 mb-3"
                >
                  <span className="flex items-center gap-1">📝 Atur Identitas & Tanda Tangan</span>
                  <span>{showIdentitySettings ? "▲ TUTUP" : "▼ EDIT"}</span>
                </button>
                
                {showIdentitySettings && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4 text-left">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nama Sekolah</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                        value={namaSekolah}
                        onChange={(e) => setNamaSekolah(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nama Penyusun (Guru)</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                        value={namaPenyusun}
                        onChange={(e) => setNamaPenyusun(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Kepala Sekolah</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                        value={kepalaSekolah}
                        onChange={(e) => setKepalaSekolah(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Kota Kedudukan</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                          value={kota}
                          onChange={(e) => setKota(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tanggal</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                          value={tanggalPelaksanaan}
                          onChange={(e) => setTanggalPelaksanaan(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Alokasi Waktu</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                        value={alokasiWaktu}
                        onChange={(e) => setAlokasiWaktu(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Questionnaire for Attachments */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Sertakan LKPD?</span>
                      <span className="block text-[10px] text-gray-400 font-semibold">Opsional</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIncludeLKPD(true)}
                      className={cn("p-1.5 rounded-lg transition-all", includeLKPD === true ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400")}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setIncludeLKPD(false)}
                      className={cn("p-1.5 rounded-lg transition-all", includeLKPD === false ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-400")}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Sertakan Bahan Bacaan?</span>
                      <span className="block text-[10px] text-gray-400 font-semibold">Opsional</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIncludeBahanBacaan(true)}
                      className={cn("p-1.5 rounded-lg transition-all", includeBahanBacaan === true ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400")}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setIncludeBahanBacaan(false)}
                      className={cn("p-1.5 rounded-lg transition-all", includeBahanBacaan === false ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-400")}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !isFormReady}
                className={cn(
                  "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg mt-4",
                  isGenerating || !isFormReady
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyusun Modul...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Modul
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!generatedContent && !isGenerating ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border-2 border-dashed border-gray-200 h-[700px] flex flex-col items-center justify-center text-center p-12"
              >
                <div className="bg-blue-50 p-6 rounded-full mb-6">
                  <FileText className="w-12 h-12 text-blue-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Siap Menyusun Modul?</h3>
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                  Lengkapi data di samping dan jawab pertanyaan lampiran untuk menghasilkan modul ajar Kurikulum Merdeka yang presisi.
                </p>
              </motion.div>
            ) : isGenerating ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl border border-gray-200 h-[700px] flex flex-col items-center justify-center p-12 shadow-sm"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-600 shadow-inner"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-blue-600 animate-bounce" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-8 mb-2">Menyusun Modul Ajar...</h3>
                <p className="text-gray-500 text-center max-w-xs text-sm">
                  Kecerdasan Buatan sedang merangkai komponen Informasi Umum, Inti, dan Lampiran sesuai standar Kurikulum Merdeka.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col h-full min-h-[900px]"
              >
                <div className="bg-gray-50 px-6 py-4 md:px-8 md:py-5 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10">
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Dokumen Terbit</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
                    >
                      {copied ? <ClipboardCheck className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
                      {copied ? 'TERSALIN' : 'SALIN TEKS'}
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                    >
                      <Printer className="w-4 h-4" />
                      CETAK PDF
                    </button>
                    <button 
                      onClick={downloadDoc}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-md shadow-green-100 animate-pulse"
                    >
                      <Download className="w-4 h-4" />
                      UNDUH WORD (.DOC)
                    </button>
                  </div>
                </div>
                
                <div className="p-10 md:p-16 overflow-y-auto prose prose-blue max-w-none print:p-0 print:prose-sm">
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{generatedContent!}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-10 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-gray-800">ModulAjar Generator v2.0</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            Dirancang khusus untuk membantu Guru SMP & SMA di Indonesia.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Panduan</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Kebijakan</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @media print {
          header, aside, footer, .sticky, button, .no-print {
            display: none !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          main {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          section {
            width: 100% !important;
            margin: 0 !important;
          }
          .bg-white {
            border: none !important;
            box-shadow: none !important;
          }
          .markdown-body {
            padding: 1cm 1.5cm !important;
          }
          .markdown-body h1 {
            color: black !important;
            margin-bottom: 1.5rem !important;
          }
          .markdown-body h2 {
            border: none !important;
            color: black !important;
            background-color: #83cdfd !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .markdown-body h3 {
            border: none !important;
            color: black !important;
            background-color: #ffff00 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .markdown-body table, .markdown-body td, .markdown-body th {
            border: 1px solid black !important;
          }
        }
        
        .markdown-body h1 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: #000;
          border-bottom: none;
          text-align: center;
          text-transform: uppercase;
        }
        
        .markdown-body h2 {
          font-size: 1.05rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 1.25rem;
          color: #000;
          text-align: left;
          background-color: #83cdfd; /* Blue banner from screenshot */
          padding: 0.5rem 0.75rem;
          text-transform: uppercase;
          border: none;
          letter-spacing: 0.025em;
        }
        
        .markdown-body h3 {
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #000;
          text-align: left;
          background-color: #ffff00; /* Yellow banner highlight from screenshot */
          padding: 0.25rem 0.5rem;
          text-transform: uppercase;
          border: none;
          display: block;
          width: 100%;
        }
        
        .markdown-body p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #1f2937;
          font-size: 0.925rem;
        }
        
        .markdown-body ul {
          list-style-type: disc !important;
          margin-bottom: 1.25rem;
          padding-left: 1.75rem;
          font-size: 0.925rem;
        }
        
        .markdown-body ol {
          list-style-type: decimal !important;
          margin-bottom: 1.25rem;
          padding-left: 1.75rem;
          font-size: 0.925rem;
        }

        .markdown-body ul ul, .markdown-body ol ul {
          list-style-type: circle !important;
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          padding-left: 1.25rem;
        }

        .markdown-body ul ol, .markdown-body ol ol {
          list-style-type: lower-alpha !important;
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          padding-left: 1.25rem;
        }
        
        .markdown-body li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .markdown-body li.task-list-item {
          list-style-type: none !important;
          padding-left: 0;
          margin-left: -1rem;
        }

        .markdown-body input[type="checkbox"] {
          margin-right: 0.5rem;
          transform: scale(1.1);
          accent-color: #2563eb;
          vertical-align: middle;
          cursor: not-allowed;
        }
        
        .markdown-body blockquote {
          border-left: 4px solid #3b82f6;
          padding: 1rem;
          font-style: italic;
          color: #1e3a8a;
          background: #eff6ff;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        
        .markdown-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.75rem 0;
          font-size: 0.85rem;
          border: 1px solid #1e293b;
          background-color: #ffffff;
        }
        
        .markdown-body th, .markdown-body td {
          border: 1px solid #94a3b8;
          padding: 0.625rem 0.875rem;
          text-align: left;
          vertical-align: middle;
        }
        
        .markdown-body th {
          background-color: #f1f5f9;
          font-weight: 700;
          color: #0d1117;
          text-transform: uppercase;
          font-size: 0.775rem;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #475569;
        }

        .markdown-body tr:nth-child(even) {
          background-color: #f8fafc;
        }

        .markdown-body .signature-table,
        .markdown-body .signature-table tr,
        .markdown-body .signature-table td {
          border: none !important;
          background-color: transparent !important;
          background: transparent !important;
          padding: 8px 16px 8px 0px !important;
        }
        
        .markdown-body hr {
          border: 0;
          border-top: 4px double #1f2937; /* Double lines from the screenshot */
          margin: 2.25rem 0;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
