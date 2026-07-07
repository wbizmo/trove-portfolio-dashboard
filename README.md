# Trove

A responsive investment portfolio dashboard built for the Trove Frontend Engineer Assessment using React, TypeScript and Vite.

**Live Demo:** https://wbizmo-trove.vercel.app

---

# Running Locally

## Prerequisites

- Node.js 20+
- npm

## Installation

```bash
git clone https://github.com/wbizmo/trove-portfolio-dashboard.git
cd trove-portfolio-dashboard
npm install
```

## Development

```bash
npm run dev
```

The application will start on your local development server.

## Production Verification

Before every commit and deployment I verified the project using:

```bash
npm run lint
npm run build
```

Linting was treated as part of the engineering workflow rather than an optional step. Several implementation decisions were adjusted based on lint feedback to keep the project production-ready.

---

# Approach & Architectural Decisions

The application was intentionally kept simple while still following production-oriented engineering practices.

## Overall Architecture

The project follows a feature-based architecture.

```
src
├── assets
│   └── data
├── components
│   └── layout
├── context
├── features
│   ├── auth
│   └── dashboard
├── services
├── styles
├── types
└── utils
```

Each folder has a single responsibility.

- **features** contain feature-specific UI.
- **components** contain shared layout components.
- **services** provide data.
- **types** define application contracts.
- **utils** contain reusable formatting helpers.
- **context** manages application-wide state.

This separation keeps responsibilities clear and allows another engineer to understand and extend the project quickly.

---

## Engineering Decisions

### React

React was chosen because it provides predictable component composition and state management for dashboard-style applications.

---

### TypeScript

TypeScript improves maintainability through static typing and better editor support while reducing runtime mistakes.

---

### Vite instead of Next.js

The assessment focuses on a client-side dashboard.

Features such as Server-Side Rendering, API Routes and Image Optimization were unnecessary, making Vite the simpler and more appropriate choice.

---

### Feature-Based Architecture

Instead of organising files by file type, the application is organised by feature.

This keeps related components, styles and logic together and makes future maintenance easier.

---

### Small Components

The dashboard is intentionally split into smaller components such as:

- Sidebar
- TopBar
- HoldingsPanel
- TransactionsPanel

This avoids a single large dashboard component and makes the code easier to navigate.

---

### Business Logic Outside Components

Portfolio calculations do not live inside JSX.

The UI receives already-prepared data and simply renders it.

Keeping calculations outside components improves readability, testing and reuse.

---

### Service Layer

Although the assessment provides local JSON data, the UI never consumes that JSON directly.

A dedicated service layer sits between the UI and the data source.

This mirrors how a real frontend would communicate with a backend API and allows the data source to be replaced later without changing the UI.

---

### Simulated Async API Calls

The service returns portfolio data asynchronously instead of immediately returning JSON.

This mimics a real API request while keeping the assessment completely self-contained.

---

### Single Source of Truth

The supplied `portfolio_data.json` remains the only source of portfolio information.

Rather than introducing additional mock datasets, the dashboard adapts itself to the supplied data.

---

### Derived Portfolio Metrics

Portfolio totals are calculated from the holdings instead of relying solely on the supplied summary values.

This ensures the dashboard remains accurate even if the underlying holdings change.

---

### React Context

React Context manages authentication state.

A larger state management library such as Redux would introduce unnecessary complexity for the requirements of this assessment.

---

### Context + localStorage

Context manages the active application state.

localStorage is used only to persist authentication between page refreshes.

This keeps responsibilities clear while avoiding duplicated state.

---

### CSS Modules

CSS Modules provide locally scoped styles without introducing additional tooling or frameworks.

This also demonstrates CSS ability as required by the assessment.

---

### No UI Library

No component library was used.

Every layout, card, filter, button and responsive behaviour was implemented manually.

---

### Wireframe-First Development

The provided wireframe was treated as the primary design reference.

Additional UI improvements were introduced only where the assessment left implementation decisions open.

---

### Fixed Desktop Sidebar

The desktop sidebar remains fixed while dashboard content scrolls independently.

This provides consistent navigation without sacrificing usable content space.

---

### Mobile Drawer

On smaller screens the sidebar becomes a slide-out drawer, improving usability while preserving screen space.

---

### Pagination Instead of Nested Scrollbars

Holdings and Orders use pagination instead of internal scrollbars.

Nested scrolling often creates a poor user experience, whereas pagination keeps both sections compact and predictable regardless of dataset size.

---

### Five Items Per Page

Five items are displayed per page for both Holdings and Orders.

This keeps both sections visually balanced while allowing the layout to scale gracefully.

---

### Data-Driven Pagination

Pagination adapts automatically to the amount of data available rather than assuming a fixed number of records.

---

### Search & Filter Reset Pagination

Changing search text or filters automatically returns the user to the first page.

This prevents users from landing on empty pages after filtering.

---

### Dynamic Filters

Sector filters are generated directly from portfolio data rather than being hardcoded.

New sectors automatically appear without requiring code changes.

---

### Inline SVG Icons

Inline SVG icons are used instead of an external icon package.

This keeps dependencies minimal while allowing complete control over sizing and styling.

---

### Browser Title & Favicon

The browser title was simplified to **Trove**, matching the assessment branding.

A lightweight SVG favicon was added to improve the production feel of the application.

---

### Lint-First Workflow

Every sprint concluded with:

```bash
npm run lint
npm run build
```

Linting was treated as part of the development process rather than a final cleanup task.

---

### Deployment

The application is deployed on Vercel.

Vercel provides a straightforward deployment workflow for Vite applications and makes it easy to verify the production build.

---

# Handling Intentional Data Quirks

The assessment intentionally includes inconsistent portfolio data.

Rather than ignoring those cases, the application makes them visible to the user while ensuring calculations remain accurate.

### NVIDIA (Current Price = 0)

- Displayed in Holdings.
- Excluded from Asset Allocation.
- Listed in the allocation disclosure with the reason for exclusion.

---

### Disney (0 Shares)

- Displayed in Holdings.
- Excluded from Asset Allocation.
- Listed in the allocation disclosure because it has no active position.

---

### Asset Allocation

Only holdings with valid market value contribute to allocation percentages.

Holdings excluded from allocation remain visible elsewhere in the dashboard to avoid hiding portfolio information.

---

### Pending & Failed Orders

Transactions retain their supplied status.

Pending and Failed transactions are visually differentiated from Completed transactions instead of being treated as errors.

---

### Allocation Transparency

Instead of silently excluding invalid holdings, the dashboard explicitly informs the user which holdings were excluded and why.

This keeps calculations mathematically correct while remaining transparent.

---

# What I Would Improve With More Time

- Replace the local JSON source with a real backend API.
- Replace the simulated portfolio chart with historical market performance data.
- Add sorting options for Holdings and Orders.
- Improve retry behaviour and user feedback for failed API requests.
- Add unit tests for portfolio calculation logic.