'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '../../components/Navbar';
import { AntiTathayyurBanner } from '../../components/AntiTathayyurBanner';
import {
  BookOpen,
  ShieldCheck,
  Bookmark,
  Compass,
  ScrollText,
  Search,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface GlossaryEntry {
  readonly id: string;
  readonly term: string;
  readonly category: 'fiqh' | 'adat' | 'falak' | 'fatwa';
  readonly scriptText?: string;
  readonly scriptType?: 'arabic' | 'javanese';
  readonly citation?: string;
  readonly summary: string;
  readonly explanation: string;
  readonly practicalAdvice?: string;
}

const GLOSSARY_DATA: readonly GlossaryEntry[] = [
  // FIQH & TAUHID
  {
    id: 'tathayyur',
    term: 'Tathayyur / Thiyarah (Larangan Anggapan Sial)',
    category: 'fiqh',
    scriptText: 'التَّطَيُّرُ / الشِّرْكُ',
    scriptType: 'arabic',
    citation: 'HR. Bukhari no. 5757; HR. Muslim no. 2220; HR. Tirmidzi no. 1614',
    summary: 'Keyakinan bahwa hari, tanggal, bulan, atau tanda alam tertentu membawa kesialan atau nasib buruk bawaan.',
    explanation: 'Dalam akidah Islam, tathayyur dihukumi sebagai syirik asghar yang dapat merusak kemurnian tauhid. Rasulullah ﷺ bersabda: "Thiyarah itu syirik, thiyarah itu syirik" (HR. Abu Dawud no. 3910). Seluruh hari diciptakan mulia dan baik oleh Allah ﷻ, dan tidak ada satu pun hari yang memiliki daya mudarat mandiri.',
    practicalAdvice: 'Jika terlintas rasa was-was saat berhadapan dengan tanggal pantangan adat, ucapkan doa penawar thiyarah: "Allahumma la ya\'ti bil hasanati illa Anta, wa la yadfa\'us sayyi\'ati illa Anta, wa la hawla wa la quwwata illa bika".',
  },
  {
    id: 'rukun-nikah',
    term: '5 Rukun Nikah & Syarat Keabsahan',
    category: 'fiqh',
    scriptText: 'أَرْكَانُ عَقْدِ النِّكَاحِ',
    scriptType: 'arabic',
    citation: 'Kompilasi Hukum Islam (KHI) Pasal 14; Fiqh Sunnah Sayyid Sabiq',
    summary: 'Lima pilar penentu sahnya akad perkawinan menurut hukum syariat Islam dan hukum positif Indonesia.',
    explanation: 'Perkawinan sah apabila terpenuhi lima rukun: (1) Calon mempelai pria, (2) Calon mempelai wanita, (3) Wali nikah dari pihak wanita, (4) Dua orang saksi pria yang adil dan baligh, serta (5) Ijab dan kabul (shighat akad). Tidak ada rukun atau syarat sah yang mewajibkan kecocokan weton atau neptu hari.',
    practicalAdvice: 'Pastikan kelengkapan berkas KUA dan kehadiran wali serta saksi. Kepastian rukun nikah inilah yang menjamin keabsahan pernikahan secara hukum agama dan negara.',
  },
  {
    id: 'mahar',
    term: 'Mahar (Mas Kawin)',
    category: 'fiqh',
    scriptText: 'الصَّدَاقُ / المَهْرُ',
    scriptType: 'arabic',
    citation: 'QS. An-Nisa: 4; KHI Pasal 34 ayat 1',
    summary: 'Pemberian wajib dari calon mempelai pria kepada calon mempelai wanita.',
    explanation: 'Mahar adalah hak mutlak istri yang wajib diserahkan oleh suami. Meskipun wajib, mahar berkedudukan sebagai kewajiban hukum (syarat mutlak), bukan rukun akad nikah. Syariat menganjurkan agar mahar dipermudah dan tidak memberatkan calon suami.',
  },
  {
    id: 'iddah',
    term: 'Masa Iddah',
    category: 'fiqh',
    scriptText: 'عِدَّةُ المَرْأَةِ',
    scriptType: 'arabic',
    citation: 'QS. Al-Baqarah: 234–235; KHI Pasal 153',
    summary: 'Masa tunggu wajib bagi wanita setelah perceraian atau kematian suami sebelum diizinkan menikah kembali.',
    explanation: 'Akad nikah yang dilangsungkan sebelum masa iddah selesai berstatus batal demi hukum (fasid). Larangan menikah dalam masa iddah adalah batasan syariah mutlak yang diakui oleh sistem penanggalan aplikasi ini sebagai filter keras (hard constraint).',
  },
  {
    id: 'ihram',
    term: 'Larangan Akad dalam Keadaan Ihram',
    category: 'fiqh',
    scriptText: 'تَحْرِيمُ عَقْدِ النِّكَاحِ لِلْمُحْرِمِ',
    scriptType: 'arabic',
    citation: 'HR. Muslim no. 1409',
    summary: 'Larangan melangsungkan akad nikah atau menjadi wali saat sedang berihram haji atau umrah.',
    explanation: 'Rasulullah ﷺ bersabda: "Orang yang sedang berihram tidak boleh menikah, tidak boleh menikahkan (menjadi wali), dan tidak boleh melamar" (HR. Muslim).',
  },
  {
    id: 'taysir',
    term: 'Taysir (Kemudahan) & Maslahah Mursalah',
    category: 'fiqh',
    scriptText: 'التَّيْسِيرُ وَرَفْعُ الحَرَجِ',
    scriptType: 'arabic',
    citation: 'QS. Al-Baqarah: 185; Kaidah Fiqhiyyah "Al-Masyaqqatu Tajlibut Taysir"',
    summary: 'Prinsip kemudahan syariat untuk meringankan urusan umat dan menghadirkan kemaslahatan umum.',
    explanation: 'Memilih hari akhir pekan (Sabtu atau Ahad) atau hari libur agar sanak kerabat dan tetangga dapat menghadiri walimah adalah perwujudan maslahah. Dalam kaidah ushul fiqh, kemudahan silaturahmi ini bernilai ibadah sosial.',
  },
  {
    id: 'syawal',
    term: 'Sunnah Akad di Bulan Syawal',
    category: 'fiqh',
    scriptText: 'اسْتِحْبَابُ النِّكَاحِ فِي شَوَّالٍ',
    scriptType: 'arabic',
    citation: 'HR. Muslim no. 1423 dari Ummul Mukminin Aisyah radhiyallahu \'anha',
    summary: 'Anjuran melangsungkan akad dan walimah nikah pada bulan Syawal.',
    explanation: 'Ibunda Aisyah menceritakan bahwa Rasulullah ﷺ menikahinya pada bulan Syawal dan serumah dengannya pada bulan Syawal. Aisyah sangat suka menikahkan kerabat wanitanya di bulan Syawal untuk membantah anggapan jahiliyah bahwa Syawal membawa sial.',
  },
  {
    id: 'urf',
    term: 'Kaidah Al-\'Adatu Muhakkamah (\'Urf / Budaya)',
    category: 'fiqh',
    scriptText: 'العَادَةُ مُحَكَّمَةٌ',
    scriptType: 'arabic',
    citation: 'Kaidah Fiqhiyyah Al-Asybah wan Nazhair Imam As-Suyuthi',
    summary: 'Kebiasaan dan tradisi lokal dapat dijadikan pertimbangan sosial selama tidak melanggar nash syariat.',
    explanation: 'Musyawarah keluarga menggunakan pertimbangan adat petungan Jawa dibolehkan secara fikih sebagai media menjaga keharmonisan silaturahmi keluarga besar, dengan syarat mutlak tidak meyakini adanya kesialan bawaan dari hari.',
  },

  // TRADISI PETUNGAN JAWA
  {
    id: 'weton-neptu',
    term: 'Weton & Neptu',
    category: 'adat',
    scriptText: 'ꦮꦼꦠꦺꦴꦤ꧀ & ꦤꦼꦥ꧀ꦠꦸ',
    scriptType: 'javanese',
    citation: 'Kitab Betaljemur Adammakna Bab II hlm. 7–8',
    summary: 'Perpaduan hari tujuh (Saptawara) dan pasaran lima (Pancawara) beserta bobot angkanya.',
    explanation: 'Saptawara memiliki neptu: Ahad (5), Senin (4), Selasa (3), Rabu (7), Kamis (8), Jumat (6), Sabtu (9). Pancawara memiliki neptu: Legi (5), Pahing (9), Pon (7), Wage (4), Kliwon (8). Penjumlahan neptu hari dan pasaran menghasilkan neptu weton seseorang (misal: Ahad Wage = 5 + 4 = 9).',
  },
  {
    id: 'pawukon',
    term: 'Pawukon (30 Wuku)',
    category: 'adat',
    scriptText: 'ꦥꦮꦸꦏꦺꦴꦤ꧀ (꧓꧐ ꦮꦸꦏꦸ)',
    scriptType: 'javanese',
    citation: 'Kitab Primbon Betaljemur Adammakna Bab III',
    summary: 'Siklus kalender 210 hari yang terbagi ke dalam 30 babak wuku masing-masing berdurasi 7 hari.',
    explanation: 'Siklus wuku dimulai dari Wuku Sinta (#0) hingga Wuku Watugunung (#29). Setiap wuku memiliki naungan dewa, watak, serta larangan hari tertentu seperti Taliwangke dan Samparwangke.',
  },
  {
    id: 'kunarpaning-warsa',
    term: 'Kunarpaning Warsa & Sangaring Warsa',
    category: 'adat',
    scriptText: 'ꦏꦸꦤꦂꦥꦤꦶꦁ ꦮꦂꦱ & ꦱꦔꦫꦶꦁ ꦮꦂꦱ',
    scriptType: 'javanese',
    citation: 'Kitab Betaljemur Adammakna No. 28 hlm. 22',
    summary: 'Hari terakhir di bulan Besar (akhir tahun Jawa) dan tanggal 3 Sura (awal tahun Jawa).',
    explanation: 'Kunarpaning Warsa dihitung dari hari terakhir bulan Besar tahun berjalan (tanggal 29 pada tahun pendek, tanggal 30 pada tahun panjang). Sangaring Warsa jatuh pada tanggal 3 Sura. Kedua hari ini dihindari secara adat demi kehati-hatian pergantian tahun.',
  },
  {
    id: 'bangas-padewan',
    term: 'Bangas Padewan & Taliwangke',
    category: 'adat',
    scriptText: 'ꦧꦔꦱ꧀ ꦥꦢꦺꦮꦤ꧀ & ꦠꦭꦶꦮꦁꦏꦺ',
    scriptType: 'javanese',
    citation: 'Kitab Betaljemur Adammakna No. 30 hlm. 24',
    summary: 'Kaidah hari naas bulanan dan perputaran siklus wuku.',
    explanation: 'Bangas Padewan adalah hari tertentu dalam setiap bulan Jawa yang dipandang keras. Taliwangke adalah hari naas siklis yang berulang setiap wuku tertentu (misal: Sinta bertepatan dengan Senin Kliwon).',
  },
  {
    id: 'dina-pengapesan',
    term: 'Dina Pengapesan (Hari Kelemahan)',
    category: 'adat',
    scriptText: 'ꦢꦶꦤ ꦥꦼꦔꦥꦼꦱꦤ꧀',
    scriptType: 'javanese',
    citation: 'Tradisi Primbon Jawa & Skripsi Petungan Undip',
    summary: 'Hari ke-neptu kelahiran seseorang yang dihitung secara inklusif dari hari weton lahirnya.',
    explanation: 'Contoh: seseorang berweton Selasa Kliwon (neptu 11) memiliki dina pengapesan pada hari ke-11 terhitung mulai Selasa Kliwon. Dalam tradisi adat, hari ini dihindari untuk hajat besar pribadi agar stamina dan pikiran berada pada kondisi prima.',
  },
  {
    id: 'geblak',
    term: 'Geblak Wafat Orang Tua',
    category: 'adat',
    scriptText: 'ꦒꦼꦧ꧀ꦭꦏ꧀ ꦮꦺꦴꦁ ꦠꦸꦮ',
    scriptType: 'javanese',
    citation: 'Tradisi Adat Jawa Keraton & Komunitas Pesisiran',
    summary: 'Hari weton wafatnya ayah atau ibu kandung calon pengantin.',
    explanation: 'Secara adat, menghindari hari geblak wafat orang tua adalah wujud takzim, birrul walidain, dan penghormatan agar hari pernikahan tidak bertepatan dengan memori duka keluarga.',
  },
  {
    id: 'gehing',
    term: 'Pantangan Gehing (Wage Ketemu Pahing)',
    category: 'adat',
    scriptText: 'ꦥꦤ꧀ꦠꦔꦤ꧀ ꦒꦺꦲꦶꦁ (ꦮꦒꦺ x ꦥꦲꦶꦁ)',
    scriptType: 'javanese',
    citation: 'Tradisi Lisan Adat Jawa & Naskah Petungan Populer',
    summary: 'Pertemuan pasaran Wage (unsur air/utara) dan Pahing (unsur api/selatan).',
    explanation: 'Mitos adat mengkhawatirkan watak keras air dan api. Namun secara fikih Islam, pernikahan pasangan Gehing 100% sah dan tidak berdosa. Solusi adat menganjurkan sedekah makanan dan doa tolak bala.',
  },
  {
    id: 'jilu',
    term: 'Pantangan Jilu (Anak Pertama & Anak Ketiga)',
    category: 'adat',
    scriptText: 'ꦥꦤ꧀ꦠꦔꦤ꧀ ꦗꦶꦭꦸ (ꦱꦶꦗꦶ x ꦠꦼꦭꦸ)',
    scriptType: 'javanese',
    citation: 'Kearifan Folklor Jawa Tengah & Jawa Timur',
    summary: 'Pernikahan antara anak sulung (anak ke-1) dan anak ke-3.',
    explanation: 'Adat mengkhawatirkan perbedaan kematangan watak anak pertama yang mandiri dan anak ketiga yang manja. Fikih menegaskan urutan kelahiran tidak memiliki pengaruh hukum syar\'i terhadap keabsahan jodoh.',
  },
  {
    id: 'tunggal-weton',
    term: 'Tunggal Weton (Weton Lahir Sama Persis)',
    category: 'adat',
    scriptText: 'ꦠꦸꦁꦒꦭ꧀ ꦮꦼꦠꦺꦴꦤ꧀',
    scriptType: 'javanese',
    citation: 'Naskah Pasatohan Jawa',
    summary: 'Kondisi calon suami dan calon istri memiliki hari dan pasaran lahir yang persis sama.',
    explanation: 'Sebagian primbon menganggap pasangan tunggal weton memiliki watak yang sangat mirip sehingga rentan perselisihan ego. Dalam Islam, hal ini diatasi dengan saling memahami, bersabar, dan bermusyawarah.',
  },
  {
    id: 'pasatohan-9x9',
    term: 'Pasatohan 9x9 (Betaljemur No. 15)',
    category: 'adat',
    scriptText: 'ꦥꦱꦠꦺꦴꦲꦤ꧀ ꧙x꧙',
    scriptType: 'javanese',
    citation: 'Kitab Betaljemur Adammakna No. 15 hlm. 12–14',
    summary: 'Tabel 81 sel koordinat 2 dimensi sisa pembagian 9 neptu suami dan istri.',
    explanation: 'Dihitung dengan rumus 2D: (neptu suami mod 9, neptu istri mod 9) dengan sisa 0 dianggap 9. Hasilnya memuat 81 tafsir karakter rumah tangga seperti Dadi Pangauban, Asih-asihan, atau Tulus Palakramané.',
  },
  {
    id: 'pancasuda-22',
    term: 'Pancasuda Wasésasegara (Betaljemur No. 22)',
    category: 'adat',
    scriptText: 'ꦥꦚ꧀ꦕꦱꦸꦢ ꦮꦱꦺꦱꦱꦼꦒꦫ',
    scriptType: 'javanese',
    citation: 'Kitab Betaljemur Adammakna No. 22 hlm. 17',
    summary: 'Perhitungan 7 kategori watak neptu gabungan dengan pembagian 10 lalu 7.',
    explanation: 'Jumlah neptu suami dan istri dibagi 10. Jika sisa melebihi 7 atau sisa 0, maka dibagi 7. Tujuh kategorinya: (1) Wasésasegara, (2) Tunggaksemi, (3) Satriya Wibawa, (4) Sumursinaba, (5) Satriyawirang, (6) Bumikapetak, (7) Lebu Katiup Angin.',
  },
  {
    id: 'pegat-pesthi',
    term: 'Petungan 8 Kategori (Pegat s.d. Pesthi)',
    category: 'adat',
    scriptText: 'ꦥꦼꦒꦠ꧀ s.d. ꦥꦼꦱ꧀ꦛꦶ',
    scriptType: 'javanese',
    citation: 'Tabel Tradisi Populer Nusantara & Rumus Aritmatika Modulo 9',
    summary: 'Kategori perjodohan paling populer di masyarakat Jawa: Pegat, Ratu, Jodoh, Topo, Tinari, Padu, Sujanan, Pesthi.',
    explanation: 'Dihitung dengan rumus: (neptu suami + neptu istri) mod 9, dengan sisa 0 atau 1 = Pegat, 2 = Ratu, 3 = Jodoh, 4 = Topo, 5 = Tinari, 6 = Padu, 7 = Sujanan, 8 = Pesthi. Hasil ini bersifat statis untuk pasangan dan tidak mengubah urutan kelayakan tanggal pernikahan.',
  },
  {
    id: 'saat-pasaran',
    term: 'Sa\'at Pasaran (Betaljemur No. 35)',
    category: 'adat',
    scriptText: 'ꦱꦲꦠꦤ꧀ ꦥꦱꦫꦤ꧀',
    scriptType: 'javanese',
    citation: 'Kitab Betaljemur Adammakna No. 35 hlm. 28',
    summary: 'Pembagian 5 jendela waktu siang (pukul 06.00 s.d. 18.00 WIB) berdasarkan hari pasaran.',
    explanation: 'Setiap jendela waktu berdurasi 2 jam 24 menit: Jam ke-1 (06.00–08.24), Jam ke-2 (08.24–10.48), Jam ke-3 (10.48–13.12), Jam ke-4 (13.12–15.36), Jam ke-5 (15.36–18.00). Kategori terbaik untuk akad nikah adalah waktu Slamet dan Rejeki.',
  },
  {
    id: 'saat-tanggal',
    term: 'Sa\'at Tanggal & Malaikat (Betaljemur No. 36)',
    category: 'adat',
    scriptText: 'ꦱꦲꦠꦤ꧀ ꦠꦁꦒꦭ꧀ & ꦩꦭꦲꦶꦏꦠ꧀',
    scriptType: 'javanese',
    citation: 'Kitab Betaljemur Adammakna No. 36 hlm. 29',
    summary: 'Jadwal 5 waktu pelaksanaan hajat berdasarkan modulo 5 tanggal Jawa beserta malaikat penjaganya.',
    explanation: 'Dihitung dari tanggal Jawa mod 5: sisa 1 (Malaikat Kasfiyail / Slamet), sisa 2 (Malaikat Mikail / Rijeki), sisa 3 (Malaikat Israfil / Tutur), sisa 4 (Malaikat Jibril / Alangan), sisa 0/5 (Malaikat \'Izrail / Pacak).',
  },

  // ASTRONOMI & FALAK
  {
    id: 'jdn',
    term: 'Julian Day Number (JDN)',
    category: 'falak',
    scriptText: 'Algoritma Fliegel-Van Flandern',
    citation: 'Communications of the ACM (1968)',
    summary: 'Hitungan bilangan bulat hari tanpa putus sejak tanggal 1 Januari 4713 SM pada kalender Julian.',
    explanation: 'JDN adalah standar internasional komputasi astronomi untuk mengonversi tanggal Gregorian ke hari dalam sepekan (Saptawara) dan hari pasaran Jawa (Pancawara) dengan jaminan kepastian matematis tanpa pergeseran zona waktu.',
  },
  {
    id: 'kurup-asapon',
    term: 'Kurup Asapon (1867–1986 Jawa / 1936–2052 M)',
    category: 'falak',
    scriptText: 'ꦏꦸꦫꦸꦥ꧀ ꦄꦱꦥꦺꦴꦤ꧀ (ꦄꦭꦶꦥ꧀ ꦱꦼꦭꦱ ꦥꦺꦴꦤ꧀)',
    scriptType: 'javanese',
    citation: 'Penetapan Sri Sultan Hamengkubuwono VII; Koreksi Gugur Sedina 1867 J',
    summary: 'Reckoning resmi kalender Jawa Sultan Agungan yang berjalan selama 120 tahun.',
    explanation: 'Kurup Asapon dimulai pada Selasa Pon, 24 Maret 1936 M (JDN 2428252) dan berakhir pada Ahad Legi, 25 Agustus 2052 M (JDN 2470775) dengan durasi tepat 42.524 hari (setelah menggugurkan 1 hari kabisat). Kurup berikutnya adalah Kurup Anenhing (dimulai Senin Pahing, 26 Agustus 2052 M).',
  },
  {
    id: 'siklus-windu',
    term: 'Siklus 8 Tahun Windu Jawa',
    category: 'falak',
    scriptText: 'ꦱꦶꦏ꧀ꦭꦸꦱ꧀ ꦮꦶꦤ꧀ꦢꦸ (꧘ ꦠꦲꦸꦤ꧀)',
    scriptType: 'javanese',
    citation: 'Sistem Kalender Sultan Agung 1633 M (1555 Saka)',
    summary: 'Perulangan delapan nama tahun Jawa: Alip, Ehe, Jimawal, Je, Dal, Be, Wawu, Jimakir.',
    explanation: 'Dalam satu windu terdapat 3 tahun kabisat (panjang 355 hari dengan bulan Besar 30 hari), yaitu tahun Ehe, Dal, dan Jimakir. Lima tahun lainnya adalah tahun wastu (pendek 354 hari dengan bulan Besar 29 hari).',
  },
  {
    id: 'hijri-kemenag',
    term: 'Kalender Hijriah Kemenag RI (Kriteria MABIMS)',
    category: 'falak',
    scriptText: 'التَّقْوِيمُ الهِجْرِيُّ الرَّسْمِيُّ',
    scriptType: 'arabic',
    citation: 'Keputusan Bersama Menteri Agama Brunei, Indonesia, Malaysia, Singapura (2021)',
    summary: 'Standar visibilitas hilal resmi di Indonesia dengan tinggi minimal 3 derajat dan elongasi 6,4 derajat.',
    explanation: 'Digunakan oleh Kementerian Agama Republik Indonesia untuk menetapkan awal bulan qamariyah melalui sidang isbat rukyatul hilal terverifikasi.',
  },

  // FATWA ULAMA
  {
    id: 'fatwa-mui',
    term: 'Fatwa MUI No. 2 Tahun 2005 (Perdukunan & Ramalan)',
    category: 'fatwa',
    scriptText: 'فَتْوَى مَجْلِسِ العُلَمَاءِ الإِنْدُونِيسِيِّ',
    scriptType: 'arabic',
    citation: 'Keputusan Musyawarah Nasional VII MUI Tahun 2005',
    summary: 'Larangan mempercayai ramalan nasib sial, ramalan bintang, dan perdukunan yang menodai tauhid.',
    explanation: 'MUI menetapkan bahwa mempercayai ramalan yang mengklaim mengetahui takdir gaib atau menghubungkan kesialan hidup dengan hari tertentu adalah haram. Penggunaan petungan budaya hanya dapat diposisikan sebagai kajian sosiologis budaya tanpa keyakinan mistis.',
  },
  {
    id: 'tarjih-muhammadiyah',
    term: 'Tuntunan Majelis Tarjih & Tajdid Muhammadiyah',
    category: 'fatwa',
    scriptText: 'مَجْلِسُ التَّرْجِيحِ وَالتَّجْدِيدِ',
    scriptType: 'arabic',
    citation: 'Buku Tanya Jawab Agama Jilid IV; Suara Muhammadiyah',
    summary: 'Penegasan kemurnian akidah tauhid dan anjuran memilih waktu pernikahan yang memudahkan.',
    explanation: 'Majelis Tarjih menegaskan bahwa semua hari diciptakan baik oleh Allah. Mengaitkan kegagalan rumah tangga dengan weton atau hari pernikahan termasuk tathayyur yang dilarang. Umat Islam dianjurkan memilih hari yang longgar bagi keluarga dan tamu undangan.',
  },
  {
    id: 'bahtsul-masail-nu',
    term: 'Keputusan Bahtsul Masail Nahdlatul Ulama (LBM-PBNU)',
    category: 'fatwa',
    scriptText: 'بَحْثُ المَسَائِلِ لِجَمْعِيَّةِ نَهْضَةِ العُلَمَاءِ',
    scriptType: 'arabic',
    citation: 'Ahkamul Fuqaha Keputusan Muktamar & Konbes NU',
    summary: 'Kedudukan hisab petungan adat sebagai \'urf (tradisi kebiasaan) yang mubah.',
    explanation: 'Para kiai NU merumuskan bahwa petungan hari baik untuk pernikahan boleh dijadikan pertimbangan kehati-hatian sosial (\'urf mubah) demi menghormati musyawarah para sesepuh, asalkan diyakini dengan teguh bahwa untung, rugi, jodoh, dan maut sepenuhnya berada dalam takdir Allah ﷻ.',
  },
];

export default function GlossaryPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'fiqh' | 'adat' | 'falak' | 'fatwa'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    return GLOSSARY_DATA.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTerm = item.term.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchExp = item.explanation.toLowerCase().includes(q);
        const matchCitation = item.citation?.toLowerCase().includes(q) ?? false;
        if (!matchTerm && !matchSummary && !matchExp && !matchCitation) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-obsidian-950 bg-batik-pattern transition-colors">
      <AntiTathayyurBanner />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-prada-500/15 text-prada-800 dark:text-prada-300 border border-prada-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pusat Edukasi &amp; Ensiklopedia Falak</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-sand-950 dark:text-sand-50">
            Glosarium Falak &amp; Fiqih Nikah
          </h1>
          <p className="text-xs sm:text-sm text-sand-600 dark:text-sand-400 max-w-2xl mx-auto leading-relaxed">
            Ensiklopedia istilah penanggalan tradisi Jawa, dalil syariat Islam, hisab astronomi, dan pandangan fatwa ulama kontemporer secara jernih, objektif, dan berlandaskan ilmu.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800/80 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari istilah, hadits, kitab, atau kata kunci (contoh: Pegat, Syawal, Asapon, Fatwa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-sand-300 dark:border-sand-700 bg-sand-50 dark:bg-obsidian-850 text-sand-900 dark:text-sand-100 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-prada-500"
            />
            <Search className="w-4 h-4 text-sand-400 absolute left-3 top-3" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-prada-500 text-obsidian-950 font-bold shadow-xs'
                    : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800'
                }`}
              >
                Semua ({GLOSSARY_DATA.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('fiqh')}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                  activeCategory === 'fiqh'
                    ? 'bg-prada-500 text-obsidian-950 font-bold shadow-xs'
                    : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fiqih &amp; Tauhid</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('adat')}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                  activeCategory === 'adat'
                    ? 'bg-prada-500 text-obsidian-950 font-bold shadow-xs'
                    : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Tradisi Petungan Jawa</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('falak')}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                  activeCategory === 'falak'
                    ? 'bg-prada-500 text-obsidian-950 font-bold shadow-xs'
                    : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Astronomi &amp; Falak</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('fatwa')}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                  activeCategory === 'fatwa'
                    ? 'bg-prada-500 text-obsidian-950 font-bold shadow-xs'
                    : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800'
                }`}
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>Fatwa Ulama (MUI/NU/Tarjih)</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-sand-500 dark:text-sand-400">
              <span>Menampilkan {filteredEntries.length} istilah</span>
              {(activeCategory !== 'all' || searchQuery.trim().length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-prada-700 dark:text-prada-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Entries Grid */}
        <div className="space-y-4">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((item) => (
              <article
                key={item.id}
                id={item.id}
                className="p-5 md:p-6 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800/80 space-y-3 transition-all hover:border-prada-500/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-sand-200 dark:border-sand-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif font-bold text-lg md:text-xl text-sand-950 dark:text-sand-50">
                        {item.term}
                      </h2>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                          item.category === 'fiqh'
                            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                            : item.category === 'fatwa'
                              ? 'bg-blue-500/15 text-blue-800 dark:text-blue-300'
                              : item.category === 'falak'
                                ? 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300'
                                : 'bg-prada-500/15 text-prada-800 dark:text-prada-300'
                        }`}
                      >
                        {item.category === 'fiqh'
                          ? 'Fiqih & Tauhid'
                          : item.category === 'fatwa'
                            ? 'Fatwa Ulama'
                            : item.category === 'falak'
                              ? 'Falak & Kalender'
                              : 'Tradisi Jawa'}
                      </span>
                    </div>

                    {item.citation && (
                      <p className="text-xs font-mono text-sand-500 dark:text-sand-400 mt-0.5">
                        {item.citation}
                      </p>
                    )}
                  </div>

                  {item.scriptText && (
                    <span
                      className={`text-sm md:text-base font-semibold shrink-0 ${
                        item.scriptType === 'arabic'
                          ? 'font-serif text-emerald-800 dark:text-emerald-300 text-right'
                          : 'font-serif text-prada-800 dark:text-prada-400'
                      }`}
                      dir={item.scriptType === 'arabic' ? 'rtl' : 'ltr'}
                    >
                      {item.scriptText}
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm font-semibold text-sand-800 dark:text-sand-200">
                  {item.summary}
                </p>

                <p className="text-xs md:text-sm text-sand-700 dark:text-sand-300 leading-relaxed">
                  {item.explanation}
                </p>

                {item.practicalAdvice && (
                  <div className="p-3 rounded-lg bg-sand-200/50 dark:bg-obsidian-950/60 border border-sand-300/80 dark:border-sand-800 text-xs text-sand-700 dark:text-sand-300 leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-prada-600 dark:text-prada-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Tuntunan Praktis:</strong> {item.practicalAdvice}
                    </div>
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="p-8 text-center bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 rounded-xl space-y-2">
              <p className="font-semibold text-sand-800 dark:text-sand-200 text-sm">
                Tidak ada istilah yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-200 dark:bg-obsidian-800 text-xs font-semibold text-sand-800 dark:text-sand-200 hover:bg-sand-300 dark:hover:bg-obsidian-750 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tampilkan Semua Istilah</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
