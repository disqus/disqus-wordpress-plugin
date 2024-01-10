FROM wordpress:latest

# Install system dependencies
RUN set -ex; \
    apt-get update; \
    apt-get install -y \
        default-mysql-client \
        less \
        nodejs \
        subversion \
        sudo \
        yarnpkg \
    ; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Add WP-CLI
RUN curl -o /bin/wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
COPY wp-su.sh /bin/wp
RUN chmod +x /bin/wp-cli.phar /bin/wp

# Add Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Install dockerize
ENV DOCKERIZE_VERSION 0.6.1
RUN set -ex; \
    curl -L -O "https://github.com/jwilder/dockerize/releases/download/v${DOCKERIZE_VERSION}/dockerize-linux-amd64-v${DOCKERIZE_VERSION}.tar.gz"; \
    tar xzvf dockerize-linux-amd64-v${DOCKERIZE_VERSION}.tar.gz; \
    mv dockerize /usr/local/bin/dockerize; \
    dockerize -version; \
    rm dockerize-linux-amd64-v${DOCKERIZE_VERSION}.tar.gz

# Install test dependencies
RUN mkdir -p /usr/src/app
COPY composer.json composer.lock package.json yarn.lock /usr/src/app/
COPY bin/install-wp-tests.sh /usr/src/app/bin/
RUN set -ex; \
    cd /usr/src/app; \
    bin/install-wp-tests.sh "" "" "" "" latest true; \
    composer install; \
    yarnpkg
COPY . /usr/src/app
