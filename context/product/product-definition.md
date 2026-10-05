# Product Definition: Meridian — Coffee & Equipment

- **Version:** 1.0
- **Status:** Proposed

> Most of this definition comes from the existing codebase (see `context/product/brownfield.md`). Parts marked _(assumption)_ are best-practice guesses that the user has not yet confirmed.

---

## 1. The Big Picture (The "Why")

### 1.1. Project Vision & Purpose

Meridian is a premium online shop that sells single-lot specialty coffee and the brewing equipment to go with it, under one coherent brand. It shows that two very different ways of buying, the low-price, repeat, emotional coffee purchase and the high-price, researched, rational equipment purchase, can share one store without either feeling compromised.

Meridian is currently a portfolio concept ("Not a real store"). Its north star is to feel as considered and trustworthy as the brands it takes its cues from: Aesop, Onyx Coffee Lab, Fellow and Weber Workshops.

### 1.2. Target Audience

- **Primary:** Specialty-coffee home brewers in Europe who care about origin, process and tasting notes, and who buy beans regularly.
- **Secondary:** Home-espresso and gear enthusiasts who research before buying premium equipment (€48 to €2,890) and want specifications, finishes and side-by-side comparisons.
- **Meta-audience (portfolio):** Hiring managers, clients and other designers or engineers who judge the craft of the build. Confirmed as the reason the project exists: Meridian stays a portfolio demo.

### 1.3. User Personas

- **Persona 1: "Olena the Filter Brewer"**
  - **Role:** A product designer in Lviv who brews a V60 every morning.
  - **Goal:** To find a light-roast single origin whose flavour profile matches her taste, buy it ground for filter, and stop thinking about re-ordering.
  - **Frustration:** Roaster sites either bury tasting information or overload her with jargon, and re-ordering means starting from scratch every few weeks.

- **Persona 2: "Marco the Espresso Upgrader"**
  - **Role:** A software engineer moving from a starter machine to prosumer gear.
  - **Goal:** To compare grinders and machines on real specifications, see the finish he will actually receive, and buy with confidence.
  - **Frustration:** Equipment shops read like spec dumps with no taste, and coffee shops treat gear as an afterthought.

### 1.4. Success Metrics

_(assumption: these are proposed targets, not yet confirmed)_

- **Clarity of the two lanes:** in informal usability tests, at least 90% of visitors can say within 10 seconds that Meridian sells both coffee and equipment.
- **Purchase flow completion:** test users can go from the homepage to an order confirmation without help in under 2 minutes.
- **Subscription understanding:** users can configure a subscription and correctly state its per-delivery price.
- **Quality bar:** every page meets WCAG 2.1 AA, respects reduced-motion settings, scores 90+ on Lighthouse Performance on mobile, and has no dead links.
- **Portfolio outcome:** the project is used in job or client conversations and draws positive, specific feedback on its design and engineering.

---

## 2. The Product Experience (The "What")

### 2.1. Core Features

- **Two-lane catalog:** a coffee catalog (filter by roast, process and brew method; sort) and an equipment catalog (category tabs; price sort), each with its own visual accent.
- **Sensory-first coffee product pages:** origin story, tasting notes, roast meter, flavour profile, and grind and size options.
- **Spec-first equipment product pages:** specification table, finish switcher, comparison table, and an interactive 3D view of the flagship Atlas E1 grinder.
- **Coffee subscription:** a configurator for weekly, fortnightly or monthly deliveries, at 10–15% off.
- **Cart and checkout:** a slide-over cart and a three-step checkout that leads to an order confirmation. It is a demo: no payment is taken.
- **Brand and trust pages:** About (story, sourcing report, roastery, contact) and legal pages (terms, privacy, shipping).

### 2.2. User Journey

A visitor lands on the homepage, reads the editorial hero, and chooses a lane: coffee or equipment.

- **Coffee path:** they filter the coffee catalog by roast or brew method, open a bean, compare its flavour profile, choose a grind and bag size, and add it to the cart. They may switch to a subscription instead.
- **Equipment path:** they browse by category, open a product, read the specifications, switch finishes (turning the 3D grinder on desktop), and add it to the cart.

Both paths share one cart. The visitor reviews it in the slide-over cart, completes the three-step checkout (contact, delivery, payment), and lands on an order confirmation page.

---

## 3. Project Boundaries

### 3.1. What's In-Scope for this Version

- Every current page: home, coffee and equipment catalogs and product pages, subscription, about, legal, cart, checkout and confirmation.
- Real product and editorial photography in place of the placeholder images (in progress).
- A local, typed sample catalog of 6 coffees and 6 equipment items.
- A cart saved in the browser and a demo checkout with no payment and no order sent.
- Responsive layout, WCAG AA accessibility, and reduced-motion support.
- EUR pricing and English-only content.

### 3.2. What's Out-of-Scope (Non-Goals)

_(confirmed: Meridian stays a portfolio demo)_

- Real payments and real order fulfilment.
- Customer accounts, login and order history.
- A real backend or CMS for products, stock and orders.
- Subscription management after purchase (pause, skip, cancel).
- More than one language or currency. **Ukrainian and UAH pricing are planned for a later version** (the roastery is in Lviv).
- Reviews, ratings, wishlists, search and personalised recommendations.
- Native mobile apps.
