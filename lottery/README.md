# Introduction
This is a static website. It compiles a set of assets into standard html.
We flare that html using tailwind css for styling and alpine.js for some basic logic.

We used this repo as a starter: https://github.com/gregwolanski/eleventy-tailwindcss-alpinejs-starter

## Getting Started

### 1. Install the dependencies

```
npm install
```

### 2. Update the dependencies

```
npm update
```

### 3. Build the project to generate the first CSS

This step is only required the very first time.

```
npm run build
```

### 4. Run Eleventy

```
npm run start
```

### 5. Staging

```
wrangler preview --watch
```

You'll need to have wrangler installed `npm i @cloudflare/wrangler -g` and configured to access the Cloudflare account.
Once installed run `wrangler config` from the command line to setup wrangler.
You should also create a `wrangler.toml` file with the following;

```
name = "hillcroft-site"
type = "webpack"
account_id = from cloud flare
workers_dev = true

[site]
bucket = "./_site"
entry-point = "workers-site"

[env.production]
route = "https://lottery.hillcroftlacrosse.com/*"
zone_id = from cloudflare
workers_dev = false
```

### 6. Deploy Production

```
npm run build && wrangler publish --env production
```

Within cloudflare we have set environment variables on the worker.

## Author

[Tom Ridings](https://thomasridings.com)

## License

MIT

See `LICENSE` for more information.
