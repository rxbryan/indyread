## ES
es-up:
	docker-compose -f docker-compose.es.yml up && \
	make logs-es

es-logs:
	docker-compose -f docker-compose.es.yml logs -f

es-down:
	docker-compose -f docker-compose.es.yml down --remove-orphans

es-destroy:
	docker-compose -f docker-compose.es.yml down --remove-orphans --volumes


new:
	make destroy && \
	docker-compose -f docker-compose.es.yml up -d && \
	make logs
