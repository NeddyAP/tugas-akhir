## Instruksi Setup

### Prasyarat

Sebelum memulai, pastikan Anda telah memenuhi persyaratan berikut:

-   PHP ^8.2
-   Composer
-   Node.js dan npm
-   MySQL atau database lain yang didukung

### Instalasi

1. **Klon repositori:**

    ```sh
    git clone https://github.com/neddy1298/tugas-akhir
    cd tugas-akhir
    ```

2. **Instal dependensi PHP:**

    ```sh
    composer install
    ```

3. **Instal dependensi JavaScript:**

    ```sh
    npm install
    ```

4. **Salin file `.env.example` ke `.env`:**

    ```sh
    cp .env.example .env
    ```

5. **Hasilkan kunci aplikasi:**

    ```sh
    php artisan key:generate
    ```

6. **Konfigurasi database Anda di file `.env`:**

    ```env
    DB_CONNECTION=sqlite
    ```

7. **Jalankan migrasi database:**

    ```sh
    php artisan migrate
    php artisan db:seed
    ```

8. **Bangun aset front-end:**

    ```sh
    npm run dev
    ```

### Menjalankan Aplikasi

1. **Mulai server pengembangan Laravel:**

    ```sh
    php artisan serve
    ```

2. **Kunjungi aplikasi di browser Anda:**

    Buka browser Anda dan pergi ke `http://localhost:8000`.

### Perintah Tambahan (optional)

-   **Jalankan tes:**

    ```sh
    php artisan test
    ```

-   **Bangun aset untuk produksi:**

    ```sh
    npm run build
    ```

### Pemecahan Masalah

Jika Anda mengalami masalah, silakan merujuk ke [dokumentasi Laravel](https://laravel.com/docs) dan [dokumentasi React](https://reactjs.org/docs/getting-started.html).
