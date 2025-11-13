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
