# Primal Sheets

A Turborepo monorepo containing a React Vite web app and a Hono API server.

## What's inside?

This Turborepo includes the following apps:

### Apps

- `web`: A [React](https://react.dev/) + [Vite](https://vite.dev/) web application
- `api`: A [Hono](https://hono.dev/) API server

### Packages

Shared packages can be added to the `packages/` directory.

### Utilities

This Turborepo uses:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for linting and formatting

## Getting Started

### Install Dependencies

```sh
bun install
```

### Build

To build all apps and packages:

```sh
bun run build
```

To build a specific app:

```sh
bun run build --filter=web
bun run build --filter=api
```

### Develop

To develop all apps and packages:

```sh
bun run dev
```

To develop a specific app:

```sh
bun run dev --filter=web
bun run dev --filter=api
```

The web app will be available at `http://localhost:5173` (Vite default port).
The API server will be available at `http://localhost:3001`.

### Lint

To lint all apps and packages:

```sh
bun run lint
```

To fix linting issues:

```sh
bun run lint:fix --filter=web
bun run lint:fix --filter=api
```

### Format

To format all apps and packages:

```sh
bun run format
```

### Type Check

To type check all apps and packages:

```sh
bun run typecheck
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
