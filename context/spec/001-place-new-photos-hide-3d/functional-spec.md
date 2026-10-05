# Functional Specification: Place New Photos and Hide the 3D Grinder

- **Roadmap Item:** Real Photography Pass (Phase 2): Complete Equipment Finishes, Reshoot Off-Brief Images (home hero only), and the Social Share Card. Also pauses the Interactive 3D Grinder.
- **Status:** Completed
- **Author:** Serhii Kushnir

---

## 1. Overview and Rationale (The "Why")

The owner has collected a new batch of photos: all seven missing equipment finishes, a lighter homepage hero, a new equipment-lane photo and a social share image. None of them is on the site yet. Visitors still see coloured placeholders where these finishes should be. The homepage still opens on the dark hero that goes against the art direction, and a shared Meridian link has no preview image. For a portfolio piece, each of these gaps makes the store look unfinished.

The rotating 3D model of the Atlas E1 grinder doesn't meet the owner's standard. Until there's a better plan for it, visitors should see the real Atlas E1 photo in the same place, on every screen size.

**Success looks like:** every new photo shows where it belongs, every equipment finish has a real photo, the Atlas E1 page shows a photo instead of the 3D model, and sharing the site link shows a branded preview.

---

## 2. Functional Requirements (The "What")

### 2.1 Every equipment finish shows a real photo

When a shopper picks one of these finishes, they see its real photo: Atlas E1 in Bone, Meridian One in Graphite, Pour Kettle 900 in Graphite and Origin, Gram 0.2 in Bone, and Meridian Dripper in Origin and Roast. After this change, every finish of every equipment product has its own photo. The photo replaces the coloured placeholder everywhere that product appears in that finish: the product page, the cart and the order summary.

- **Acceptance Criteria:**
  - [x] Given the shopper is on the Pour Kettle 900 page, when they pick the Graphite finish, then the main image changes to a photo of the graphite kettle instead of a coloured placeholder.
  - [x] When the shopper picks the Origin finish on the Pour Kettle 900 page, then a photo of the green (Origin) kettle is shown.
  - [x] When the shopper picks the Bone finish on the Gram 0.2 scale page, then a photo of the off-white scale is shown.
  - [x] When the shopper picks the Origin finish and then the Roast finish on the Meridian Dripper page, then each pick shows a photo of the dripper in that colour.
  - [x] Given the shopper added a Pour Kettle 900 in Graphite to the cart, when they open the cart and then go to checkout, then the graphite kettle photo appears on that line in both the cart and the order summary.
  - [x] When the shopper picks the Graphite finish on the Meridian One page, then a photo of the graphite espresso machine is shown.
  - [x] When the shopper goes through every finish of all six equipment products, then each finish shows a real photo of that colour and no coloured placeholder appears anywhere.

### 2.2 Lighter homepage hero

The dark homepage hero is replaced by the new, lighter hero photo, which matches the warm, light studio look of the brand.

- **Acceptance Criteria:**
  - [x] When a visitor opens the homepage, then the first image they see is the new light hero photo, not the dark alarm-clock shot.
  - [x] When the visitor views the homepage on a phone and on a desktop, then the hero photo fills its frame at the same proportions as before, with no stretching and no empty bands.

### 2.3 New equipment-lane photo

The equipment half of the homepage two-lane split shows the new equipment-lane photo.

- **Acceptance Criteria:**
  - [x] When a visitor scrolls to the two-lane split on the homepage, then the equipment lane shows the new equipment photo and the coffee lane is unchanged.

### 2.4 Preview image when a link is shared

When someone shares a Meridian link in a messenger, on LinkedIn or in a portfolio, a preview image appears with the title and description. Coffee and equipment product pages show their own product photo. Every other page shows the branded Meridian share image.

- **Acceptance Criteria:**
  - [x] When the homepage link is pasted into a link-preview checker (or a messenger such as Telegram or Slack), then the wide branded Meridian image appears with the site title and description.
  - [x] When the link to a coffee page (for example Kirinyaga AB) is shared, then the preview shows that coffee's bag photo and its name.
  - [x] When the link to an equipment page (for example Pour Kettle 900) is shared, then the preview shows that product's photo in its default finish and its name.
  - [x] When the link to the About page, a catalog or a legal page is shared, then the branded Meridian image appears.

### 2.5 Atlas E1 shows a photo instead of the 3D model

The rotating 3D grinder is hidden. Wherever it used to appear, visitors see the Atlas E1 photo for the selected finish, on desktop and on mobile. The finish switcher keeps working and changes the photo. Bringing the 3D model back later should be a simple switch.

- **Acceptance Criteria:**
  - [x] Given a visitor is on a desktop-sized screen, when they open the Atlas E1 product page, then they see a still photo of the grinder, cannot rotate or drag it, and see no loading animation.
  - [x] When the visitor switches the finish from Graphite to Roast on the Atlas E1 page, then the photo changes to the Roast grinder.
  - [x] When the visitor switches to the Bone finish, then the photo changes to the Bone grinder.
  - [x] When the visitor opens the Atlas E1 page on a phone, then it looks the same as it does today.
  - [x] When the homepage loads, then the flagship grinder showcase section stays hidden, as it is today.

### 2.6 Raw source photos are not published

The original downloaded files are working material. Visitors must not be able to open them on the live site.

- **Acceptance Criteria:**
  - [x] When someone opens the address of a raw source photo on the live site (for example the original hero download), then they get a "not found" page instead of the file.

---

## 3. Scope and Boundaries

### In-Scope

- Placing the seven new equipment finish photos: Atlas E1 Bone, Meridian One Graphite, Pour Kettle 900 Graphite and Origin, Gram 0.2 Bone, Meridian Dripper Origin and Roast.
- Replacing the homepage hero with the new light photo.
- Replacing the equipment-lane photo on the homepage.
- Adding share preview images: the brand image site-wide, and the product's own photo on product pages.
- Hiding the 3D Atlas E1 model and showing its photo instead, on all screen sizes.
- Keeping raw source photos off the live site.
- Updating the shot list so it shows what is now done and what is still missing.

### Out-of-Scope

- Bringing back the homepage flagship grinder section. It stays hidden.
- Restyling placeholders ("Polished Placeholders"). No equipment slot needs one after this change.
- Reshooting the About roastery photo, which still shows another brand. No new file has been provided.
- Separate gallery photos (beans, brew, origin) for each coffee. No new files have been provided; the coffees keep sharing the current shots.
- Subscription image in the cart and order summary.
- Deciding the future of the 3D grinder (better model, photoreal version, or removing it for good). This is the Phase 3 "Photoreal 3D Grinder" item.
- Other roadmap items: Branded 404 Page, Friendly Error & Loading States, Proven Quality Bar, Ukrainian Market.

---

## Change Log

_Dated amendments made after the spec was first written — typically by `/awos:spec` in Update Mode when a bug fix changed documented behavior. Each entry records the date, the source reference (bug id or fix description), and what behavior changed and why. Leave empty until the first amendment._
