# Rotary

A web application for generating annual rotas for doctors in geriatrics wards. Built with React and TypeScript, using test-driven development with Playwright for browser-level acceptance testing.

## Development

### Prerequisites
- Node.js (latest LTS recommended)
- npm

### Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browsers (first time only)
npx playwright install

# Start development server
npm run dev

# Run acceptance tests
npm test
```

### Development Workflow

This project follows **Test-Driven Development (TDD)** with an outside-in approach:

1. Write a failing acceptance test (browser-level with Playwright)
2. Implement minimal code to make the test pass
3. Refactor if needed
4. Repeat with next assertion

### Available Commands

- `npm run dev` - Start development server
- `npm test` - Run acceptance tests (starts dev server automatically)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Project Status

Early development phase. Currently implements:
- Basic React app with "Generate Rota" button
- Playwright acceptance testing setup
- TypeScript configuration

See `CLAUDE.md` for detailed engineering practices and architecture decisions.
