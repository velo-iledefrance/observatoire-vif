.DEFAULT_GOAL := help

install: package.json bun.lock ## Install or update the required dependencies
	bun install

run: install ## Start the development server
	bun next dev

build: install ## Build the static website
	bun next build

lint: ## Run linters
	bun eslint

help: ## Display available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: install run build lint help
