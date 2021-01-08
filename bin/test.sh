#!/usr/bin/env bash
# Run PHPUnit with and without multisite enabled to prevent the need for
# multiple CI builds

# Run single-site unit tests
export WP_MULTISITE=0
./vendor/bin/phpunit  --exclude-group=ms-required

# Run Multisite unit tests
export WP_MULTISITE=1
./vendor/bin/phpunit  --exclude-group=ms-excluded
