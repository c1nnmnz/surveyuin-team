/**
 * Mock data for testimonials to simulate API responses during development
 */

// Import the real service units
import { serviceUnits } from '../../data/serviceUnits';

// Mock services - using the first 10 from real service units
export const mockServices = serviceUnits.slice(0, 10).map((service, index) => ({
  id: (index + 1).toString(),
  name: service.name.replace('Layanan ', ''),
  description: service.description,
  category: service.category.toLowerCase(),
  verified: true
}));

// Mock testimonials
export const mockTestimonials = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    role: 'Mahasiswa Fakultas Tarbiyah dan Keguruan',
    content: 'Alhamdulillah, Layanan Mikwa FTK benar-benar menjadi penyelamat bagi saya! Dulu harus bolak-balik kantor fakultas untuk mengurus KRS, KHS, dan surat keterangan aktif. Sekarang semua bisa dilakukan online. Saya sangat senang dengan kemudahan akses buku panduan mahasiswa dan jadwal kuliah yang bisa diakses kapan saja. Terima kasih Mikwa FTK sudah memudahkan perkuliahan kami di PAI!',
    rating: 5,
    sentiment: 'positive',
    date: '2023-09-20T08:45:00',
    timestamp: 'Baru saja',
    helpfulCount: 12,
    isVerified: true,
    isFeatured: true,
    serviceId: '1',
    serviceName: 'Mikwa FTK',
    replies: [
      {
        id: '101',
        author: 'Admin Mikwa FTK',
        content: 'Terima kasih banyak Mas Ahmad atas apresiasinya. Kami senang Layanan Mikwa FTK dapat membantu proses perkuliahan Anda di jurusan PAI. InsyaAllah semester depan kami akan menambahkan fitur notifikasi jadwal ujian dan pengumuman penting lainnya. Semoga sukses dalam perkuliahannya!',
        timestamp: '10 menit yang lalu',
        isAdmin: true
      }
    ]
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    role: 'Mahasiswa Fakultas Tarbiyah dan Keguruan',
    content: 'Sebagai mahasiswa Pendidikan Bahasa Arab yang harus membagi waktu dengan kegiatan organisasi, saya sangat bergantung pada E-Learning UTIPD UIN Antasari. Platform-nya sudah cukup baik untuk pembelajaran bahasa, tapi sering kendala saat video conference dengan banyak peserta. Kualitas audio dan video sering terganggu saat ujian daring. Harapan saya UTIPD bisa meng-upgrade server dan menambahkan fitur rekam otomatis untuk setiap pertemuan, jadi bisa direview saat belajar untuk ujian.',
    rating: 3,
    sentiment: 'neutral',
    date: '2023-09-18T14:30:00',
    timestamp: '2 jam yang lalu',
    helpfulCount: 8,
    isVerified: true,
    isFeatured: false,
    serviceId: '2',
    serviceName: 'UTIPD',
    replies: []
  },
  {
    id: '3',
    name: 'Anonymous',
    role: 'Mahasiswa',
    content: 'Website Perpustakaan UIN Antasari sangat mengecewakan! Saya mencoba mencari referensi untuk skripsi tentang pendidikan Islam kontemporer, tapi search engine-nya tidak akurat dan sering error. Katalog bukunya tidak diupdate, padahal kata teman saya ada koleksi baru. Saya buang-buang waktu berjam-jam tanpa hasil. Tolong segera diperbaiki, deadlinenya sudah dekat!',
    rating: 1,
    sentiment: 'negative',
    date: '2023-09-23T10:15:00',
    timestamp: '30 menit yang lalu',
    helpfulCount: 3,
    isVerified: false,
    isFeatured: false,
    serviceId: '4',
    serviceName: 'Perpustakaan',
    replies: []
  },
  {
    id: '4',
    name: 'Fadiyah Nur',
    role: 'Mahasiswa Fakultas Ekonomi dan Bisnis Islam',
    content: 'Layanan Kerjasama UIN Antasari sangat membantu saat saya mengikuti program pertukaran mahasiswa. Proses pengajuan berkas dan MoU dengan kampus tujuan jadi lebih transparan, meskipun beberapa kali aplikasi crash saat upload dokumen transkrip dan sertifikat. Alhamdulillah stafnya sangat membantu dan mau dihubungi lewat WhatsApp untuk troubleshooting. Berkat layanan ini, pertukaran mahasiswa saya ke Malaysia berjalan lancar. Semoga ke depan sistemnya lebih stabil!',
    rating: 4,
    sentiment: 'mixed',
    date: '2023-09-15T09:20:00',
    timestamp: '3 jam yang lalu',
    helpfulCount: 5,
    isVerified: true,
    isFeatured: false,
    serviceId: '2',
    serviceName: 'Kerjasama',
    replies: [
      {
        id: '102',
        author: 'Bagas Nurjaman',
        content: 'Terima kasih Mbak Fadiyah atas feedbacknya. Alhamdulillah program pertukaran mahasiswanya berjalan lancar. Kami akan meningkatkan stabilitas sistem upload dokumen. Mohon kesediaannya untuk berbagi pengalaman di program pertukaran mahasiswa dalam forum yang akan kami adakan bulan depan untuk mahasiswa baru.',
        timestamp: '1 jam yang lalu',
        isAdmin: true
      }
    ]
  },
  {
    id: '5',
    name: 'Rizky Pratama',
    role: 'Mahasiswa Fakultas Ekonomi dan Bisnis Islam',
    content: 'Sebagai mahasiswa Perbankan Syariah semester 6, saya sangat terkesan dengan Layanan Keuangan UIN Antasari. Pembayaran UKT sangat fleksibel dengan berbagai metode pembayaran (transfer, QRIS, dan virtual account). Yang paling saya suka adalah fitur cicilan UKT yang sangat membantu keluarga kami. Transparansi biaya juga sangat jelas, semua rincian tersedia di dashboard. Terima kasih telah memudahkan proses pembayaran kuliah kami!',
    rating: 5,
    sentiment: 'positive',
    date: '2023-09-10T16:45:00',
    timestamp: '6 jam yang lalu',
    helpfulCount: 14,
    isVerified: true,
    isFeatured: false,
    serviceId: '11',
    serviceName: 'Layanan Keuangan',
    replies: []
  },
  {
    id: '6',
    name: 'Dr. Hj. Nurhayati Idris',
    role: 'Dosen Fakultas Syariah',
    content: 'Sebagai dosen yang sudah mengajar 15 tahun di UIN Antasari, saya melihat Layanan Kepegawaian sudah jauh lebih baik dari sebelumnya. Pengurusan kenaikan pangkat dan sertifikasi dosen sekarang lebih terstruktur. Namun, masih ada bug saat input nilai BKD (Beban Kerja Dosen) dalam jumlah besar. Saya harus menginput satu-persatu yang memakan waktu, padahal jadwal mengajar saya padat. Semoga bisa ditambahkan fitur batch input untuk semester depan.',
    rating: 3,
    sentiment: 'neutral',
    date: '2023-09-08T11:30:00',
    timestamp: '1 hari yang lalu',
    helpfulCount: 9,
    isVerified: true,
    isFeatured: false,
    serviceId: '1',
    serviceName: 'Kepegawaian',
    replies: []
  },
  {
    id: '7',
    name: 'Dedi Saputra',
    role: 'Mahasiswa Fakultas Dakwah dan Ilmu Komunikasi',
    content: 'Server UTIPD HANCUR TOTAL saat UAS online! Di tengah ujian Metodologi Penelitian, server tiba-tiba down dan saya tidak bisa submit jawaban tepat waktu. Ini mempengaruhi nilai akhir saya! Padahal saya sudah begadang mempersiapkan ujian ini. Kenapa selalu seperti ini setiap semester? Apa susahnya sih upgrade server? Tolong dong pikirkan nasib mahasiswa!',
    rating: 1,
    sentiment: 'negative',
    date: '2023-09-16T13:20:00',
    timestamp: '5 jam yang lalu',
    helpfulCount: 20,
    isVerified: false,
    isFeatured: false,
    serviceId: '6',
    serviceName: 'UTIPD',
    replies: [
      {
        id: '103',
        author: 'Riko Saputra',
        content: 'Mohon maaf atas ketidaknyamanannya. Kami sedang melakukan upgrade server untuk mengatasi lonjakan akses saat periode ujian. Untuk kasus spesifik Anda, silakan hubungi kami melalui helpdesk UTIPD dengan menyertakan NIM untuk pengecekan lebih lanjut mengenai hasil UAS Metodologi Penelitian.',
        timestamp: '2 jam yang lalu',
        isAdmin: true
      }
    ]
  },
  {
    id: '8',
    name: 'Muhammad Arif',
    role: 'Mahasiswa Fakultas Syariah',
    content: 'Koleksi buku Perpustakaan UIN Antasari untuk literatur Hukum Keluarga Islam sudah cukup lengkap, alhamdulillah sangat membantu saya menyusun makalah perbandingan hukum keluarga. Namun sistem pencarian katalog online-nya masih membingungkan, menu filter dan pencarian lanjutan tersembunyi di sudut yang tidak terlihat. Proses peminjaman online juga masih ribet dengan banyak langkah konfirmasi. Semoga bisa diperbaiki agar lebih user-friendly.',
    rating: 3,
    sentiment: 'mixed',
    date: '2023-09-12T10:15:00',
    timestamp: '1 hari yang lalu',
    helpfulCount: 7,
    isVerified: true,
    isFeatured: false,
    serviceId: '4',
    serviceName: 'Perpustakaan',
    replies: []
  },
  {
    id: '9',
    name: 'Nurul Hasanah',
    role: 'Calon Mahasiswa',
    content: 'Layanan PTSP UIN Antasari benar-benar menjadi penyelamat bagi saya yang baru lulus SMA dan bingung dengan proses pendaftaran kuliah! Informasinya sangat lengkap dan alur pendaftarannya jelas dengan diagram yang mudah dipahami. Staf PTSP juga sangat ramah saat saya datang untuk konsultasi beasiswa Bidikmisi. Mereka membimbing saya step by step dari pendaftaran hingga wawancara. InsyaAllah saya bisa kuliah di UIN Antasari berkat bantuan mereka!',
    rating: 5,
    sentiment: 'positive',
    date: '2023-09-14T14:50:00',
    timestamp: '8 jam yang lalu',
    helpfulCount: 10,
    isVerified: true,
    isFeatured: false,
    serviceId: '12',
    serviceName: 'PTSP',
    replies: []
  },
  {
    id: '10',
    name: 'Indah Lestari',
    role: 'Mahasiswa Fakultas Dakwah dan Ilmu Komunikasi',
    content: 'Layanan Keuangan UIN Antasari telah menghemat banyak waktu saya. Dulu harus antre berjam-jam di bank untuk bayar UKT, sekarang bisa transfer lewat m-banking kapan saja. Yang saya suka, ada riwayat pembayaran lengkap yang bisa jadi bukti kalau ada masalah. Saran saya, tolong tambahkan notifikasi WhatsApp saat ada tagihan baru dan deadline pembayaran, karena saya pernah hampir telat bayar praktikum karena tidak tahu ada tagihan.',
    rating: 4,
    sentiment: 'positive',
    date: '2023-09-05T09:30:00',
    timestamp: '2 hari yang lalu',
    helpfulCount: 6,
    isVerified: true,
    isFeatured: false,
    serviceId: '11',
    serviceName: 'Layanan Keuangan',
    replies: []
  },
  {
    id: '11',
    name: 'Prof. Dr. H. Jalaluddin, M.Ag',
    role: 'Guru Besar Fakultas Tarbiyah dan Keguruan',
    content: 'Di usia saya yang sudah 60 tahun, adaptasi dengan teknologi baru memang tantangan tersendiri. Namun, saya mengapresiasi Layanan Kepegawaian UIN Antasari yang memudahkan administrasi kepegawaian. Berkat sistem ini, pengurusan surat tugas, SK mengajar, dan laporan kinerja menjadi lebih efisien. Yang perlu ditingkatkan adalah pelatihan bagi dosen senior seperti saya yang kurang familiar dengan teknologi. Mungkin bisa diadakan workshop khusus dengan pendampingan intensif.',
    rating: 4,
    sentiment: 'positive',
    date: '2023-09-01T08:45:00',
    timestamp: '4 hari yang lalu',
    helpfulCount: 15,
    isVerified: true,
    isFeatured: false,
    serviceId: '1',
    serviceName: 'Kepegawaian',
    replies: [
      {
        id: '104',
        author: 'Rektor UIN Antasari',
        content: 'Terima kasih Prof. Jalaluddin atas masukannya. Kami sangat menghargai senior seperti Bapak yang bersedia terus belajar dan beradaptasi. Kami akan menjadwalkan pelatihan khusus teknologi untuk dosen senior dalam waktu dekat, dengan pendekatan yang lebih personal dan hands-on. Semoga pengalaman berharga Bapak dapat terus dibagikan kepada generasi penerus.',
        timestamp: '3 hari yang lalu',
        isAdmin: true
      }
    ]
  },
  {
    id: '12',
    name: 'Fitriani Rahma',
    role: 'Mahasiswa Fakultas Ushuluddin dan Humaniora',
    content: 'UTIPD sangat membantu proses belajar di jurusan Ilmu Al-Quran dan Tafsir. Saya suka fitur repository materi kuliah yang tersusun rapi per mata kuliah dan bisa diakses offline. Videonya juga ber-subtitle yang memudahkan pemahaman. Untuk perbaikan, tolong tambahkan fitur diskusi kelompok yang terintegrasi dengan Google Meet, jadi kita bisa kolaborasi untuk tugas kelompok Ulumul Quran yang sering diberikan dosen kami.',
    rating: 4,
    sentiment: 'positive',
    date: '2023-08-28T13:15:00',
    timestamp: '1 minggu yang lalu',
    helpfulCount: 8,
    isVerified: true,
    isFeatured: false,
    serviceId: '6',
    serviceName: 'UTIPD',
    replies: []
  },
  {
    id: '13',
    name: 'Dr. Fathul Jannah',
    role: 'Kepala Perpustakaan',
    content: 'Sebagai pengelola, saya ingin berbagi perkembangan Perpustakaan UIN Antasari yang membanggakan. Koleksi kita telah bertambah 30% tahun ini dengan fokus pada literatur Islam kontemporer dan referensi internasional. Sistem integrasi dengan 15 perpustakaan universitas Islam se-Indonesia juga sudah mulai berjalan. Tantangan kita saat ini adalah meningkatkan user experience dan kecepatan akses digital library. Kami mengundang mahasiswa untuk bergabung dalam focus group discussion bulan depan untuk pengembangan sistem.',
    rating: 4,
    sentiment: 'positive',
    date: '2023-08-25T09:30:00',
    timestamp: '1 minggu yang lalu',
    helpfulCount: 12,
    isVerified: true,
    isFeatured: false,
    serviceId: '4',
    serviceName: 'Perpustakaan',
    replies: []
  },
  {
    id: '14',
    name: 'Eka Wijaya',
    role: 'Mahasiswa Baru',
    content: 'Alhamdulillah, berkat Layanan PTSP UIN Antasari, proses registrasi mahasiswa baru saya jadi jauh lebih mudah! Petunjuknya jelas dengan infografis dan video tutorial. Saya bisa mengurus KTM, aktivasi email kampus, dan pendaftaran mata kuliah dalam satu tempat. Satu-satunya kendala adalah waktu tunggu konfirmasi pembayaran UKT yang agak lama (2 hari). Semoga bisa dipercepat di periode selanjutnya. Overall, sangat terbantu!',
    rating: 4,
    sentiment: 'mixed',
    date: '2023-08-20T15:45:00',
    timestamp: '2 minggu yang lalu',
    helpfulCount: 5,
    isVerified: true,
    isFeatured: false,
    serviceId: '12',
    serviceName: 'PTSP',
    replies: []
  },
  {
    id: '15',
    name: 'H. Mulyadi',
    role: 'Wali Mahasiswa',
    content: 'Saya orang tua berusia 50+ tahun yang gaptek, sangat kesulitan menggunakan Layanan Keuangan UIN Antasari untuk membayarkan kuliah anak. Semua serba digital dan rumit! Terlalu banyak langkah dan istilah yang tidak saya mengerti. Kenapa tidak bisa lebih sederhana? Harusnya ada opsi khusus untuk orang tua yang tidak biasa dengan teknologi. Untung ada bantuan dari tetangga yang mahasiswa juga di UIN.',
    rating: 2,
    sentiment: 'negative',
    date: '2023-08-18T10:20:00',
    timestamp: '2 minggu yang lalu',
    helpfulCount: 4,
    isVerified: false,
    isFeatured: false,
    serviceId: '11',
    serviceName: 'Layanan Keuangan',
    replies: [
      {
        id: '105',
        author: 'Endah Lestari',
        content: 'Terima kasih atas masukannya, Pak Mulyadi. Kami mengerti kesulitan yang dialami. Kami sedang mengembangkan versi WhatsApp Chatbot yang lebih sederhana khusus untuk wali mahasiswa. Sementara itu, Bapak bisa memanfaatkan layanan bantuan via telepon di 0511-3256940 atau datang langsung ke loket pembayaran di kampus yang tetap kami sediakan. Staf kami siap membantu.',
        timestamp: '2 minggu yang lalu',
        isAdmin: true
      }
    ]
  },
  {
    id: '16',
    name: 'Riko Saputra',
    role: 'Staff UTIPD UIN Antasari',
    content: 'Sebagai staf IT yang terlibat langsung dalam pengembangan sistem, saya ingin berbagi bahwa Layanan Kepegawaian UIN Antasari telah mengalami peningkatan signifikan. Backend database kini mampu mengelola 500+ dosen dan 300+ tenaga kependidikan dengan response time 3x lebih cepat. Kami menerapkan metode pengembangan agile berdasarkan feedback pengguna. Semester depan akan ada fitur baru: integrasi BKD dengan SISTER DIKTI, notifikasi WhatsApp untuk surat tugas, dan dashboard kinerja yang lebih interaktif.',
    rating: 5,
    sentiment: 'positive',
    date: '2023-08-15T09:10:00',
    timestamp: '2 minggu yang lalu',
    helpfulCount: 18,
    isVerified: true,
    isFeatured: false,
    serviceId: '1',
    serviceName: 'Kepegawaian',
    replies: []
  },
  {
    id: '17',
    name: 'Lina Marlina',
    role: 'Mahasiswa Fakultas Dakwah dan Ilmu Komunikasi',
    content: 'UTIPD adalah penyelamat kuliah saya! Sebagai mahasiswa KPI yang juga kerja part-time sebagai desainer grafis, saya sangat terbantu dengan fleksibilitas akses materi dan tugas. Saya suka fitur notifikasi deadline tugas yang terintegrasi dengan Google Calendar. Dosen-dosen Jurnalisme Online kami juga sangat responsif di forum diskusi. Ditambah lagi tersedia template PPT dan AE untuk tugas presentasi. Kualitas video tutorial editing juga bagus banget!',
    rating: 5,
    sentiment: 'positive',
    date: '2023-08-10T14:25:00',
    timestamp: '3 minggu yang lalu',
    helpfulCount: 9,
    isVerified: true,
    isFeatured: false,
    serviceId: '6',
    serviceName: 'UTIPD',
    replies: []
  },
  {
    id: '18',
    name: 'Anonymous',
    role: 'Mahasiswa',
    content: 'Perpustakaan Digital UIN Antasari PARAH! Saya butuh referensi segera untuk sidang proposal minggu depan, tapi sistemnya berantakan total! Search engine tidak akurat, keyword apapun yang saya masukkan selalu hasil yang tidak relevan. Coba cari buku tentang "Tafsir Kontemporer", malah muncul buku matematika?! Sudah 3 jam terbuang sia-sia. Dulu perpustakaan offline lebih baik, setidaknya bisa tanya petugas. Ini online tapi menghambat mahasiswa!',
    rating: 1,
    sentiment: 'negative',
    date: '2023-08-08T11:15:00',
    timestamp: '3 minggu yang lalu',
    helpfulCount: 15,
    isVerified: false,
    isFeatured: false,
    serviceId: '4',
    serviceName: 'Perpustakaan',
    replies: [
      {
        id: '106',
        author: 'Bagas Nurjaman',
        content: 'Mohon maaf atas ketidaknyamanannya. Kami sedang melakukan indeksasi ulang database buku yang memang memerlukan waktu. Untuk pencarian khusus referensi sidang proposal, silakan gunakan filter kategori atau hubungi kami via WhatsApp di 0812-5432-1098 dengan menyebutkan topik spesifik. Pustakawan kami akan membantu mencarikan dan mengirimkan list referensi yang relevan dalam waktu 24 jam.',
        timestamp: '3 minggu yang lalu',
        isAdmin: true
      }
    ]
  },
  {
    id: '19',
    name: 'Rukiah Anwar',
    role: 'Calon Mahasiswa',
    content: 'Layanan PTSP UIN Antasari adalah berkah bagi calon mahasiswa seperti saya yang berasal dari desa kecil di Kalimantan. Saya adalah anak pertama yang akan kuliah di keluarga, dan tidak ada yang paham prosedur pendaftaran. Website PTSP sangat informatif dengan video tutorial dan FAQ lengkap. Staf PTSP juga sabar sekali menjawab semua pertanyaan saya via email. Mereka bahkan membantu saya mengurus beasiswa LPDP yang alhamdulillah sekarang saya dapatkan!',
    rating: 5,
    sentiment: 'positive',
    date: '2023-08-05T08:30:00',
    timestamp: '1 bulan yang lalu',
    helpfulCount: 7,
    isVerified: true,
    isFeatured: false,
    serviceId: '12',
    serviceName: 'PTSP',
    replies: []
  },
  {
    id: '20',
    name: 'Farhan Hidayat',
    role: 'Mahasiswa Fakultas Dakwah dan Ilmu Komunikasi',
    content: 'Layanan Keuangan UIN Antasari bikin hidup mahasiswa seperti saya jauh lebih mudah! Saya termasuk mahasiswa yang dibiayai orang tua di kampung, dulu mereka harus transfer ke rekening saya lalu saya antre di bank untuk bayar UKT. Sekarang orang tua bisa bayar langsung via virtual account dari kampung. Detail biaya kuliah juga transparan, jadi orang tua tidak bingung. Suka banget dengan fitur cicilan UKT yang meringankan beban keluarga kami. Top markotop!',
    rating: 5,
    sentiment: 'positive',
    date: '2023-08-01T16:50:00',
    timestamp: '1 bulan yang lalu',
    helpfulCount: 11,
    isVerified: true,
    isFeatured: false,
    serviceId: '11',
    serviceName: 'Layanan Keuangan',
    replies: []
  }
];

// Mock statistics data
export const mockStats = {
  average: 3.85,
  total: 20,
  thisWeek: 7,
  changePercentage: 40,
  distribution: [
    { rating: 5, count: 8, percentage: 40 },
    { rating: 4, count: 5, percentage: 25 },
    { rating: 3, count: 3, percentage: 15 },
    { rating: 2, count: 2, percentage: 10 },
    { rating: 1, count: 2, percentage: 10 }
  ],
  sentimentDistribution: {
    positive: 11,
    neutral: 4,
    negative: 5
  }
};

// Mock trends data
export const mockTrends = [
  { date: '2023-09-17', count: 2, averageRating: 4.5 },
  { date: '2023-09-18', count: 1, averageRating: 3.0 },
  { date: '2023-09-19', count: 0, averageRating: 0 },
  { date: '2023-09-20', count: 1, averageRating: 5.0 },
  { date: '2023-09-21', count: 0, averageRating: 0 },
  { date: '2023-09-22', count: 0, averageRating: 0 },
  { date: '2023-09-23', count: 3, averageRating: 3.7 }
];

// Export mock data for use in the API service
export default {
  testimonials: mockTestimonials,
  services: mockServices,
  stats: mockStats,
  trends: mockTrends
}; 