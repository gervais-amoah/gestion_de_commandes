# Order Management Dashboard

A production-ready order management dashboard built with Next.js 16, TypeScript, and shadcn/ui.

## Architecture Overview

This is a client-side dashboard using Next.js App Router with client components for the order management interface. The architecture follows a feature-based structure with clear separation of concerns: API layer (`lib/api.ts`), custom hooks for data management (`hooks/useOrders.ts`), reusable UI components (`components/`), and type definitions (`lib/types.ts`). Data is served from an in-memory mock API with simulated latency for realistic behavior.

## State Management

TanStack Query handles all server state with a centralized query client. The `useOrders` custom hook manages pagination state, search filters, and status mutations. Optimistic updates provide instant UI feedback when changing order status, with automatic rollback on failure. Client state (selected order, modal visibility) is managed locally with React hooks.

## Performance Optimization Strategy

TanStack Table provides a structured, highly optimized rendering surface for order data, supporting large datasets without performance degradation. Search is debounced (500ms) to reduce unnecessary API calls. `React.memo` isolates individual table cell components to prevent unnecessary re-renders during state changes. TanStack Query caches responses with 30-second stale times, and pagination handles data in standardized page chunks to simulate a real backend limit.

## Key Trade-offs Made Within 60-min Timeframe

- **In-memory data** instead of a real database/API for rapid prototyping
- **Client-side rendering** over SSR to avoid hydration complexity with dynamic data
- **Mock data generation** (1000 orders) balancing realism with performance
- **Simplified error boundaries** without a dedicated fallback UI library
- **Basic accessibility** meeting WCAG AA standards without full audit testing

---

## V2 Improvements (Current Branch)

This version serves as an improved proof-of-concept over the initial v1 found on the `dev` branch.

**UI/UX Overhaul:**

- Replaced the vertical list of order cards with a standard data table (`@tanstack/react-table`). This provides a much more familiar and scannable interface for order management, allowing users to compare data vertically and visually parse large volumes of information faster.
- Refined the overall UI styling, spacing, and component composition for a cleaner, more professional baseline.

**Feature Additions:**

- **Table Sorting:** Integrated column-level sorting (e.g., by Date, Total, Customer) directly into the table headers.
- **Enhanced Filtering:** Transitioned from basic filters to dynamic status badges that display real-time record counts (e.g., "En cours (12)").
- **Global Search:** Added a unified search bar capable of querying across Order ID, Customer Name, and Email simultaneously.

**Localization Preparation:**

- Core UI copy (headings, buttons, table headers, empty states) has been transitioned to French to align with the target production environment requirements.

---

**Assistant**: Built with assistance from DeepSeek web (deepseek.com)
