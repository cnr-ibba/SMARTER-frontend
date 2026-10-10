# SMARTERFrontend

[![Coverage Status](https://coveralls.io/repos/github/cnr-ibba/SMARTER-frontend/badge.svg?branch=master)](https://coveralls.io/github/cnr-ibba/SMARTER-frontend?branch=master)
[![CI Angular app through Github Actions](https://github.com/cnr-ibba/SMARTER-frontend/actions/workflows/main.yml/badge.svg)](https://github.com/cnr-ibba/SMARTER-frontend/actions/workflows/main.yml)
[![Deploy to GitHub Pages via angular-cli-ghpages](https://github.com/cnr-ibba/SMARTER-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/cnr-ibba/SMARTER-frontend/actions/workflows/deploy.yml)
[![GitHub deployments](https://img.shields.io/github/deployments/cnr-ibba/SMARTER-frontend/github-pages)](https://cnr-ibba.github.io/SMARTER-frontend/)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.4.

## Setup environment

The Angular CLI (`ng`, version 14) is a project dependency: do **not** install it globally
(a different global version may be incompatible with this project). Create a conda
environment with Node.js only, then install the dependencies:

```
$ conda create -n smarter-frontend -c conda-forge nodejs=16
$ conda activate smarter-frontend
```

## Install dependencies

```
$ npm ci
```

Use `npm install` instead if you need to update `package-lock.json`. The `ng` command is then
available through the npm scripts below, or with `npx ng <command>`.

## Utility scripts

| Script | Description |
| --- | --- |
| `npm run build:prod` | production build into `dist/` |
| `npm run build:webserver` | production build with `--base-href /smarter/` (https://webserver.ibba.cnr.it/smarter/) |
| `npm run test:ci` | single headless test run with coverage, as in CI |
| `npm run clean` | remove `node_modules` |
| `npm run clean:dist` | remove `dist` |
| `npm run reinstall` | `clean` + `npm install` |
| `npm run rebuild` | `clean` + `npm install` + `build` |

## Development server

Run `npm start` (or `npx ng serve`) for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
