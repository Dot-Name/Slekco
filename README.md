# Slekco — multi-brand marketplace

A production-shaped MERN e-commerce marketplace: **React + Vite + Tailwind CSS** on the front end,
**Node.js + Express + MongoDB (Mongoose)** behind a REST API. The client holds **no hardcoded
catalogue data** — every product, category, brand facet and order goes through the API.

---

## Design direction

A marketplace is plural, so the palette is too. Each of the six categories owns an accent colour, and
that colour follows the category everywhere: the nav dot, the category tile, the hairline on a product
card, the price badge, the glow behind a hero tile. The signature element is the **spectrum rail** — six
colour segments under the header, splitting sections and framing the footer.

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#14161A` | Text, primary buttons, footer |
| Canvas | `#F1F2F6` | Page background |
| Surface | `#FFFFFF` | Cards, inputs, sheets |
| Line | `#E4E6EB` | Borders and dividers |
| Brand | `#2F4BF0` | Focus rings, primary hover |
| Category accents | `#2F4BF0` `#D6246E` `#12876F` `#7A46E0` `#E08700` `#0E8FA8` | Electronics, Fashion, Home, Beauty, Fitness, Accessories |

**Type:** Bricolage Grotesque (display, used with restraint) · Instrument Sans (body) · IBM Plex Mono
(SKUs, counts, eyebrows — the tag-and-label vernacular of a shop floor).

Accessibility floor: visible keyboard focus everywhere, a skip link, `aria-live` on toasts and
quantity, labelled icon buttons, and `prefers-reduced-motion` respected globally.

---

## Getting started

**Requirements:** Node 18+ and MongoDB running locally (or a MongoDB Atlas connection string).

```bash
# 1 — install both apps
npm run install:all          # or: cd server && npm i   then   cd client && npm i

# 2 — configure the API
cp server/.env.example server/.env      # edit MONGO_URI / JWT_SECRET if needed

# 3 — load the demo catalogue (6 categories, 30 products, 2 users)
npm run seed

# 4 — run both apps in two terminals
npm run dev:server           # http://localhost:5000
npm run dev:client           # http://localhost:5173
```

Vite proxies `/api` to `http://localhost:5000`, so no CORS setup is needed in development.
For a deployed front end, set `VITE_API_URL` to the full API origin instead.

**Demo account:** `admin@slekco.com` / `admin123` (a customer account, `ananya@example.com` /
`test1234`, is seeded too).
**Working coupons:** `SLEK10` (10% off) and `WELCOME5` (5% off).

---

## Pages

| Route | What it does |
| --- | --- |
| `/` | Hero, value strip, category grid, brand rail, trending rail, promo banner, new arrivals |
| `/shop` | Grid, search, category + brand + price + rating filters, sorting, pagination |
| `/product/:slug` | Gallery, specs, quantity, add to cart, buy now, related products |
| `/cart` | Line items, quantity stepper, remove, coupons, savings and totals |
| `/checkout` | Validated address form, payment choice, posts a real order to the API |
| `/order/:orderNumber` | Order confirmation fetched back from the API |
| `/wishlist` | Saved items (ids on the device, products from the API) |
| `/account` | Sign in / register against `/api/users`, with validation |
| `/contact` | Contact form with client-side validation and error / success states |
| `/admin` | Admin console — dashboard, products, categories, orders, messages (admin accounts only) |

---

## Admin panel

Sign in at `/account` with an admin account and an **Admin** button appears in the header, or go
straight to **`/admin`**. The console is guarded by `RequireAdmin`: signed-out visitors are sent to
the sign-in page, and customer accounts get a plain explanation instead of a blank screen. The
server enforces the same rule independently — every admin endpoint runs `protect` + `adminOnly`, so
the UI guard is convenience, not security.

Seeded admin: **`admin@slekco.com` / `admin123`**.

| Screen | What you can do |
| --- | --- |
| Dashboard | Product / order / customer counts, revenue, low-stock list, latest orders, unread messages |
| Products | Search, filter by category or status, sort, publish/hide, edit, delete |
| Add / edit product | Full form: images, pricing, stock, highlights, specs, tags, visibility flags, live card preview |
| Categories | Create, edit and delete categories, including each one's accent colour |
| Orders | Search, filter by status, expand for items and address, change status |
| Messages | Read contact-form submissions and mark them read |

### Adding a product

1. **Admin → Products → Add product**
2. Fill in name, brand, category, short description, price and stock (these are validated).
3. **Images** — click *Upload images* to send files from your computer, or paste an image URL. The
   first image is the one used on cards. At least one is required.
4. Optionally add highlights, specifications, tags, a badge, and the *Featured* / *Trending* flags
   that control whether it appears in the homepage hero and trending rail.
5. Leave *Live on storefront* checked and press **Publish product**.

The product is written to MongoDB and served by the same `/api/products` endpoints the storefront
reads, so it shows up on the shop immediately — no rebuild, no restart. Uncheck *Live on storefront*
to keep something as a draft: it stays visible in the admin list and hidden everywhere else.

### Image uploads

Uploaded files are stored in `server/uploads/` and served at `http://localhost:5000/uploads/<file>`.
Limits: JPG, PNG, WebP, AVIF or GIF, up to 5 MB each, 6 per upload. For production, point the
storage at S3, Cloudinary or similar by swapping the disk storage in
`server/src/middleware/upload.js` — nothing else needs to change.

### Notes

- Product **slugs are generated once, from brand + name**, and do not change when you rename a
  product. That keeps existing links working; delete and recreate if you need a new URL.
- Deleting a category is refused while products still reference it — move those products first.
- Marking an order *delivered* also marks it paid.

---

## API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/products` | `q, category, brand, minPrice, maxPrice, rating, sort, page, limit, featured, trending` — returns items, pagination and brand/price facets |
| `GET` | `/products/trending` | Best sellers |
| `GET` | `/products/brands` | Brand list with counts and entry price |
| `GET` | `/products/:idOrSlug` | Single product, category populated |
| `GET` | `/products/:idOrSlug/related` | Same category or brand |
| `POST`/`PUT`/`DELETE` | `/products` | Admin only (Bearer token) |
| `GET` | `/categories` · `/categories/:slug` | Categories with live product counts |
| `POST` | `/orders` | Totals are **recalculated server-side**; stock is checked and decremented |
| `GET` | `/orders/:orderNumber` | Order lookup |
| `GET` | `/orders/mine` | Signed-in user's orders |
| `POST` | `/users/register` · `/users/login` · `GET /users/me` | JWT auth, bcrypt hashing |
| `POST` | `/contact` | Stores a support message |
| `GET` | `/admin/stats` | Dashboard counts, revenue, low stock, recent orders |
| `GET` | `/admin/products` | Admin product list — includes hidden products, filters by status |
| `POST` | `/admin/uploads` | Multipart image upload (field `images`, up to 6) → public URLs |
| `GET` | `/orders` | All orders, filterable by status and search term |
| `PATCH` | `/orders/:id/status` | Move an order through placed → packed → shipped → delivered |
| `PUT`/`DELETE` | `/categories/:id` | Edit or remove a category |
| `GET` | `/contact` · `PATCH /contact/:id/read` | Support inbox |

Sorting keys: `newest`, `popular`, `price-asc`, `price-desc`, `rating`.

Example:

```bash
curl "http://localhost:5000/api/products?category=fashion&sort=price-asc&limit=4"
curl "http://localhost:5000/api/products/aurex-nova-pro-wireless-headphones"
```

Every response is `{ success, ... }`; errors return `{ success: false, message, errors? }` with a
matching status code (400 validation, 401 auth, 404 missing, 409 duplicate).

---

## Collections

**products** — name, slug, sku, brand, category (ref), shortDescription, description, highlights[],
specs[{key,value}], images[], price, mrp, currency, stock, rating, numReviews, reviews[], tags[],
badge, isFeatured, isTrending, isActive, sold, timestamps. Virtuals: `discountPercent`, `inStock`.
Text index on name/brand/tags.

**categories** — name, slug, description, image, accent, icon, isActive, sortOrder, timestamps.
Virtual `productCount`.

**users** — name, email (unique), password (bcrypt, `select: false`), phone, role, addresses[],
wishlist[], timestamps.

**orders** — orderNumber (`SLK-XXXXXX`), user, customer{name,email,phone}, items[{product, name,
brand, image, price, quantity}], shippingAddress, paymentMethod, itemsTotal, discount, shipping,
total, couponCode, status, isPaid, paidAt, timestamps.

**messages** — name, email, subject, message, isRead, timestamps.

---

## Folder architecture

```
slekco/
├─ server/
│  └─ src/
│     ├─ config/db.js              Mongo connection
│     ├─ models/                   Product · Category · User · Order · Message
│     ├─ controllers/              One controller per resource
│     ├─ routes/                   Thin routers, mounted in routes/index.js
│     ├─ middleware/               asyncHandler · auth (JWT) · error handler
│     ├─ utils/token.js
│     ├─ seed/                     seed.js + categories.data.js + products.data.js
│     └─ uploads/                  (server/uploads) admin-uploaded product images
│     └─ index.js                  App bootstrap (helmet, cors, rate limit, morgan)
└─ client/
   └─ src/
      ├─ api/                      client.js (fetch wrapper) + one module per resource
      ├─ components/
      │  ├─ admin/                 AdminLayout, RequireAdmin, AdminHeader, ConfirmDialog
      │  ├─ ui/                    Button, Field, Icon, Rating, Drawer, Spectrum, Skeleton…
      │  ├─ layout/                Navbar, Footer, Layout, Logo, SearchBar
      │  ├─ product/               ProductCard, ProductGrid, ProductRail, FilterPanel, Gallery
      │  └─ home/                  Hero, CategoryGrid, BrandRail, PromoBanner, ValueStrip
      ├─ context/                  Catalog · Cart · Wishlist · Auth · Toast
      ├─ hooks/                    useApi (with abort), useDebounced, useLocalStorage, useLockBody
      ├─ pages/                    One file per storefront route
      │  └─ admin/                 Dashboard, Products, ProductForm, Categories, Orders, Messages
      └─ utils/                    format.js · validation.js
```

Notes on the front end: `useApi` aborts in-flight requests when filters change, so fast clicking never
renders stale results. Shop filters live in the URL, which makes every filtered view shareable and the
back button behave. `FilterPanel` is rendered once and reused in both the desktop sidebar and the
mobile bottom sheet, so the two can't drift apart. Product images fall back to a tinted monogram if a
remote image fails to load.

---

## Build

```bash
npm run build            # client/dist — deploy behind any static host
npm --prefix server start
```

Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` and `NODE_ENV=production` on the server, and
`VITE_API_URL` at client build time.
