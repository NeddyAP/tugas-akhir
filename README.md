## Setup Instructions

### Prerequisites

Before you begin, ensure you have met the following requirements:

-   PHP ^8.2
-   Composer
-   Node.js and npm
-   MySQL or any other supported database

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/neddy1298/tugas-akhir
    cd tugas-akhir
    ```

2. **Install PHP dependencies:**

    ```sh
    composer install
    ```

3. **Install JavaScript dependencies:**

    ```sh
    npm install
    ```

4. **Copy the `.env.example` file to `.env`:**

    ```sh
    cp .env.example .env
    ```

5. **Generate an application key:**

    ```sh
    php artisan key:generate
    ```

6. **Configure your database in the `.env` file:**

    ```env
    DB_CONNECTION=sqlite
    ```

7. **Run database migrations:**

    ```sh
    php artisan migrate
    php artisan db:seed
    ```

8. **Build the front-end assets:**

    ```sh
    npm run dev
    ```

### Running the Application

1. **Start the Laravel development server:**

    ```sh
    php artisan serve
    ```

2. **Visit the application in your browser:**

    Open your browser and go to `http://localhost:8000`.

### Additional Commands

-   **Run tests:**

    ```sh
    php artisan test
    ```

-   **Build assets for production:**

    ```sh
    npm run build
    ```

### Troubleshooting

If you encounter any issues, please refer to the [Laravel documentation](https://laravel.com/docs) and the [React documentation](https://reactjs.org/docs/getting-started.html).
