## Instruksi Setup

### Prasyarat

Sebelum memulai, pastikan Anda telah memenuhi persyaratan berikut:

- PHP ^8.2
- Composer
- Node.js dan npm
- MySQL atau database lain yang didukung

### Instalasi

0. **Klon repositori:**

   ```sh
   git clone https://github.com/neddy1298/tugas-akhir
   cd tugas-akhir
   ```

1. **Instal dependensi PHP:**

   ```sh
   composer install
   ```

2. **Instal dependensi JavaScript:**

   ```sh
   npm install
   ```

3. **Salin file `.env.example` ke `.env`:**

   ```sh
   cp .env.example .env
   ```

4. **Hasilkan kunci aplikasi:**

   ```sh
   php artisan key:generate
   ```

5. **Konfigurasi database Anda di file `.env`:**

   ```env
   DB_CONNECTION=sqlite
   ```

6. **Jalankan migrasi database:**

   jika <b>belum</b> memiliki database:

   ```sh
   php artisan migrate
   php artisan db:seed
   ```

   jika <b>sudah</b> memiliki database:

   ```sh
   php artisan migrate:fresh --seed
   ```

7. **Konfigurasi storage:**

   ```sh
   php artisan storage:link
   ```

### Menjalankan Aplikasi

1.  **Mulai server pengembangan Laravel:**
    jalankan kode berikut di terminal yang berbeda

    terminal 1:

    ```sh
    php artisan serve
    ```

    terminal 2:

    ```sh
    npm run dev
    ```

2.  **Kunjungi aplikasi di browser Anda:**

    Buka browser Anda dan pergi ke `http://localhost:8000`.
