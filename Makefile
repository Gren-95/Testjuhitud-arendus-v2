.PHONY: help dev test test-watch test-coverage migrate migrate-reset db-seed db-studio

help:
	@echo "Saadaolevad käsud:"
	@echo "  make dev          - Käivita arendusrežiim"
	@echo "  make test         - Käivita testid"
	@echo "  make test-watch   - Käivita testid jälgimise režiimis"
	@echo "  make test-coverage - Käivita testid kattuvusega"
	@echo "  make migrate      - Käivita migratsioonid"
	@echo "  make migrate-reset - Lähtesta andmebaas"
	@echo "  make db-seed      - Täida andmebaas algandmetega"
	@echo "  make db-studio    - Ava Prisma Studio"

dev:
	npm run dev

test:
	npm test

test-watch:
	npm run test:watch

test-coverage:
	npm run test:coverage

migrate:
	npm run migrate:dev

migrate-reset:
	npm run migrate:reset

db-seed:
	npm run db:seed

db-studio:
	npm run db:studio

