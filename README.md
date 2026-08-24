# Order Management Dashboard

A production-ready order management dashboard built with Next.js 14, TypeScript, and shadcn/ui.

## Architecture Overview

This is a client-side dashboard using Next.js App Router with client components for the order management interface. The architecture follows a feature-based structure with clear separation of concerns: API layer (`lib/api.ts`), custom hooks for data management (`hooks/useOrders.ts`), reusable UI components (`components/`), and type definitions (`lib/types.ts`). Data is served from an in-memory mock API with simulated latency for realistic behavior.

## State Management

TanStack Query handles all server state with a centralized query client. The `useOrders` custom hook manages pagination state, search filters, and status mutations. Optimistic updates provide instant UI feedback when changing order status, with automatic rollback on failure. Client state (selected order, modal visibility) is managed locally with React hooks.

## Performance Optimization Strategy

React Virtuoso provides virtualized rendering for the order list, supporting large datasets without performance degradation. Search is debounced (300ms) to reduce unnecessary API calls. React.memo optimizes OrderCard and OrderFilter components. TanStack Query caches responses with 30-second stale times, and pagination loads 10 orders at a time with infinite scroll or load-more functionality.

## Key Trade-offs Made Within 60-min Timeframe

- **In-memory data** instead of a real database/API for rapid prototyping
- **Client-side rendering** over SSR to avoid hydration complexity with dynamic data
- **Mock data generation** (50 orders) balancing realism with performance
- **Simplified error boundaries** without a dedicated fallback UI library
- **Basic accessibility** meeting WCAG AA standards without full audit testing

---

**Assistant**: Built with assistance from DeepSeek web (deepseek.com)
