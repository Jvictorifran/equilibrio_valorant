#!/bin/sh
# Fly volumes are mounted root-owned on first boot. This entrypoint chain
# runs entirely as root (see Dockerfile), including 50-laravel-automations.sh
# (migrations) — so this must run AFTER it, not before: chowning earlier
# just gets undone the moment migrations write to the file as root again.
#
# Ownership target is 65534:65534 (nobody), not www-data: the "unit" image
# variant's default php application config has no explicit "user", so Unit
# runs the actual request-serving PHP workers as nobody, not www-data.
set -e

db_path="${DB_DATABASE:-/var/www/html/database/database.sqlite}"
db_dir=$(dirname "$db_path")

mkdir -p "$db_dir"
touch "$db_path"
chown -R 65534:65534 "$db_dir"
