# GlowTrack

## What This Is

A personal beauty product inventory web app built as a gift for a girlfriend. It helps her track everything she owns across skincare, makeup, and haircare — so she stops buying duplicates, knows when things expire, and can build daily routines from her collection. Works great on mobile browsers for checking inventory while shopping.

## Core Value

She can instantly check whether she already owns a product before buying it — no more duplicates.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Scan product barcodes to add items quickly
- [ ] Browse and search her full product inventory
- [ ] Categorize products (skincare, makeup, haircare)
- [ ] Track expiration dates with reminders
- [ ] Maintain a wishlist of products to buy
- [ ] Build morning/evening routines from owned products
- [ ] Mobile-friendly web interface for use while shopping

### Out of Scope

- Multi-user / accounts — this is a personal single-user tool
- Native mobile app — web app with good mobile UX is sufficient
- Social features / sharing — personal use only
- Product reviews or ratings — this is inventory management, not a review site
- Purchase history / price tracking — focus is on what she has, not what she spent

## Context

- Built as a personal gift, so polish and delight matter
- Primary use case is checking inventory while standing in a store aisle
- Barcode scanning requires camera access via the browser (Web API)
- Product data from barcodes may come from a free product database API
- Single user means no auth, no database accounts — can use local storage or a simple backend
- Beauty products have expiration dates (PAO — Period After Opening) that matter for safety

## Constraints

- **Platform**: Web app, must work well on mobile browsers (responsive/mobile-first)
- **Users**: Single user, no authentication required
- **Barcode scanning**: Must work via mobile browser camera (no native app)
- **Cost**: Free or minimal hosting costs (personal project)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web app over native mobile | Simpler to build, still accessible on phone via browser | — Pending |
| Single user, no auth | Built specifically for one person, removes complexity | — Pending |
| Barcode scanning for product entry | Fastest way to add products while shopping | — Pending |

---
*Last updated: 2026-03-19 after initialization*
