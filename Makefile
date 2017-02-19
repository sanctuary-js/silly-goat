ESLINT = node_modules/.bin/eslint --config node_modules/sanctuary-style/eslint-es6.json --env es6 --env node
NPM = npm

SCRIPTS = $(shell find scripts -name '*.js' | sort)


.PHONY: lint
lint:
	$(ESLINT) -- $(SCRIPTS)


.PHONY: setup
setup:
	$(NPM) install
