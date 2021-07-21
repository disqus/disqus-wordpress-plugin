CURPATH := $(abspath $(lastword $(MAKEFILE_LIST)))
CURDIR := $(notdir $(patsubst %/,%,$(dir $(CURPATH))))

lint:
	./vendor/bin/phpcs --standard=phpcs.ruleset.xml

run:
	docker-compose up --build -d
	yarn run start

reset:
	docker-compose down --volumes

rebuild:
	reset
	docker-compose build --no-cache

install:
	docker exec ${CURDIR}_wordpress_1 wp core install --url='localhost:8888' --title='Example' --admin_user='admin' --admin_password='root' --admin_email='admin@example.com'

activate:
	docker exec ${CURDIR}_wordpress_1 wp plugin activate disqus

js:
	yarn run build

docker-test:
	docker-compose -f docker-compose.test.yml rm -f -v
	docker-compose -f docker-compose.test.yml build
	docker-compose -f docker-compose.test.yml up  --abort-on-container-exit

dist:
	yarn run build
	rm -f disqus.zip
	zip -r disqus.zip disqus
