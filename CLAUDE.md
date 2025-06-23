# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A frontend-only web application for generating annual rotas for doctors in a geriatrics ward. The app generates Google Sheets-compatible output for rota consumption while avoiding backend infrastructure, costs, and security concerns.

**Current Status**: Early development using test-driven, outside-in approach.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing
- `npx playwright test` - Run acceptance tests in headless browser
- `npx playwright test --ui` - Run tests with UI mode
- `npx playwright show-report` - Open last test report

## Engineering Practices

The user follows **Extreme Programming (XP)** principles with strong emphasis on:

### Test-Driven Development (TDD)
- **Outside-in, double-loop TDD** (Acceptance Test Driven Development)
- Start with browser-level acceptance tests using Playwright
- Work backwards from assertions to define necessary actions and arrangements
- Red → Green → Refactor cycle with minimal implementations
- Production code is NEVER written without a failing test first

### Test Quality
- Test code maintained with same quality as production code
- Real browser testing preferred over mocked/unit tests for smoke tests
- Iterative test development - start with simplest assertions

### Development Approach
- Iterative and incremental development
- Make many small commits as waypoints for reverting if needed
- Always ensure tests pass before committing (keep HEAD green)
- Commit frequently to enable continuous delivery readiness
- Use feature flags for work-in-progress features that need multiple commits
- Capture and document engineering practices as they emerge
- Critique changes to learn and refine approach
- Extract principles from experience

## Architecture

**Current stack:**
- React + TypeScript
- Vite for build/dev server
- Playwright for acceptance testing

**Data Flow:**
- Generate rota data in memory
- Display in familiar Google Sheets table format
- Export capability for data backup/sharing

## Key Requirements

- Annual rota starting first Monday in April
- Ward structure: "CMU A" with front/back week columns
- Hard-coded doctors: AB, CD, DE
- Random assignment (constraints to be added later)
- Google Sheets export format compatibility

## Development Workflow

1. Write failing acceptance test (browser-level)
2. Implement minimal code to make test pass
3. Refactor if needed
4. Add next assertion iteratively
5. Document learnings in this file