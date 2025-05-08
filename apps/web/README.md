# Met Art Gallery

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Fast Performance: Achieves instant load times through efficient data fetching and caching strategies, leveraging Vercel’s Edge Network and Tanstack Query’s client-side caching.
- Cutting-Edge Tech Stack: Built with Next.js 15, utilizing the latest features for performance and developer experience.
- Parallel Streaming: Implements React Suspense and React Server Components (RSC) for seamless, incremental rendering of UI components.
- End-to-End Type Safety: Ensures robust type safety across the application using TypeScript and ORPC for type-safe API interactions.
- Fully-Typed ORPC RPC Server: Addresses CORS issues in client requests by using a type-safe ORPC server, configured with a relative /rpc path to ensure same-origin requests.
- SearchParams for Analytics and State: Utilizes searchParams for link sharing, analytics tracking, and isomorphic state management, enabling persistent filter states in URLs.
- Infinite Scrolling: Implements infinite scrolling using Tanstack Query’s useSuspenseInfiniteQuery hook, providing a smooth user experience for browsing large datasets.
- Virtualized List (WIP): A work-in-progress feature to optimize rendering performance for large lists using Tanstack Virtual, planned for future enhancements.
- Responsive UX: Delivers an excellent user experience across all screen sizes with a responsive 3-column grid layout and intuitive filter sidebar.
- Deployed to Vercel: Hosted on Vercel for reliable, scalable deployment with automatic scaling and domain management.
