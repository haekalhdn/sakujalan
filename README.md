# GoPay Campus Runway

MVP pencatatan manual untuk merencanakan uang saku mahasiswa sampai pemasukan berikutnya. Aplikasi memisahkan saldo aktual, kebutuhan terjadwal, belanja harian, pemasukan menunggu, dan uang yang sudah diterima.

## Kemampuan utama

- Anggaran satu periode dengan jadwal uang saku 1–90 hari.
- Perkiraan batas belanja hari ini dan kekurangan pada akhir periode.
- Kebutuhan wajib/opsional, alternatif lebih hemat, penundaan opsional, dan pembayaran yang menutup rencana tanpa menghitung biaya dua kali.
- Belanja harian, biaya tambahan, pemasukan, transfer antar-akun sendiri, refund terikat transaksi asal, dan check-in kebutuhan nyata.
- Penyimpanan per akun, ekspor JSON, penghapusan data, penolakan perubahan usang dari tab lain, dan idempotensi pengiriman ulang.

Versi ini tidak terhubung ke rekening, tidak meminta PIN/OTP, tidak memindahkan uang, dan tidak menawarkan kredit. Katalog peluang hanya dapat diisi setelah proses verifikasi partner.

## Pengembangan lokal

Gunakan Node.js 22.13 atau lebih baru.

```bash
npm install
npm run dev
```

Masuk melalui halaman simulasi lokal. Buat migrasi setelah perubahan `db/schema.ts` dengan `npm run db:generate`. Pemeriksaan utama:

```bash
npm run lint
npx tsc --noEmit
npx tsx tests/runway.test.ts
npm run build
```

Skema produksi berada di `drizzle/`. Jangan memasukkan data contoh peserta ke migrasi.

## Catatan pilot

Sebelum merekrut peserta, tetapkan kebijakan retensi, kanal dukungan, proses respons insiden, peran operator, dan persetujuan legal/security. Gunakan data contoh sampai prasyarat tersebut dipenuhi.
