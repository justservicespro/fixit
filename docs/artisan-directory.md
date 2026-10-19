# FixIt Abuja Technician Directory: build notes and recommendations

## 1. The model: two doors, one front page
| | Premium (50 skills) | General (54) and Automotive (42) |
|---|---|---|
| Who | Industrial, commercial, specialised work | Home, office, small business, vehicles |
| Client journey | Search, press **Book**, WhatsApp to FixIt (description + location) | Search, filter by skill / area / fee, **Show contact**, call or WhatsApp the artisan |
| Artisan visibility | **Never listed.** Applications go to the private sheet and email only | Listed (free) once approved |
| FixIt's role | Assesses, quotes, dispatches, invoices, carries the risk | Introducer (a lead source), not the employer |
| Revenue | Job margin | Lead fees / featured listings later (see section 5) |

The same sign-up form feeds both. The artisan ticks skills; the routing is automatic.

## 2. How the data flows
1. `technicians.html` (skill picker) posts to the existing pipeline: **TechnicianApplications** sheet + email, exactly as before. This record is private and holds *everything*, premium skills included.
2. If, and only if, the applicant ticked a General/Automotive skill **and** the public-listing consent box, Apps Script also creates a **Pending** row in the new **ArtisanListings** tab (premium skill IDs never go into it).
3. You review the row and set `Status = Approved` (and `Verified = Yes` after checking ID and a sample of work). `Suspended` removes them from the site within about 5 minutes.
4. `/api/artisans` (Vercel) asks Apps Script for Approved rows only, strips premium skills again, shortens names to "Ibrahim S.", validates phone numbers and URLs, and caches for 5 minutes.
5. `find-artisan.html` renders the listings. Contact taps are logged (anonymous) to **DirectoryContacts**.
No new environment variables: it reuses `SHEETS_ENDPOINT` and `SHEETS_ADMIN_TOKEN`.

## 3. Go-live checklist (needs you)
- [ ] Paste the new `google-apps-script.gs` into Apps Script, then **Deploy > Manage deployments > Edit > New version**. The `/exec` URL does not change.
- [ ] Push the repo; Vercel deploys `find-artisan.html` and `/api/artisans`.
- [ ] Submit a test application with one general skill + consent; confirm a Pending row appears in `ArtisanListings`; set it to Approved; confirm it shows on `/find-artisan.html` within 5 minutes.
- [ ] Submit a premium-only test application; confirm it appears **only** in `TechnicianApplications`.
- [ ] Add `https://fixit.justservices.pro/find-artisan.html` in Search Console (it is already in `sitemap.xml`).
- [ ] Existing sheet columns are extended automatically on the first new submission (Fee From/To, WhatsApp, Listing Skill IDs, etc.).

## 4. Consultant recommendations
**Cold start (the real risk).** An empty directory looks dead. Before promoting it, convert 15 to 30 of your best existing applicants into Approved listings (with their consent), cover 3 to 4 categories well (plumbing, electrical, AC, auto mechanic) and launch those first. The empty state already pushes visitors to "Book through FixIt", so no lead is lost.

**Trust and liability.**
- Keep two visible tiers: *Listed* (self-declared, approved) and *Verified* (you checked ID plus a reference or past job). Charge nothing for Listed; make Verified the thing artisans want.
- Listed artisans are independent contractors. Add a short directory clause to `terms.html` and have a Nigerian lawyer review it. Suggested starting text: *"FixIt Abuja's directory introduces customers to independent artisans. We do not employ, supervise or guarantee listed artisans or their work. Customers and artisans contract directly. Services booked through FixIt Abuja are separately covered by these Terms."* The WhatsApp message already says "I agree to FixIt Abuja's Terms & Conditions", so the Terms must actually cover this.
- Publishing phone numbers is personal data under the Nigeria Data Protection Act 2023. The explicit listing-consent checkbox is your lawful basis; keep consent records (they are in the sheet) and honour removal requests quickly.

**Protect the premium business.** Premium artisans are never shown, and the premium search shows service types, not people. Keep the artisan agreement clear that premium jobs are only taken through FixIt (non-circumvention), and never share a premium client's contact with an artisan before the job is confirmed.

**Moderation routine (10 minutes a day).** Approve only with a real phone number, a sensible fee range and a plausible bio; check the photo is a person, not a stock image. Use `Suspended` (not deletion) for complaints so you keep the audit trail.

**Measure.** DirectoryContacts gives you Reveal, Call and WhatsApp counts by skill and area. Track weekly: searches with zero results (supply gaps to recruit for), reveals per listing, and the share of searches that end in a FixIt booking.

## 5. Revenue paths (when traffic justifies it)
1. **Featured listings** (pinned to the top of a skill/area): add a `Featured` column and sort on it.
2. **Verified badge fee or annual membership** for artisans.
3. **Lead fee**: you already log contact taps; a per-lead charge needs a contact-reveal API (phase 2).
4. **Escrow / guaranteed booking** for general skills: the natural upsell from "contact directly" to "book through FixIt".

## 6. Known limits and phase 2
- Phone numbers are in the feed, so a determined scraper can collect them. Mitigate with a rate-limited `/api/artisan-contact?id=` reveal endpoint (also enables per-lead billing).
- No ratings yet. Add post-job review links sent from the WhatsApp thread once volume exists.
- Photos are URLs you vet (no uploads), as with the current technician pages. A Drive/Cloudinary upload step is a sensible next feature.
- Skill IDs are slugs of the skill names: **renaming a skill orphans existing listings.** Add new skills freely; to rename, keep the old ID.
- The skills list lives in `skills-data.json` (source) and `skills-data.js` (browser copy). Keep them in sync.

## 7. Security housekeeping spotted along the way
`vercel.json` contains a cron secret in plain text and `ENV_VARS.md` lists admin credentials. Anything committed to the repo should be considered exposed: move them to Vercel environment variables and rotate them.
