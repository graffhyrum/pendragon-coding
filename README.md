# Pendragon Coding

This is a porfolio website made with Astro.

[![Netlify Status](https://api.netlify.com/api/v1/badges/27933604-1314-4903-bdaa-8e13c34e8122/deploy-status)](https://app.netlify.com/sites/pendragon-coding/deploys)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Bun

## Hot Dev

```bash
bun run dev
```

## Built with 

- [Astro](https://astro.build/)
- [Bun](https://bun.sh/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)


## Updates and Versioning

This project uses [Changesets](https://www.npmjs.com/package/@changesets/cli) to manage versioning and changelogs.
### Using Changesets

Changesets is a tool for managing versioning and changelogs in a project. Follow these steps to use Changesets in your project:

#### Installation

First, install Changesets as a development dependency:

```bash
bun add -d @changesets/cli
```

#### Creating a Changeset

To create a new changeset, run the following command and follow the prompts:

```bash
bunx changeset
```

This will generate a markdown file in the `.changeset` directory describing the changes.

#### Versioning and Changelog

To update the version and changelog based on the changesets, run:

```bash
bunx changeset version
```

This will update the `package.json` and create/update the `CHANGELOG.md` file.

#### Publishing

To publish the package, use:

```bash
bunx changeset publish
```

This will publish the package to the registry and update the version.

#### Summary

1. **Install Changesets**: `bun add -d @changesets/cli`
2. **Create a Changeset**: `bunx changeset`
3. **Update Version and Changelog**: `bunx changeset version`
4. **Publish**: `bunx changeset publish`

For more details, refer to the [Changesets documentation](https://github.com/changesets/changesets).

## Authors

- [Joshua Pendragon](https://github.com/graffhyrum)