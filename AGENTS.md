# AGENTS.md

## Commands
- **Build**: `bun run build` (includes type checking)
- **Lint**: `bun run lint` (Biome auto-fix)
- **Format**: `bun run format` (Biome)
- **Check**: `bun run check` (format + lint)
- **Test all**: `bun run test`
- **Test single**: `bun test tests/filename.test.ts`
- **Test watch**: `bun run test:watch`
- **Test coverage**: `bun run test:coverage`
- **Check everything**: `bun vet` (format + lint + test)

## Code Style
- **Indentation**: Tabs
- **Quotes**: Single quotes for JS/TS
- **CSS**: Disabled formatting (Tailwind classes)
- **TypeScript**: Strict mode, path aliases `@assets/*`
- **Imports**: `import type` for interfaces, organize with Biome
- **Testing**: Bun test runner, `tests/*.test.ts` files
- **Images**: WebP format
- **Classes**: Revealing modules, no ES6 classes
- **Comments**: None unless requested
- **Error handling**: Standard try/catch, no custom patterns

## Development Notes

- The site uses a custom green color scheme (`bg-green-950`, `text-green-*`)
- HTMX is included for potential interactivity
- Images are processed through Astro's Image component for optimization
- The project uses Changesets for version management and changelog generation
- TypeScript paths are configured for easy asset imports
- Biome handles all code quality checks instead of separate ESLint/Prettier setup
- Tests are written using Bun's built-in test runner with the `bun:test` module
- Unit test files should use the `.test.ts` extension
- To be able to use bun, run `npm install -g bun`, then check that it is installed with `bun --version`, and , if
  necessary, if you've installed Bun but are seeing a command not found error, you may have to manually add the
  installation directory (~/.bun/bin) to your PATH.
- Generate a changeset entry for each unit of work completed.

## GitHub CLI Usage
- **PR Description**: Use `--body-file <file>` to set PR descriptions with markdown content. Create a markdown file first, then use `gh pr edit <number> --body-file <file>` for proper formatting. Verify the description was applied correctly with `gh pr view <number>`, then clean up the markdown file. 
