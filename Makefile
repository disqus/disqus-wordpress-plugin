lint:
	./vendor/bin/phpcs --standard=phpcs.ruleset.xml

run:
	docker compose up --build -d
	yarn run start

reset:
	docker compose down --volumes

rebuild:
	reset
	docker compose build --no-cache

install:
	@docker compose up -d db wordpress
	@echo "Waiting for database..."
	@for i in $$(seq 1 30); do \
		docker compose ps db --format '{{.Health}}' 2>/dev/null | grep -q healthy && break; \
		sleep 2; \
	done
	@CONTAINER=$$(docker compose ps -q wordpress); \
	if [ -z "$$CONTAINER" ]; then \
		echo "WordPress container is not running. Try: make run"; \
		exit 1; \
	fi; \
	docker exec $$CONTAINER wp core install --url='localhost:8888' --title='Example' --admin_user='admin' --admin_password='root' --admin_email='admin@example.com'

activate:
	@CONTAINER=$$(docker compose ps -q wordpress); \
	docker exec $$CONTAINER wp plugin activate disqus

js:
	yarn run build

docker-test:
	docker compose -f docker-compose.test.yml rm -f -v
	docker compose -f docker-compose.test.yml build
	docker compose -f docker-compose.test.yml up  --abort-on-container-exit

dist:
	yarn run build
	rm -f disqus.zip
	zip -r disqus.zip disqus
