.PHONY: install dev build check test clean

install:
	cd website && pnpm install --frozen-lockfile

dev:
	cd website && pnpm dev

build:
	cd website && pnpm install --frozen-lockfile && pnpm build

check:
	cd website && pnpm check

test:
	cd website && pnpm test && pnpm test:e2e

clean:
	rm -rf website/dist website/.astro website/node_modules
