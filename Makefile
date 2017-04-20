run:
	docker-compose up --build

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
	npm run start
