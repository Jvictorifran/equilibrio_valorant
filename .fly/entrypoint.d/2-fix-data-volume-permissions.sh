#!/bin/sh
# Fly volumes are mounted root-owned on first boot. Runs before
# 50-laravel-automations.sh so migrations can write to the sqlite file.
set -e

db_path="${DB_DATABASE:-/var/www/html/database/database.sqlite}"
db_dir=$(dirname "$db_path")

mkdir -p "$db_dir"
touch "$db_path"
chown -R www-data:www-data "$db_dir"
