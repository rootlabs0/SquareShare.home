# Architecture

## Framework Overview
Squareshare.to is built using **Next.js (App Router)**. This provides a modern, fast, and SEO-friendly foundation. We utilize Server Components where possible for performance, and Client Components strictly when interactivity or animations (e.g., Framer Motion) are required.

## Deployment Strategy
We deploy to **Cloudflare Pages** using the `@cloudflare/next-on-pages` adapter.
- **Edge Runtime**: The application runs entirely on Cloudflare's global edge network, ensuring ultra-low latency worldwide.
- **Limitations**: We must adhere to edge runtime constraints. Node.js native APIs (like `fs` or `path`) are not available. All server-side code must be edge-compatible.

## Database Integration
**Supabase** is used exclusively for the `waitlist_leads` email table.
- **Connection Flow**: The client submits an email to a Next.js API Route (Edge Function). The API route validates the payload and inserts the record into Supabase using the Supabase JS Client over REST.
- **Security**: Supabase Row Level Security (RLS) is configured to only allow inserts via a secure service role key or anon key depending on the setup, keeping our endpoints secure.

## Core Principles
- **Simplicity**: Avoid over-engineering. Stick to standard Next.js patterns.
- **Consistent Data Flow**: Client -> Edge API -> Supabase. Keep state minimal.
- **Fast Iteration**: The architecture is designed to allow rapid prototyping and deployment.
