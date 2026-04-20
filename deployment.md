# Deployment Guide — Author Orbit

This project is a static single-page React app built with **Vite**. `npm run build` produces a fully static bundle in `dist/` that can be served from any static host or CDN. No backend is required — the app calls the public [Open Library API](https://openlibrary.org/developers/api) directly from the browser.

---

## 1. Prerequisites

| Tool    | Version         | Notes                                    |
| ------- | --------------- | ---------------------------------------- |
| Node.js | ≥ 18.0          | `node -v` to check                       |
| npm     | ≥ 9.0           | Ships with Node 18+                      |
| Git     | any recent      | Only needed for platforms that deploy from a repo |

---

## 2. Local build & smoke test

```bash
# install dependencies
npm install

# run the dev server (http://localhost:5173)
npm run dev

# produce a production bundle
npm run build

# preview the production bundle locally (http://localhost:4173)
npm run preview
```

The build output lives in `dist/`. Everything it needs is in that folder — `index.html`, hashed JS/CSS assets, and any referenced static files.

**Sanity checks before deploying:**

- Open `npm run preview`, search for an author (e.g. `George R R Martin`), and confirm book covers load from `covers.openlibrary.org`.
- Open the browser devtools Network tab and verify the call to `openlibrary.org/search.json?author=...` returns 200.
- Confirm no console errors.

---

## 3. Deploy to Vercel (recommended)

Vercel auto-detects Vite.

**Option A — via the web UI**

1. Push this repo to GitHub / GitLab / Bitbucket.
2. Go to <https://vercel.com/new> and import the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output dir: `dist`.
4. Click **Deploy**.

**Option B — via CLI**

```bash
npm i -g vercel
vercel             # first run links the project
vercel --prod      # production deploy
```

No environment variables are required.

---

## 4. Deploy to Netlify

**Option A — drag & drop**

1. Run `npm run build`.
2. Drop the `dist/` folder onto <https://app.netlify.com/drop>.

**Option B — Git integration**

1. Push the repo and connect it at <https://app.netlify.com>.
2. Build command: `npm run build`. Publish directory: `dist`.

**SPA rewrite (only matters if you later add client-side routing).** Create `public/_redirects` containing:

```
/*  /index.html  200
```

---

## 5. Deploy to GitHub Pages

GitHub Pages serves from a subpath (`/<repo-name>/`), so Vite needs `base` set.

1. Edit `vite.config.js`:

   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/author-orbit/', // replace with your repo name
   });
   ```

2. Build and publish:

   ```bash
   npm run build
   npx gh-pages -d dist
   ```

3. In the repo's **Settings → Pages**, set the source to the `gh-pages` branch.

---

## 6. Deploy to Cloudflare Pages

1. Connect the repo at <https://dash.cloudflare.com/?to=/:account/pages>.
2. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
3. Click **Save and Deploy**.

---

## 7. Self-hosted static server (Nginx)

If you're serving the build yourself:

```nginx
server {
  listen 80;
  server_name authororbit.example.com;
  root /var/www/author-orbit/dist;
  index index.html;

  # cache hashed assets aggressively
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # SPA fallback (safe even without client routing)
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

Deploy flow:

```bash
npm run build
rsync -az --delete dist/ user@host:/var/www/author-orbit/dist/
```

---

## 8. Deploy to Docker (optional)

`Dockerfile`:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

Build & run:

```bash
docker build -t author-orbit .
docker run -p 8080:80 author-orbit
```

---

## 9. Environment variables

None required. The Open Library API is public and needs no API key. If you later add any, prefix them with `VITE_` so Vite exposes them to the client:

```bash
# .env.production
VITE_SOMETHING=value
```

Access via `import.meta.env.VITE_SOMETHING`.

---

## 10. Troubleshooting

| Symptom                                   | Fix                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| Blank page on GitHub Pages                | `base` in `vite.config.js` doesn't match the repo name                              |
| 404 on refresh for a sub-route            | Add SPA fallback (`/* → /index.html`) — see §4 and §7                               |
| Book covers missing                       | `covers.openlibrary.org` may rate-limit or 404 a specific cover — expected; UI degrades to a text placeholder |
| CORS error on the search call             | Open Library allows cross-origin GETs; check you're not going through an HTTPS proxy that strips CORS headers |
| `npm run build` fails with memory errors  | `NODE_OPTIONS=--max-old-space-size=4096 npm run build`                              |

---

## 11. Post-deploy checklist

- [ ] Landing page loads under 1.5s on a cold cache
- [ ] Search debounces (no request fires on every keystroke)
- [ ] Loading skeletons visible during fetch
- [ ] Error state renders when offline (easy to test: DevTools → Network → Offline)
- [ ] Covers load from `covers.openlibrary.org`
- [ ] No console errors or warnings
