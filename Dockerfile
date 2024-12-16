FROM dunglas/frankenphp:php8.3-bookworm

ENV SERVER_NAME=":8080"

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs

# Install PHP extensions
RUN install-php-extensions \
    @composer \
    pdo_mysql \
    bcmath \
    gd \
    zip \
    opcache

WORKDIR /app

COPY . .

# Install PHP dependencies
RUN composer install \
    --ignore-platform-reqs \
    --optimize-autoloader \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --no-scripts

# Install npm dependencies and build assets
RUN npm install && npm run build

# Set proper permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Generate application key if not exists
RUN php artisan key:generate --force

# Cache configuration for better performance
RUN php artisan optimize

EXPOSE 8080