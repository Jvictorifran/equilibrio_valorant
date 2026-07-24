# syntax=docker/dockerfile:1

# ============================================================
# Frontend assets (Vite/React) — built once, only the compiled
# output is copied into the final image, Node never ships.
# ============================================================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY vite.config.js jsconfig.json postcss.config.js tailwind.config.js ./
COPY resources/ resources/
RUN npm run build

# ============================================================
# PHP dependencies — installed separately from the app code so
# this layer only rebuilds when composer.json/lock changes.
# ============================================================
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
COPY database/factories database/factories
COPY database/seeders database/seeders
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --no-interaction \
    --prefer-dist

# ============================================================
# Production image
# ============================================================
FROM serversideup/php:8.4-fpm-nginx-alpine AS production

ENV PHP_OPCACHE_ENABLE=1 \
    AUTORUN_ENABLED=true \
    SHOW_WELCOME_MESSAGE=false

# The base image drops to www-data by default. We stay on root so the
# entrypoint.d script below can fix ownership of the Fly volume mounted
# at /data on first boot — nginx/php-fpm still hand worker processes off
# to www-data internally, so this doesn't run the app itself as root.
USER root

COPY --chmod=755 .fly/entrypoint.d/ /etc/entrypoint.d/

COPY --chown=www-data:www-data . /var/www/html
COPY --from=vendor --chown=www-data:www-data /app/vendor /var/www/html/vendor
COPY --from=frontend --chown=www-data:www-data /app/public/build /var/www/html/public/build

WORKDIR /var/www/html

RUN composer dump-autoload --no-dev --optimize --classmap-authoritative
