# pvNXT Quote (quote.pvnxt.com)

Instant solar proposals for EPCs. The EPC fills in a pre-priced form, previews an A4 proposal, then shares it by link, WhatsApp, email or PDF. Plain HTML, CSS and JS, no build step. Styling follows help.pvnxt.com (light theme, Manrope, Public Sans, IBM Plex Mono).

## Run locally

**Quickest:** open `dist/pvnxt-quote.html`. It is the whole app in one file (CSS, JS and data inlined), so it works by double-click and in any preview pane. If you open `index.html` alone in a preview pane, the `css/` and `js/` files will not load; use the dist file there.

**As a project:** the multi-file version loads `data/*.json` with `fetch`, so serve the folder.

```
cd pvnxt-quote
python3 -m http.server 8080
```
Open http://localhost:8080. On Vercel, deploy the folder as a static site.

Preview the other list states by adding a hash: `#error`, `#empty`. Loading shows for about 0.7 s on every load.

After editing any source file, rebuild the single file with `node build.js`.

## Structure

```
index.html          page shell and header
build.js            builds dist/pvnxt-quote.html (single file)
dist/               built single-file app
css/portal.css      list, form, chips, buttons (tokens from the help portal)
css/proposal.css    A4 pages and print rules
js/api.js           the only data layer: catalog, list, save, email, share and pay URLs
js/calc.js          price, GST, subsidy, savings maths and validation
js/app.js           views: quotes list, form, proposal preview, share actions
data/catalog.json   brands, prices, state tariffs, DISCOMs, EPC and bank details
data/quotes.json    three sample quotes
```

## Binding your API

Everything goes through `js/api.js`. Replace the body of each method and keep the return shapes.

| Method | Expected result |
|---|---|
| `catalog()` | Object shaped like `data/catalog.json`. Prices there are placeholders. |
| `list()` | Array of quote objects (fields below). |
| `save(q)` | Persist a quote. Called when it is shared (status moves Draft to Sent). |
| `email(q)` | Your email action. The Email button calls this and nothing else. |
| `shareUrl(q)` | Public customer link for the quote. |
| `payUrl(q)` | Payment gateway link for the booking amount. Shown on the proposal when "Include online payment link" is on. |

Quote fields: `id, status (Draft|Sent|Viewed|Booked), date, name, phone, email, addr, state, discom, consumer, units, load, tariff, type, kwp, mod, modules, inv, struct, dc, dcc, ac, acc, pits, la, battery, batKwh, clean, disc, addon, over, ssub, csub, ms[4], pay`. Catalog ids (`mod`, `inv`, `struct`, `dcc`, `acc`) refer to ids in `catalog.json`.

## How the numbers are worked out (`js/calc.js`)

- Modules = target kWp x 1000 / module Wp, rounded up. Actual size = modules x Wp.
- Inverter = smallest one with kW at least 0.9 x plant size. DC cable = max(20, 7 m per kWp). All editable.
- List price = modules + inverter + structure + cables + earthing and LA + installation (+ battery, + cleaning). "List price override" replaces it.
- GST = `catalog.gst` (8.9% composite, from the Y2 sample quote).
- Central subsidy (domestic, not off-grid) = 30,000 per kW for the first 2 kW, 18,000 for the third kW, capped at 78,000. 2.88 kWp gives 75,840.
- State subsidy is an input, defaulting from `catalog.states[state].sub`.
- Savings = min(units generated, units used) x tariff, with 120 units per kWp per month. Payback = net cost / yearly savings.
- Sharing is blocked until name, phone, modules and milestones (total 100%) are valid.

## Share actions

- **Download PDF:** opens the browser print dialog; choose Save as PDF. Print CSS gives three A4 pages.
- **WhatsApp:** uses the phone's share sheet where available, otherwise wa.me with the quote link.
- **Email:** calls `api.email(q)`.
- **Copy link:** copies `api.shareUrl(q)`.

## Known limits

- Quotes live in memory until `api.save` is connected, so a refresh loses new ones.
- No sign-in, no EPC settings screen, no logo upload; EPC details come from `catalog.json`.
- The proposal has no annexure page and no QR code. The cover has no photo.
- WhatsApp shares a link, not the PDF file.
- Prices, brands, tariffs and bank details in `data/` are placeholders and must be replaced.
- Tested with a scripted DOM run (list, filters, form, auto-fill, validation, preview, copy link, WhatsApp, email, print, error and empty states, CSS class coverage). Visual layout was not checked in a real browser, so do a pass on desktop and a phone before launch.
