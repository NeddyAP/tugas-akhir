FROM dunglas/frankenphp:php8.3-bookworm

ENV SERVER_NAME=":8080"

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs

# Install PHP extensions
RUN install-php-extensions \
    @composer \
    pdo_mysql \
    pdo_sqlite \
    sqlite3 \
    bcmath \
    gd \
    zip \
    opcache

# Configure PHP and OpCache
RUN echo "memory_limit=512M" > /usr/local/etc/php/conf.d/memory-limit.ini && \
    echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/memory-limit.ini && \
    echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.max_accelerated_files=20000" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /app

# Create necessary directories first
RUN mkdir -p public/build bootstrap/cache storage/framework/{cache,sessions,views}

# Copy composer files first
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install \
    --ignore-platform-reqs \
    --optimize-autoloader \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --no-scripts

# Copy frontend files and build
COPY package*.json vite.config.js ./
COPY resources/ ./resources/
RUN mkdir -p public/build && \
    chmod -R 775 public && \
    NODE_ENV=production npm install --production && \
    npm run build && \
    chmod -R 775 public/build

# Now copy the rest of the application
COPY . .

# Set proper permissions and finalize
RUN chown -R www-data:www-data /app && \
    chmod -R 775 storage bootstrap/cache public/build && \
    php artisan storage:link && \
    php artisan key:generate --force && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan optimize

EXPOSE 8080

CMD ["/usr/local/bin/frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]