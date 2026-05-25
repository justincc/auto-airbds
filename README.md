An experimental website for collecting, processing and publishing AI-performed AIRBDS assessments.

## Infrastructure

- **Cloudflare Pages** — hosting and serverless functions (Pages Functions) for the API endpoints (`POST /api/upload`, `GET /api/entries`)
- **Cloudflare KV** — persistent key-value store shared across all function instances
- **React** — frontend SPA built with TypeScript
- **Vite** — build tool and dev server

## Local testing

```bash
# Install dependencies
npm install

# Build the frontend
npm run build

# Start the local preview server with KV support (includes API functions)
npx wrangler pages dev dist --kv=UPLOADS

# In another terminal, upload JSON:
curl -X POST http://localhost:8788/api/upload \
  -H "Content-Type: application/json" \
  -H "X-API-Key: auto-airbds-dev-key" \
  -d '{"your":"json"}'

# Open http://localhost:8788 to view entries
```

The default port is `8788`. Use `--port <number>` to change it.

For local development with KV, start the server with:
```bash
npx wrangler pages dev dist --kv=UPLOADS
```

### Production KV setup

1. In the Cloudflare Dashboard, go to **Workers & Pages** → **KV** → **Create namespace** → name it `auto-airbds`
2. Go to your Pages project → **Settings** → **Functions** → **KV namespace bindings** → **Add binding**
   - Variable name: `UPLOADS`
   - KV namespace: select `auto-airbds`

A test upload script is available at `scripts/test-upload.sh`:

```bash
./scripts/test-upload.sh
```

## Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on changes)
npm run test:watch
```
