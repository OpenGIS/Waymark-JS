# AGENTS.md

## Overview
- **Project**: Waymark JS
- **Type**: JavaScript mapping library for creating, viewing, and editing GeoJSON-backed overlays
- **Purpose**: Render interactive maps powered by MapLibre GL JS with configurable basemaps and overlay styling

## Tech Stack
- **Language**: JavaScript (ES modules)
- **Framework**: Vue 3 (Single File Components)
- **State Management**: Pinia
- **Mapping**: MapLibre GL JS
- **Build Tooling**: Vite (library mode)
- **Styling Assets**: Less, Font Awesome 4, Ionicons 2

## Project Structure
Refer to the canonical overview in [`README.md`](README.md#project-structure) for directory layout and component responsibilities.

## Development Workflow
- Install dependencies with `npm install`
- Run `npm run dev` for the Vite dev server (opens `index.html`)
- Build distributable bundles with `npm run build` (emits `dist/waymark-js.{js,umd.cjs,css}`)

## Instance API
Detailed constructor options and methods are documented in [`README.md`](README.md#instance-api), covering instantiation, configuration, and GeoJSON helpers (`loadGeoJSON`, `toGeoJSON`, `clearGeoJSON`).

## Documentation
- Primary guide at `docs/v2/1.index.md` (installation, quick start, CDN usage)
- Instance configuration reference at `docs/v2/2.instances.md` (map options, type definitions, basemaps, MapLibre passthrough)
