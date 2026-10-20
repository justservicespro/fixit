# FixIt Abuja: search-result (SEO) upgrade

## What the "fixit abuja" screenshot shows
| Issue | Cause | Fix |
|---|---|---|
| Result is labelled **justservices.pro**, not "FixIt Abuja" | No `WebSite` structured data on the homepage, so Google falls back to the domain name | Added `WebSite` markup (name "FixIt Abuja", alternate names), `application-name`, consistent `og:site_name`. **Done in this update** |
| Snippet is a random sentence ("...Chat on WhatsApp ...") | The old meta description was ~290 characters and awkwardly worded, so Google ignored it | New 147-character descriptions on home, book and technician pages. **Done** |
| Title only mentions generators, printers, laptops | Narrow title | "FixIt Abuja \| Repair & Maintenance Technicians in Abuja". **Done** |
| Right-hand knowledge panel and Instagram result belong to **"We Fixit Services"** (a property-management company) | Name clash. Google has an entity and a Business Profile for them and none for you | Off-site actions below. **Needs you** |
| Only two real results from your site | Everything lives on one homepage plus the booking page | 10 service pages + a services hub (new), a directory, 20 blog posts. **Done** |

## On-site changes in this update
- **Service pages** (`/services/...`): Generator, AC, Laptop, Printer/Photocopier, Inverter/UPS, CCTV, Phone, Fridge/Freezer, Electrician, Plumber. Each has its own title, description, H1, problems list, process, areas, FAQs and Service, FAQ and Breadcrumb markup, plus links to your blog guides and the directory. These are what rank for searches like "generator repair Abuja", which the single homepage cannot do well.
- **Internal links**: homepage cards, footer "Priority Services" and "All Services" now point to the service pages on every page, which also helps Google choose better **sitelinks** under your brand result.
- `/book-a-service.html?service=Generator%20Repair` now pre-selects the service, so service pages hand over a ready-to-submit form.
- `robots.txt` keeps `/api/` out of search; `sitemap.xml` lists all new pages; main pages are marked `en-NG`.
- Claims on the new pages mirror your homepage FAQ (quote before dispatch, 30 to 90 minute typical response, spares carried, service warranty). Edit them if any stop being true.

## What only you can do (this is what fixes the knowledge panel and brand result)
1. **Google Business Profile** for "FixIt Abuja" (business.google.com): create as a service-area business (hide the address if you have no shopfront), category such as "Repair service", phone +234 807 992 6755, website `https://fixit.justservices.pro/`, services list, photos, hours (Mon-Sat 08:00-19:00 as on the site). Verify it. This is the single biggest lever against the "We Fixit Services" panel.
2. **Reviews**: ask finished-job customers for a Google review (send the profile review link by WhatsApp after each job). Aim for 10+ genuine reviews. Do not add self-written review markup to the site; Google ignores or penalises it.
3. **Social profiles with the exact name "FixIt Abuja"** (Instagram, Facebook, X, LinkedIn page, TikTok/YouTube if used), each linking to the site. Use a different handle from `@wefixitng`, e.g. `@fixitabuja`. Then ask me to add them as `sameAs` links in the homepage markup.
4. **Backlinks and mentions**: link to FixIt Abuja with the anchor text "FixIt Abuja" from `justservices.pro` (home and products pages), CertTrack and your other platforms; list the business on Nigerian directories (e.g. Yellow Pages Nigeria, BusinessList, Nigeria Business Directory), Bing Places and Apple Business Connect with identical name, phone and area.
5. **Search Console** (fixit.justservices.pro property): submit `sitemap.xml`; use URL Inspection > Request indexing on `/`, `/services/`, `/find-artisan.html` and the 10 service pages; check Pages > Indexing weekly.
6. Use the full brand "FixIt Abuja" (not just "FixIt") in social bios, WhatsApp business profile, email signatures and invoices so searches settle on one entity.

## What to expect
Site-name and snippet changes usually appear within days to a few weeks after Google recrawls the homepage. The knowledge panel takes longer and depends on the Business Profile and mentions above. Ranking for non-brand terms (e.g. "AC repair Abuja") builds over weeks to months as the service pages and blog get indexed; it is not guaranteed.

## Next content to add (highest value first)
Service pages for Auto Mechanic, Washing Machine, TV, Elevator/Escalator and Industrial Cleaning; one post per service topic that people actually search ("generator not starting", "AC not cooling"); a short About page naming JustServicesPro Management and Consulting Ltd (RC 7965265) and the Abuja team, to strengthen the entity.
