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
- To run tests after a change, use npm test. This includes typechecking so you can fix up typing issues.

## Engineering Practices

The user follows **Extreme Programming (XP)** principles with strong emphasis on:

### Test-Driven Development (TDD)
- **Outside-in, double-loop TDD** (Acceptance Test Driven Development)
- Start with browser-level acceptance tests using Playwright
- Work backwards from assertions to define necessary actions and arrangements
- Red → Green → Refactor cycle with minimal implementations
- Production code is NEVER written without a failing test first
- When working on a new feature / application where no implementation or structure exists yet, I'm happy to have a high-level test drive out the most basic end-to-end implementation (a really thin vertical slice only) and, once that's working, refactor to extract separate responsibilities and retrofit unit tests. From this point on, I'm able to use TDD on the individual units.
- **Never change production code without having a failing test that drives the change**
- To make a test pass, implement the minimum code required. Do not add additional capabilities or alternative execution paths. Implementing the minimum code forces us to write another test to proceed further. This ensures we grow high test coverage alongside our production code.

### Test Quality
- Test code maintained with same quality as production code
- Real browser testing preferred over mocked/unit tests for smoke tests
- Iterative test development - start with simplest assertions
- If a test is failing, think hard about whether editing the test is the right thing to do. If the code you wish to add to the test is actually a responsibility of the system under test, then consider how that behaviour can be implemented in the SUT instead.
- **NEVER change assertions just to make tests pass** - assertions represent the desired outcome. When tests fail, first fix the production code to achieve the desired behavior. Only consider changing test setup/mocking if we haven't properly established the conditions for the scenario we're actually testing.

### Development Approach
- Iterative and incremental development
- Make many small commits as waypoints for reverting if needed
- **CRITICAL: Always run tests before committing**
- Always ensure tests pass before committing (keep HEAD green)
- Commit frequently to enable continuous delivery readiness
- Use feature flags for work-in-progress features that need multiple commits
- Capture and document engineering practices as they emerge
- Critique changes to learn and refine approach
- Extract principles from experience
- Always run a test after editing it

### Test Execution
- Always run tests in a way that avoids a blocking process afterwards. This is important so that you (Claude) can return a result quickly rather than waiting indefinitely.

### Spikes
- When facing significant implementation uncertainty, create a **spike**
- Spikes are throwaway experiments to answer specific technical questions
- Time-boxed research with disposable code to reduce risk
- Document findings to inform production implementation
- Example: "How do you export data to Google Sheets from a webpage?"

## Architecture

**Current stack:**
- React + TypeScript
- Vite for build/dev server
- Playwright for acceptance testing

### Architectural Principles
- I leverage Hexagonal Architecture ("Ports & Adapters") wherever possible to keep domain code and external IO concerns (aka "infrastructure code") separate.

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

## Code Philosophy
- Don't write overly defensive code where the calling code could never put the called code in the state being defended against.