# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

SMARTER-frontend is an Angular 14 + Angular Material single-page app (NgModule-based, not standalone components) that browses data from the SMARTER REST API (sheep/goat breeds, datasets, samples, variants). It is deployed to GitHub Pages at `/SMARTER-frontend/`.

## Commands

- `npm ci` — install dependencies (inside a conda env: `conda create -n smarter-frontend -c conda-forge nodejs=16`; don't install `ng` globally)
- `npm start` (`ng serve`) — dev server at http://localhost:4200/
- `npm run build` — production build into `dist/`
- `npm test` — Karma/Jasmine in watch mode with Chrome
- Single run as in CI: `npm run test:ci`
- Utilities: `npm run build:prod`, `build:gh-pages` (base-href `/SMARTER-frontend/`), `clean` (node_modules), `clean:dist`, `reinstall`, `rebuild`
- Single spec: `npm test -- --no-watch --include='src/app/samples/samples.service.spec.ts'`

There is no lint script or e2e setup. CI (Node 16) runs `npm ci` + the headless test command on pushes/PRs to `master` and `devel`; pushing to `master` deploys with `ng deploy --base-href=/SMARTER-frontend/`.

## Backend

`src/environments/environment.ts` points `backend_url` at `http://localhost:27080/smarter-api` (a locally running SMARTER API); `environment.prod.ts` uses `https://webserver.ibba.cnr.it/smarter-api`. Services build URLs as `environment.backend_url + '/<resource>'`.

## Architecture

Feature folders under `src/app/` (`breeds`, `datasets`, `samples`, `variants`) each follow the same pattern: `<feature>.component` (paginated/sortable `MatTable` list), `<feature>.service` (HttpClient wrapper), `<feature>.model.ts` (API response interfaces), plus `<feature>-detail/` with a route resolver for `datasets`, `samples` and `variants`. Routes are all in `app-routing.module.ts`; detail routes use resolvers (`resolve: { sample: SampleResolver }`), and species-specific details use `/:species/:_id`. Unknown paths redirect to `/not-found`.

Key cross-file behaviours:
- **API pagination**: API pages are 1-based (`page+1` is sent), while `MatPaginator` is 0-based. List components combine sort/paginator/form-change streams (`merge` + `switchMap`) to fetch data, and mirror state into URL query params (`QueryParams extends PaginationParams` from `shared/shared.model.ts`).
- **Species selection is service state**: `SamplesService.selectedSpecie` (default "Sheep") and `pageSize` persist across navigation; the species determines the endpoint (`/samples/<species>`). `getCountries()`/`getBreeds()` fetch the first page, then the remaining pages in parallel via `forkJoin`, and emit on `countryStateChanged`/`breedStateChanged` Subjects so autocomplete filters can refresh. Similar patterns exist in the variants feature.
- **Mongo-style JSON**: models use `ObjectID` (`$oid`) and `ObjectDate` (`$date`) from `shared/shared.model.ts`.
- `shared/` also holds pipes, `UIService`, `OverlayService`, and the progress spinner; `material/material.module.ts` centralizes Angular Material imports; `navigation/` has header and sidenav.
- `*-example.json` files next to components are sample API payloads used for reference/tests.

## Conventions

- Commit messages use gitmoji shortcodes (e.g. `:sparkles: add feature`), per the git history.
- Work happens on `devel`; `master` is the release/deploy branch.
