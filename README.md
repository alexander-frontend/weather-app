# Weather app

Targer: Implementation of a weather application using the API https://openweathermap.org/.
Without using css frameworks, ui libraries.

## Setup

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Compile and Hot-Reload for Development

Make sure to install the dependencies:

```bash
# npm
npm run dev
```

## API Keys

This project requires API keys to access two third-party services: OpenWeatherMap and Mapbox. These keys are essential for specific functionalities within the application. Below are instructions on how to obtain and use these keys.

## OpenWeatherMap API Key (VITE_API_KEY)

The OpenWeatherMap API key is used for retrieving weather information. To use this key, follow these steps:

1. Sign up on the OpenWeatherMap website.

2. Obtain your API key.

3. Set it in the VITE_API_KEY variable in your project's .env file.

Example .env file:

```bash
VITE_API_KEY=YOUR_OPENWEATHERMAP_API_KEY
VITE_API_URL=https://api.openweathermap.org/data/2.5
```

## Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
