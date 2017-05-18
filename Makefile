phpcs:
	~/.composer/vendor/bin/phpcs --standard=phpcs.ruleset.xml $(find . -name '*.php')

run:
	docker-compose up --build -d
	yarn run start

reset:
	docker-compose down --volumes

rebuild:
	reset
	docker-compose build --no-cache

install:
	docker exec disquswordpressplugin_wordpress_1 wp core install --url='localhost:8888' --title='Example' --admin_user='admin' --admin_password='root' --admin_email='admin@example.com'

activate:
	docker exec disquswordpressplugin_wordpress_1 wp plugin activate disqus

js:
	yarn run build
