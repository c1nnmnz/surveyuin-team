import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { scrollToNextQuestion as scrollToNextUtils } from '../utils/scrollUtils';

// Extract questions to be available for import
export const surveyQuestions = [
  {
    id: 'q1',
    text: 'Petugas di unit layanan ini memberikan pelayanan secara khusus (diskriminatif)?',
    options: [
      { value: '1', label: 'Selalu Ada', score: 1 },
      { value: '2', label: 'Sering Ada', score: 2 },
      { value: '3', label: 'Kadang-Kadang Ada', score: 3 },
      { value: '4', label: 'Jarang Ada', score: 4 },
      { value: '5', label: 'Hampir Tidak Pernah Ada', score: 5 },
      { value: '6', label: 'Tidak Ada Sama Sekali', score: 6 }
    ],
    category: 'corruption_perception'
  },
  {
    id: 'q2',
    text: 'Petugas di unit layanan ini membeda-bedakan pelayanan karena faktor suku, agama, kekerabatan almamater dan sejenisnya?',
    options: [
      { value: '1', label: 'Selalu Ada', score: 1 },
      { value: '2', label: 'Sering Ada', score: 2 },
      { value: '3', label: 'Kadang-Kadang Ada', score: 3 },
      { value: '4', label: 'Jarang Ada', score: 4 },
      { value: '5', label: 'Hampir Tidak Pernah Ada', score: 5 },
      { value: '6', label: 'Tidak Ada Sama Sekali', score: 6 }
    ],
    category: 'corruption_perception'
  },
  {
    id: 'q3',
    text: 'Petugas di unit layanan ini memberikan pelayanan yang tidak sesuai dengan ketentuan (Sehingga mengindikasikan kecurangan, seperti penyerobotan antrian, mempersingkat waktu tunggu layanan di luar prosedur, pengurangan syarat/prosedur, pengurangan denda, dll.)?',
    options: [
      { value: '1', label: 'Selalu Ada', score: 1 },
      { value: '2', label: 'Sering Ada', score: 2 },
      { value: '3', label: 'Kadang-Kadang Ada', score: 3 },
      { value: '4', label: 'Jarang Ada', score: 4 },
      { value: '5', label: 'Hampir Tidak Pernah Ada', score: 5 },
      { value: '6', label: 'Tidak Ada Sama Sekali', score: 6 }
    ],
    category: 'corruption_perception'
  },
  {
    id: 'q4',
    text: 'Petugas di unit layanan ini menerima/bahkan meminta imbalan uang untuk alasan administrasi, transport, rokok, kopi, dll di luar ketentuan?',
    options: [
      { value: '1', label: 'Selalu Ada', score: 1 },
      { value: '2', label: 'Sering Ada', score: 2 },
      { value: '3', label: 'Kadang-Kadang Ada', score: 3 },
      { value: '4', label: 'Jarang Ada', score: 4 },
      { value: '5', label: 'Hampir Tidak Pernah Ada', score: 5 },
      { value: '6', label: 'Tidak Ada Sama Sekali', score: 6 }
    ],
    category: 'corruption_perception'
  },
  {
    id: 'q5',
    text: 'Petugas di unit layanan ini menerima pemberian imbalan barang berupa makanan jadi, rokok, parcel, perhiasan, elektronik, pakaian, bahan pangan, dll di luar ketentuan?',
    options: [
      { value: '1', label: 'Selalu Ada', score: 1 },
      { value: '2', label: 'Sering Ada', score: 2 },
      { value: '3', label: 'Kadang-Kadang Ada', score: 3 },
      { value: '4', label: 'Jarang Ada', score: 4 },
      { value: '5', label: 'Hampir Tidak Pernah Ada', score: 5 },
      { value: '6', label: 'Tidak Ada Sama Sekali', score: 6 }
    ],
    category: 'corruption_perception'
  },
  {
    id: 'q6',
    text: 'Petugas di unit layanan ini menerima pemberian imbalan fasilitas berupa akomodasi (hotel, resort perjalanan/jasa transport, komunikasi, hiburan, voucher belanja, dll) di luar ketentuan?',
    options: [
      { value: '1', label: 'Selalu Ada', score: 1 },
      { value: '2', label: 'Sering Ada', score: 2 },
      { value: '3', label: 'Kadang-Kadang Ada', score: 3 },
      { value: '4', label: 'Jarang Ada', score: 4 },
      { value: '5', label: 'Hampir Tidak Pernah Ada', score: 5 },
      { value: '6', label: 'Tidak Ada Sama Sekali', score: 6 }
    ],
    category: 'corruption_perception'
  },
  {
    id: 'q7',
    text: 'Petugas di unit layanan ini melakukan pungli, yaitu permintaan pembayaran atas pelayanan yang diterima pengguna layanan di luar tarif resmi (pungli bisa dikamuflasekan melalui istilah seperti "uang administrasi", uang rokok", "uang terima kasih, dsb)?',
    options: [
      { value: '1', label: 'Selalu Ada', score: 1 },
      { value: '2', label: 'Sering Ada', score: 2 },
      { value: '3', label: 'Kadang-Kadang Ada', score: 3 },
      { value: '4', label: 'Jarang Ada', score: 4 },
      { value: '5', label: 'Hampir Tidak Pernah Ada', score: 5 },
      { value: '6', label: 'Tidak Ada Sama Sekali', score: 6 }
    ],
    category: 'corruption_perception'
  },
  {
    id: 'q8',
    text: 'Petugas di unit layanan ini melakukan praktik percaloan (pihak yang melakukan percaloan berasal dari oknum pegawai pada unit layanan ini maupun pihak luar yang memiliki hubungan/atau tidak memiliki hubungan dengan oknum pegawai)?',
    options: [
      { value: '1', label: 'Selalu Ada', score: 1 },
      { value: '2', label: 'Sering Ada', score: 2 },
      { value: '3', label: 'Kadang-Kadang Ada', score: 3 },
      { value: '4', label: 'Jarang Ada', score: 4 },
      { value: '5', label: 'Hampir Tidak Pernah Ada', score: 5 },
      { value: '6', label: 'Tidak Ada Sama Sekali', score: 6 }
    ],
    category: 'corruption_perception'
  },
  // Service Quality Survey (SPKP) questions start here
  {
    id: 'q9',
    text: 'Sistem informasi pelayanan di unit ini selalu tersedia',
    options: [
      { value: '1', label: 'Tidak Tersedia', score: 1 },
      { value: '2', label: 'Hampir Tidak Tersedia', score: 2 },
      { value: '3', label: 'Jarang Tersedia', score: 3 },
      { value: '4', label: 'Kadang-Kadang Tersedia', score: 4 },
      { value: '5', label: 'Sering Tersedia', score: 5 },
      { value: '6', label: 'Selalu Tersedia', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'reliability'
  },
  {
    id: 'q10',
    text: 'Sistem informasi pelayanan di unit ini dapat menjawab kebutuhan pengguna layanan?',
    options: [
      { value: '1', label: 'Tidak Dapat Menjawab Kebutuhan Pengguna', score: 1 },
      { value: '2', label: 'Kurang Dapat Menjawab Kebutuhan Pengguna', score: 2 },
      { value: '3', label: 'Cukup Tidak Dapat Menjawab Kebutuhan Pengguna', score: 3 },
      { value: '4', label: 'Cukup Dapat Menjawab Kebutuhan Pengguna', score: 4 },
      { value: '5', label: 'Dapat Menjawab Kebutuhan Pengguna', score: 5 },
      { value: '6', label: 'Sangat Dapat Menjawab Kebutuhan Pengguna', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'reliability'
  },
  {
    id: 'q11',
    text: 'Sistem informasi pelayanan di unit ini mudah digunakan?',
    options: [
      { value: '1', label: 'Sangat Sulit Digunakan', score: 1 },
      { value: '2', label: 'Sulit Digunakan', score: 2 },
      { value: '3', label: 'Kurang Mudah Digunakan', score: 3 },
      { value: '4', label: 'Cukup Mudah Digunakan', score: 4 },
      { value: '5', label: 'Mudah Digunakan', score: 5 },
      { value: '6', label: 'Sangat Mudah Digunakan', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'reliability'
  },
  {
    id: 'q12',
    text: 'Sistem informasi pelayanan di unit ini memiliki fasilitas interaktif dan FAQ?',
    options: [
      { value: '1', label: 'Tidak Memiliki Fasilitas Interaktif dan FAQ', score: 1 },
      { value: '2', label: 'Fasilitas FAQ Terbatas, Tidak Interaktif', score: 2 },
      { value: '3', label: 'Fasilitas FAQ Lengkap, Tidak Interaktif', score: 3 },
      { value: '4', label: 'Fasilitas Interaktif Dasar, FAQ Terbatas', score: 4 },
      { value: '5', label: 'Fasilitas Interaktif dan FAQ Lengkap, Kurang Responsif', score: 5 },
      { value: '6', label: 'Memiliki Fasilitas Interaktif dan FAQ', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'reliability'
  },
  {
    id: 'q13',
    text: 'Informasi persyaratan di unit ini dapat dipahami dengan jelas?',
    options: [
      { value: '1', label: 'Tidak Dapat Dipahami dengan Jelas', score: 1 },
      { value: '2', label: 'Kurang Dapat Dipahami dengan Jelas', score: 2 },
      { value: '3', label: 'Cukup Tidak Dapat Dipahami dengan Jelas', score: 3 },
      { value: '4', label: 'Cukup Dapat Dipahami dengan Jelas', score: 4 },
      { value: '5', label: 'Dapat Dipahami dengan Jelas', score: 5 },
      { value: '6', label: 'Sangat Dapat Dipahami dengan Jelas', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'assurance'
  },
  {
    id: 'q14',
    text: 'Informasi persyaratan di unit ini sesuai untuk mendapatkan produk/jenis pelayanan?',
    options: [
      { value: '1', label: 'Sangat Tidak Sesuai Persyaratan', score: 1 },
      { value: '2', label: 'Tidak Sesuai Persyaratan', score: 2 },
      { value: '3', label: 'Kurang Sesuai Persyaratan', score: 3 },
      { value: '4', label: 'Cukup Sesuai Persyaratan', score: 4 },
      { value: '5', label: 'Sesuai Persyaratan', score: 5 },
      { value: '6', label: 'Sangat Sesuai Persyaratan', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'assurance'
  },
  {
    id: 'q15',
    text: 'Penerapan persyaratan pelayanan di unit ini sesuai dengan yang diinformasikan?',
    options: [
      { value: '1', label: 'Tidak Sesuai dengan yang Diinformasikan', score: 1 },
      { value: '2', label: 'Kurang Sesuai dengan yang Diinformasikan', score: 2 },
      { value: '3', label: 'Cukup Tidak Sesuai dengan yang Diinformasikan', score: 3 },
      { value: '4', label: 'Cukup Sesuai dengan yang Diinformasikan', score: 4 },
      { value: '5', label: 'Sesuai dengan yang Diinformasikan', score: 5 },
      { value: '6', label: 'Sangat Sesuai dengan yang Diinformasikan', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'empathy'
  },
  {
    id: 'q16',
    text: 'Informasi prosedur/alur layanan di unit ini dapat dipahami dengan jelas?',
    options: [
      { value: '1', label: 'Sangat Tidak Dapat Dipahami', score: 1 },
      { value: '2', label: 'Tidak Dapat Dipahami', score: 2 },
      { value: '3', label: 'Cukup Tidak Dapat Dipahami', score: 3 },
      { value: '4', label: 'Cukup Dapat Dipahami', score: 4 },
      { value: '5', label: 'Dapat Dipahami', score: 5 },
      { value: '6', label: 'Sangat Dapat Dipahami', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'assurance'
  },
  {
    id: 'q17',
    text: 'Informasi prosedur/alur layanan di unit ini sesuai untuk mendapatkan produk/jenis pelayanan?',
    options: [
      { value: '1', label: 'Sangat Tidak Sesuai Prosedur/Alur', score: 1 },
      { value: '2', label: 'Tidak Sesuai Prosedur/Alur', score: 2 },
      { value: '3', label: 'Kurang Sesuai Prosedur/Alur', score: 3 },
      { value: '4', label: 'Cukup Sesuai Prosedur/Alur', score: 4 },
      { value: '5', label: 'Sesuai Prosedur/Alur', score: 5 },
      { value: '6', label: 'Sangat Sesuai Prosedur/Alur', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'assurance'
  },
  {
    id: 'q18',
    text: 'Penerapan prosedur/alur pelayanan di unit ini sesuai dengan yang diinformasikan?',
    options: [
      { value: '1', label: 'Sangat Tidak Sesuai dengan yang Diinformasikan', score: 1 },
      { value: '2', label: 'Tidak Sesuai dengan yang Diinformasikan', score: 2 },
      { value: '3', label: 'Kurang Sesuai dengan yang Diinformasikan', score: 3 },
      { value: '4', label: 'Cukup Sesuai dengan yang Diinformasikan', score: 4 },
      { value: '5', label: 'Sesuai dengan yang Diinformasikan', score: 5 },
      { value: '6', label: 'Sangat Sesuai dengan yang Diinformasikan', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'empathy'
  },
  {
    id: 'q19',
    text: 'Informasi jangka waktu penyelesaian pelayanan di unit ini dapat dipahami dengan jelas?',
    options: [
      { value: '1', label: 'Sangat Tidak Dapat Dipahami dengan Jelas', score: 1 },
      { value: '2', label: 'Tidak Dapat Dipahami dengan Jelas', score: 2 },
      { value: '3', label: 'Kurang Dapat Dipahami dengan Jelas', score: 3 },
      { value: '4', label: 'Cukup Dapat Dipahami dengan Jelas', score: 4 },
      { value: '5', label: 'Dapat Dipahami dengan Jelas', score: 5 },
      { value: '6', label: 'Sangat Dapat Dipahami dengan Jelas', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'assurance'
  },
  {
    id: 'q20',
    text: 'Jangka waktu penyelesaian pelayanan di unit ini?',
    options: [
      { value: '1', label: 'Sangat Tidak Wajar', score: 1 },
      { value: '2', label: 'Tidak Wajar', score: 2 },
      { value: '3', label: 'Cukup Tidak Wajar', score: 3 },
      { value: '4', label: 'Cukup Wajar', score: 4 },
      { value: '5', label: 'Wajar', score: 5 },
      { value: '6', label: 'Sangat Wajar', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'reliability'
  },
  {
    id: 'q21',
    text: 'Jangka waktu penyelesaian pelayanan di unit ini sesuai dengan yang diinformasikan?',
    options: [
      { value: '1', label: 'Sangat Tidak Sesuai dengan yang Diinformasikan', score: 1 },
      { value: '2', label: 'Tidak Sesuai dengan yang Diinformasikan', score: 2 },
      { value: '3', label: 'Cukup Tidak Sesuai dengan yang Diinformasikan', score: 3 },
      { value: '4', label: 'Cukup Sesuai dengan yang Diinformasikan', score: 4 },
      { value: '5', label: 'Sesuai dengan yang Diinformasikan', score: 5 },
      { value: '6', label: 'Sangat Sesuai dengan yang Diinformasikan', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'reliability'
  },
  {
    id: 'q22',
    text: 'Informasi biaya pelayanan di unit ini dapat dipahami dengan jelas?',
    options: [
      { value: '1', label: 'Sangat Tidak Dapat Dipahami dengan Jelas', score: 1 },
      { value: '2', label: 'Tidak Dapat Dipahami dengan Jelas', score: 2 },
      { value: '3', label: 'Kurang Dapat Dipahami dengan Jelas', score: 3 },
      { value: '4', label: 'Cukup Dapat Dipahami dengan Jelas', score: 4 },
      { value: '5', label: 'Dapat Dipahami dengan Jelas', score: 5 },
      { value: '6', label: 'Sangat Dapat Dipahami dengan Jelas', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'assurance'
  },
  {
    id: 'q23',
    text: 'Biaya pelayanan yang dibayarkan di unit ini sesuai dengan yang diinformasikan (termasuk apabila biaya pelayanan diinformasikan gratis memang benar-benar tidak dilakukan pembayaran)?',
    options: [
      { value: '1', label: 'Sangat tidak sesuai dengan yang diinformasikan', score: 1 },
      { value: '2', label: 'Tidak sesuai dengan yang diinformasikan', score: 2 },
      { value: '3', label: 'Agak tidak sesuai dengan yang diinformasikan', score: 3 },
      { value: '4', label: 'Cukup sesuai dengan yang diinformasikan', score: 4 },
      { value: '5', label: 'Sesuai dengan yang diinformasikan', score: 5 },
      { value: '6', label: 'Sangat sesuai dengan yang diinformasikan', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'reliability'
  },
  {
    id: 'q24',
    text: 'Sarana prasarana pendukung pelayanan/sistem pelayanan online di unit ini sudah mempermudah proses pelayanan?',
    options: [
      { value: '1', label: 'Sangat mempersulit', score: 1 },
      { value: '2', label: 'Mempersulit', score: 2 },
      { value: '3', label: 'Agak mempersulit', score: 3 },
      { value: '4', label: 'Cukup mempermudah', score: 4 },
      { value: '5', label: 'Mempermudah', score: 5 },
      { value: '6', label: 'Sangat mempermudah', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'tangible'
  },
  {
    id: 'q25',
    text: 'Sarana prasarana pendukung pelayanan/sistem pelayanan online di unit ini sudah meringkas waktu?',
    options: [
      { value: '1', label: 'Sangat Menghabiskan Waktu', score: 1 },
      { value: '2', label: 'Menghabiskan Waktu', score: 2 },
      { value: '3', label: 'Kurang Efisien dalam Waktu', score: 3 },
      { value: '4', label: 'Cukup Efisien dalam Waktu', score: 4 },
      { value: '5', label: 'Efisien dalam Waktu', score: 5 },
      { value: '6', label: 'Sangat Meringkas Waktu', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'tangible'
  },
  {
    id: 'q26',
    text: 'Sarana prasarana pendukung pelayanan/sistem pelayanan online di unit ini sudah hemat biaya?',
    options: [
      { value: '1', label: 'Sangat Boros', score: 1 },
      { value: '2', label: 'Boros', score: 2 },
      { value: '3', label: 'Agak Boros', score: 3 },
      { value: '4', label: 'Cukup Hemat Biaya', score: 4 },
      { value: '5', label: 'Hemat Biaya', score: 5 },
      { value: '6', label: 'Sangat Hemat Biaya', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'tangible'
  },
  {
    id: 'q27',
    text: 'Petugas di unit ini mampu memberikan respon pelayanan dengan cepat kepada pengguna layanan baik melalui tatap muka langsung, maupun melalui aplikasi layanan daring?',
    options: [
      { value: '1', label: 'Sangat Lambat', score: 1 },
      { value: '2', label: 'Lambat', score: 2 },
      { value: '3', label: 'Agak Lambat', score: 3 },
      { value: '4', label: 'Cukup Cepat', score: 4 },
      { value: '5', label: 'Cepat', score: 5 },
      { value: '6', label: 'Sangat Cepat', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'responsiveness'
  },
  {
    id: 'q28',
    text: 'Petugas di unit ini mudah dikenal (memakai seragam, tanda pengenal, dll)?',
    options: [
      { value: '1', label: 'Sangat sulit dikenali', score: 1 },
      { value: '2', label: 'Sulit Dikenali', score: 2 },
      { value: '3', label: 'Agak Sulit Dikenali', score: 3 },
      { value: '4', label: 'Agak Mudah DIkenali', score: 4 },
      { value: '5', label: 'Mudah Dikenali', score: 5 },
      { value: '6', label: 'Sangat Mudah Dikenali', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'tangible'
  },
  {
    id: 'q29',
    text: 'Petugas di unit ini melayani dengan ramah (senyum, salam, sapa, sopan dan santun)?',
    options: [
      { value: '1', label: 'Sangat Tidak Ramah', score: 1 },
      { value: '2', label: 'Tidak Ramah', score: 2 },
      { value: '3', label: 'Agak Tidak Ramah', score: 3 },
      { value: '4', label: 'Cukup Ramah', score: 4 },
      { value: '5', label: 'Ramah', score: 5 },
      { value: '6', label: 'Sangat Ramah', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'empathy'
  },
  {
    id: 'q30',
    text: 'Di unit ini Layanan konsultasi dan pengaduan beragam (tempat konsultasi dan pengaduan/hotline/callcenter/media online)?',
    options: [
      { value: '1', label: 'Sangat Tidak Beragam', score: 1 },
      { value: '2', label: 'Tidak Beragam', score: 2 },
      { value: '3', label: 'Kurang Beragam', score: 3 },
      { value: '4', label: 'Cukup Beragam', score: 4 },
      { value: '5', label: 'Beragam', score: 5 },
      { value: '6', label: 'Sangat Beragam', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'responsiveness'
  },
  {
    id: 'q31',
    text: 'Di unit ini prosedur untuk melakukan konsultasi dan pengaduan mudah?',
    options: [
      { value: '1', label: 'Sangat Tidak Mudah', score: 1 },
      { value: '2', label: 'Tidak Mudah', score: 2 },
      { value: '3', label: 'Kurang Mudah', score: 3 },
      { value: '4', label: 'Cukup Mudah', score: 4 },
      { value: '5', label: 'Mudah', score: 5 },
      { value: '6', label: 'Sangat Mudah', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'responsiveness'
  },
  {
    id: 'q32',
    text: 'Di unit ini respons konsultasi dan pengaduan cepat?',
    options: [
      { value: '1', label: 'Sangat Tidak Cepat', score: 1 },
      { value: '2', label: 'Tidak Cepat', score: 2 },
      { value: '3', label: 'Kurang Cepat', score: 3 },
      { value: '4', label: 'Cukup Cepat', score: 4 },
      { value: '5', label: 'Cepat', score: 5 },
      { value: '6', label: 'Sangat Cepat', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'responsiveness'
  },
  {
    id: 'q33',
    text: 'Di unit ini tindak lanjut proses penanganan konsultasi dan pengaduan jelas?',
    options: [
      { value: '1', label: 'Sangat Tidak Jelas', score: 1 },
      { value: '2', label: 'Tidak Jelas', score: 2 },
      { value: '3', label: 'Kurang Jelas', score: 3 },
      { value: '4', label: 'Cukup Jelas', score: 4 },
      { value: '5', label: 'Jelas', score: 5 },
      { value: '6', label: 'Sangat Jelas', score: 6 }
    ],
    category: 'service_quality',
    dimension: 'responsiveness'
  },
  {
    id: 'q34',
    text: 'Apakah dalam mengisi Survei Zona Integritas untuk unit ini anda dalam kondisi terpaksa atau dipaksa oleh orang lain?',
    options: [
      { value: 'yes', label: 'Ya 😟', score: 0 },
      { value: 'no', label: 'Tidak 😊', score: 0 }
    ],
    category: 'survey_integrity'
  }
];

// Enhanced Badge component
const QuestionBadge = ({ number }) => (
  <motion.div 
    className="relative flex-shrink-0"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    {/* Outer glow effect */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-30 blur-md transform scale-110"></div>
    
    {/* Shadow for 3D effect */}
    <div className="absolute inset-0 rounded-full bg-teal-600/30 transform translate-y-1 blur-sm"></div>
    
    {/* Main badge */}
    <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full text-white font-bold shadow-lg">
      {/* Reflection highlight */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-white/30 rounded-full transform -translate-y-1/4"></div>
      
      {/* Bottom shadow */}
      <div className="absolute bottom-1 left-1/4 w-1/2 h-1/6 bg-black/10 rounded-full"></div>
      
      <span className="text-xl transform -translate-y-px">{number}</span>
    </div>
  </motion.div>
);

// Score Badge component
const ScoreBadge = ({ score, isSelected }) => (
  <motion.div 
    className={`px-3 py-1.5 rounded-full flex items-center justify-center ${
      isSelected 
        ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white font-medium shadow-md' 
        : 'bg-gray-100 text-gray-700'
    }`}
    whileHover={{ y: -3, scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <span className="text-xs font-medium">Skor {score}</span>
  </motion.div>
);

// Main component for a single survey question
const SurveyQuestion = ({
  questionNumber,
  questionText,
  options,
  selectedOption,
  onSelectOption,
  isRequired = true,
  error = false,
  theme = 'teal', // Default theme is teal, alternatives are blue and purple
}) => {
  const isBlueTheme = theme === 'blue';
  const isPurpleTheme = theme === 'purple';
  
  // Define theme-based classes
  const headerGradient = isPurpleTheme
    ? "bg-gradient-to-r from-purple-50 to-pink-50"
    : isBlueTheme 
      ? "bg-gradient-to-r from-blue-50 to-indigo-50" 
      : "bg-gradient-to-r from-blue-50 to-green-50";
    
  const badgeGradient = isPurpleTheme
    ? "from-purple-400 to-pink-500"
    : isBlueTheme
      ? "from-blue-400 to-indigo-500"
      : "from-green-400 to-teal-500";
    
  const selectedBg = isPurpleTheme
    ? "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
    : isBlueTheme
      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
      : "bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200";
    
  const selectedBorder = isPurpleTheme
    ? "border-purple-500"
    : isBlueTheme 
      ? "border-blue-500" 
      : "border-teal-500";
  
  const selectedDot = isPurpleTheme
    ? "bg-purple-500"
    : isBlueTheme 
      ? "bg-blue-500" 
      : "bg-teal-500";
      
  const checkColor = isPurpleTheme
    ? "text-purple-500"
    : isBlueTheme
      ? "text-indigo-500"
      : "text-teal-500";
      
  const badgeShadow = isPurpleTheme
    ? "bg-purple-600/30"
    : isBlueTheme
      ? "bg-indigo-600/30"
      : "bg-teal-600/30";
  
  const boxShadowHover = isPurpleTheme
    ? "0 4px 20px rgba(168, 85, 247, 0.15)"
    : isBlueTheme 
      ? "0 4px 20px rgba(79, 70, 229, 0.15)" 
      : "0 4px 20px rgba(20, 184, 166, 0.15)";
      
  const borderHover = isPurpleTheme
    ? "border-2 border-purple-400/50 shadow-xl shadow-purple-100"
    : isBlueTheme 
      ? "border-2 border-indigo-400/50 shadow-xl shadow-indigo-100" 
      : "border-2 border-teal-400/50 shadow-xl shadow-teal-100";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: selectedOption 
          ? "0 2px 8px rgba(0, 0, 0, 0.08)"
          : "0 1px 3px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl overflow-hidden bg-white ${
        selectedOption 
          ? "border border-gray-200 shadow-md"
          : "border border-gray-100 shadow-sm"
      }`}
    >
      <div 
        className={`${headerGradient} p-6 relative overflow-hidden`}
      >
        {/* Design elements */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 ${
          isPurpleTheme ? "bg-purple-100" : isBlueTheme ? "bg-indigo-100" : "bg-teal-100"
        } rounded-full opacity-40`}></div>
        <div className={`absolute -bottom-8 -left-8 w-24 h-24 ${
          isPurpleTheme ? "bg-pink-100" : isBlueTheme ? "bg-blue-100" : "bg-blue-100"
        } rounded-full opacity-30`}></div>
        
        <div className="flex items-start gap-5 relative z-10">
          {/* Use a themed badge */}
          <motion.div 
            className="relative flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {/* Outer glow effect */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${
              isPurpleTheme ? "from-purple-400 to-pink-500" : 
              isBlueTheme ? "from-blue-400 to-indigo-500" : 
              "from-teal-400 to-blue-500"
            } opacity-30 blur-md transform scale-110`}></div>
            
            {/* Shadow for 3D effect */}
            <div className={`absolute inset-0 rounded-full ${badgeShadow} transform translate-y-1 blur-sm`}></div>
            
            {/* Main badge */}
            <div className={`relative flex items-center justify-center w-12 h-12 bg-gradient-to-br ${badgeGradient} rounded-full text-white font-bold shadow-lg`}>
              {/* Reflection highlight */}
              <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-white/30 rounded-full transform -translate-y-1/4"></div>
              
              {/* Bottom shadow */}
              <div className="absolute bottom-1 left-1/4 w-1/2 h-1/6 bg-black/10 rounded-full"></div>
              
              <span className="text-xl transform -translate-y-px">{questionNumber}</span>
            </div>
          </motion.div>
          
          <h2 className="text-lg md:text-xl font-medium text-gray-800 pt-2.5">
            {questionText}
          </h2>
        </div>
        
        {selectedOption && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-4 right-4 ${checkColor}`}
          >
            <CheckCircle className="w-6 h-6" />
          </motion.div>
        )}
      </div>
      
      <div className="space-y-3 p-4 bg-white">
        {options.map((option) => {
          const isSelected = selectedOption === option.value || selectedOption === option.label;
          
          return (
            <motion.label 
              key={option.value || option.label}
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                isSelected 
                  ? selectedBg
                  : "bg-gray-50 border border-gray-100 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                  isSelected 
                    ? `border-2 ${selectedBorder} bg-white`
                    : "border border-gray-300 bg-white"
                }`}>
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`h-2.5 w-2.5 ${selectedDot} rounded-full`}
                    />
                  )}
                </div>
                <span className={`ml-3 ${isSelected ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                  {option.label}
                </span>
              </div>
              
              {/* Themed score badge - only show if score is not 0 */}
              {option.score !== 0 && (
                <motion.div 
                  className={`px-3 py-1.5 rounded-full flex items-center justify-center ${
                    isSelected 
                      ? isPurpleTheme
                        ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium shadow-md"
                        : isBlueTheme
                          ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-medium shadow-md"
                          : "bg-gradient-to-r from-teal-400 to-blue-500 text-white font-medium shadow-md"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-xs font-medium">Skor {option.score}</span>
                </motion.div>
              )}
              
              <input 
                type="radio"
                value={option.value || option.label}
                checked={isSelected}
                onChange={() => onSelectOption(option.value || option.label)}
                className="sr-only"
              />
            </motion.label>
          );
        })}
        
        {isRequired && error && (
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-red-600 px-3 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            Pertanyaan ini wajib diisi
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

// Create a component to render all questions
export const SurveyQuestionList = ({ 
  watchedValues, 
  onSelectOption, 
  errors,
  register
}) => {
  // Add refs for each question to enable scrolling
  const questionRefs = useRef({});
  const [lastAnsweredQuestion, setLastAnsweredQuestion] = useState(null);
  const [highlightedQuestion, setHighlightedQuestion] = useState(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Group questions by category
  const corruptionQuestions = surveyQuestions.filter(q => q.category === 'corruption_perception');
  const serviceQualityQuestions = surveyQuestions.filter(q => q.category === 'service_quality');
  const integrityQuestions = surveyQuestions.filter(q => q.category === 'survey_integrity');
  
  // Get all questions in order
  const allQuestions = [
    ...corruptionQuestions,
    ...serviceQualityQuestions,
    ...integrityQuestions
  ];
  
  // Function to find the next question (answered or not)
  const findNextQuestion = (currentQuestionId) => {
    // Find the index of the current question
    const currentIndex = allQuestions.findIndex(q => q.id === currentQuestionId);
    
    // If found and not the last question, return the next question
    if (currentIndex !== -1 && currentIndex < allQuestions.length - 1) {
      return allQuestions[currentIndex + 1].id;
    }
    
    // If it's the last question or not found, return null
    return null;
  };
  
  // Enhanced onSelectOption function that also triggers scrolling
  const handleSelectOption = (questionId, value) => {
    // First call the original onSelectOption
    onSelectOption(questionId, value);
    
    // Update last answered question
    setLastAnsweredQuestion(questionId);
    
    // Then scroll to the next question immediately without delay
    // to make the scrolling experience faster
    setTimeout(() => {
      scrollToNextUtils(questionId, allQuestions, questionRefs.current, setHighlightedQuestion);
    }, 0);
  };
  
  // CSS for pulse animation (remove or reduce the intensity)
  const pulseClass = "border-2 border-gray-200 shadow-md";

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-5xl mx-auto" // Increased max-width here
    >
      <style>
        {`
          @keyframes pulse-highlight {
            0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
            50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0); }
          }
          .animate-pulse-highlight {
            animation: pulse-highlight 0.8s ease-in-out;
          }
        `}
      </style>

      {/* Group questions by sections */}
      <div className="space-y-10">
        {/* Section: Corruption Perception */}
        <div className="space-y-8">
          {corruptionQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              variants={itemVariants}
              className={`relative ${highlightedQuestion === question.id ? pulseClass : ''}`}
              ref={el => questionRefs.current[question.id] = el}
              id={`question-${question.id}`}
            >
              {/* Connection line between questions */}
              {index < corruptionQuestions.length - 1 && (
                <div className="absolute left-6 top-full w-0.5 h-8 bg-gradient-to-b from-teal-300 to-transparent z-0"></div>
              )}
              
              <SurveyQuestion
                questionNumber={index + 1}
                questionText={question.text}
                options={question.options}
                selectedOption={watchedValues ? watchedValues(question.id) : null}
                onSelectOption={(value) => handleSelectOption(question.id, value)}
                isRequired={true}
                error={errors && errors[question.id]}
              />
              {register && (
                <input 
                  type="hidden" 
                  id={question.id}
                  name={question.id}
                  {...register(question.id, { required: true })}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Section: Service Quality */}
        {serviceQualityQuestions.length > 0 && (
          <div className="space-y-8">
            <motion.div 
              variants={itemVariants}
              className="py-4 mb-4"
              id="service-quality-section"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Kualitas Pelayanan
              </h2>
              <p className="text-gray-600 text-center">
                Pertanyaan berikut terkait dengan kualitas pelayanan yang Anda terima
              </p>
            </motion.div>
            
            {serviceQualityQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                variants={itemVariants}
                className={`relative ${highlightedQuestion === question.id ? pulseClass : ''}`}
                ref={el => questionRefs.current[question.id] = el}
                id={`question-${question.id}`}
              >
                {/* Connection line between questions */}
                {index < serviceQualityQuestions.length - 1 && (
                  <div className="absolute left-6 top-full w-0.5 h-8 bg-gradient-to-b from-blue-300 to-transparent z-0"></div>
                )}
                
                <SurveyQuestion
                  questionNumber={corruptionQuestions.length + index + 1}
                  questionText={question.text}
                  options={question.options}
                  selectedOption={watchedValues ? watchedValues(question.id) : null}
                  onSelectOption={(value) => handleSelectOption(question.id, value)}
                  isRequired={true}
                  error={errors && errors[question.id]}
                  theme="blue" // Add theme for different styling
                />
                {register && (
                  <input 
                    type="hidden" 
                    id={question.id}
                    name={question.id}
                    {...register(question.id, { required: true })}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Section: Integrity */}
        {integrityQuestions.length > 0 && (
          <div className="space-y-8">
            <motion.div 
              variants={itemVariants}
              className="py-4 mb-4"
              id="integrity-section"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Integritas Layanan
              </h2>
              <p className="text-gray-600 text-center">
                Kami memerlukan pendapat Anda mengenai integritas layanan
              </p>
            </motion.div>
            
            {integrityQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                variants={itemVariants}
                className={`relative ${highlightedQuestion === question.id ? pulseClass : ''}`}
                ref={el => questionRefs.current[question.id] = el}
                id={`question-${question.id}`}
              >
                <SurveyQuestion
                  questionNumber={corruptionQuestions.length + serviceQualityQuestions.length + index + 1}
                  questionText={question.text}
                  options={question.options}
                  selectedOption={watchedValues ? watchedValues(question.id) : null}
                  onSelectOption={(value) => handleSelectOption(question.id, value)}
                  isRequired={true}
                  error={errors && errors[question.id]}
                  theme="purple" // Add theme for different styling
                />
                {register && (
                  <input 
                    type="hidden" 
                    id={question.id}
                    name={question.id}
                    {...register(question.id, { required: true })}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SurveyQuestion; 