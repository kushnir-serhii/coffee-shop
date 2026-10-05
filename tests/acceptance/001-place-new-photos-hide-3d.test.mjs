// @layer: integration
// @spec: 001-place-new-photos-hide-3d
// @regression
//
// Acceptance tests for the whole feature. Runner: node --test (no deps; Vitest and
// Playwright are Phase 3). Integration tests run against `next start`; set
// SKIP_BUILD=1 to reuse an existing .next build.
//
// MANUAL (click-only, no browser here) -- left for /awos:verify:
//   - FR 2.1: finish pick on the PDP swaps the main image; Pour Kettle Graphite pick
//   - FR 2.1: Graphite kettle photo on the cart line and the checkout order summary
//   - FR 2.2: hero frame ratio at 390px and 1280px (no stretching, no empty bands)
//   - FR 2.5: Atlas E1 finish swap Graphite -> Roast -> Bone changes the photo
//   - FR 2.5: no three.js chunk request in the network log

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import {
  readFileSync,
  existsSync,
  readdirSync,
  statSync,
  openSync,
} from "node:fs";
import { createServer } from "node:net";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const isWin = process.platform === "win32";

// ---------- static helpers ----------
const productsSrc = read("src/lib/products.ts");
const imagesSrc = read("src/lib/images.ts");

/** [{slug, finishes:[...]}] for every product that declares colourways. */
function equipmentFromSource() {
  // split the catalog into one chunk per product, then read its colourways
  return productsSrc
    .split(/\n\s*slug:\s*/)
    .slice(1)
    .map((chunk) => {
      const slug = (chunk.match(/^"([^"]+)"/) || [])[1];
      const cw = chunk.match(/colourways:\s*\[([\s\S]*?)\]/);
      if (!cw) return null;
      const finishes = [...cw[1].matchAll(/name:\s*"([^"]+)"/g)].map(
        (x) => x[1],
      );
      return { slug, finishes };
    })
    .filter(Boolean);
}
const equipment = equipmentFromSource();
const colourwayPaths = equipment.flatMap((e) =>
  e.finishes.map((f) => `equipment/${e.slug}-${f.toLowerCase()}.webp`),
);
const registered = (p) => imagesSrc.includes(`"${p}"`);

// ---------- static / unit ----------
describe("static checks (no server)", () => {
  it("catalog parse finds the six equipment products", () => {
    assert.equal(
      equipment.length,
      6,
      JSON.stringify(equipment.map((e) => e.slug)),
    );
    assert.equal(colourwayPaths.length, 15);
  });

  // FR 2.1: every finish of every equipment product has a real photo
  it("every equipment colourway is registered in images.ts available set", () => {
    const missing = colourwayPaths.filter((p) => !registered(p));
    assert.deepEqual(missing, []);
  });

  // FR 2.1
  it("every equipment colourway has a WebP file in public/images/equipment", () => {
    const missing = colourwayPaths.filter(
      (p) => !existsSync(join(ROOT, "public/images", p)),
    );
    assert.deepEqual(missing, []);
  });

  // FR 2.1 negative: a made-up finish is not registered
  it("an unknown finish is not registered (negative)", () => {
    assert.equal(registered("equipment/pour-kettle-900-magenta.webp"), false);
  });

  // FR 2.2 / 2.3 / 2.4: editorial + og files exist
  it("hero, lane and og images exist as WebP", () => {
    for (const p of [
      "editorial/home-hero.webp",
      "editorial/lane-equipment.webp",
      "editorial/lane-coffee.webp",
      "og/meridian-og.webp",
    ]) {
      assert.ok(existsSync(join(ROOT, "public/images", p)), p);
    }
  });

  // Folder roles decision: everything the site serves is WebP
  it("all files under public/images are .webp", () => {
    const bad = [];
    const walk = (d) => {
      for (const n of readdirSync(d)) {
        const f = join(d, n);
        if (statSync(f).isDirectory()) walk(f);
        else if (extname(n).toLowerCase() !== ".webp") bad.push(f);
      }
    };
    walk(join(ROOT, "public/images"));
    assert.deepEqual(bad, []);
  });

  // FR 2.6: raw sources are not under public/
  it("raw source folders are out of public/ and live in assets/", () => {
    assert.equal(existsSync(join(ROOT, "public/images/_downloads")), false);
    assert.equal(existsSync(join(ROOT, "public/images/_generated")), false);
    const gen = readdirSync(join(ROOT, "assets/images/_generated"));
    assert.ok(
      gen.filter((n) => n.endsWith(".jfif")).length >= 20,
      `found ${gen.length}`,
    );
    assert.ok(gen.includes("hero.jfif"));
  });

  // FR 2.5: one-line switch is off
  it("GrinderViewer declares SHOW_3D = false", () => {
    const src = read("src/components/three/GrinderViewer.tsx");
    assert.match(src, /const SHOW_3D = false;/);
    assert.doesNotMatch(src, /const SHOW_3D = true/);
  });

  // FR 2.5: three/ components stay in repo
  it("three/ components are kept in the repo", () => {
    assert.ok(existsSync(join(ROOT, "src/components/three/GrinderScene.tsx")));
  });
});

// ---------- integration ----------
let server;
let base;
const logPath = join(ROOT, ".next", "acceptance-server.log");

const freePort = () =>
  new Promise((res, rej) => {
    const s = createServer();
    s.listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
    s.on("error", rej);
  });

const get = async (path) => {
  const r = await fetch(base + path, { redirect: "manual" });
  return { status: r.status, text: await r.text() };
};
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');
const has = (html, path) =>
  html.includes(path) || html.includes(encodeURIComponent(path));
const meta = (html, key) => {
  const re = new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]*>`, "g");
  const tags = html.match(re) || [];
  return tags.map((t) => decode((t.match(/content="([^"]*)"/) || [])[1] || ""));
};

describe("production server", { concurrency: false }, () => {
  before(async () => {
    if (!process.env.SKIP_BUILD) {
      const b = spawnSync(isWin ? "npm.cmd" : "npm", ["run", "build"], {
        cwd: ROOT,
        shell: isWin,
        encoding: "utf8",
      });
      assert.equal(
        b.status,
        0,
        "build failed:\n" + (b.stdout || "").slice(-2000) + (b.stderr || ""),
      );
    }
    const port = await freePort();
    base = `http://127.0.0.1:${port}`;
    const out = openSync(logPath, "w");
    server = spawn(
      process.execPath,
      [
        join(ROOT, "node_modules/next/dist/bin/next"),
        "start",
        "-p",
        String(port),
        "-H",
        "127.0.0.1",
      ],
      {
        cwd: ROOT,
        stdio: ["ignore", out, out],
      },
    );
    console.log(`# next start pid=${server.pid} port=${port}`);
    for (let i = 0; i < 120; i++) {
      try {
        await fetch(base + "/");
        return;
      } catch {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    throw new Error("server did not start; see " + logPath);
  });

  after(() => {
    if (!server?.pid) return;
    if (isWin) spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"]);
    else server.kill("SIGKILL");
  });

  describe("FR 2.1 equipment finishes", () => {
    for (const e of equipment) {
      it(`PDP ${e.slug} returns 200 and SSR contains the default-finish image`, async () => {
        const { status, text } = await get(`/equipment/${e.slug}`);
        assert.equal(status, 200);
        assert.ok(
          has(
            text,
            `/images/equipment/${e.slug}-${e.finishes[0].toLowerCase()}.webp`,
          ),
        );
      });
    }

    it("every colourway is served through /_next/image with 200", async () => {
      const bad = [];
      for (const p of colourwayPaths) {
        const url = `/_next/image?url=${encodeURIComponent("/images/" + p)}&w=640&q=75`;
        const r = await fetch(base + url);
        await r.arrayBuffer();
        if (r.status !== 200) bad.push(`${p} -> ${r.status}`);
      }
      assert.deepEqual(bad, []);
    });

    it("a nonexistent image is rejected by the optimizer (negative)", async () => {
      const r = await fetch(
        `${base}/_next/image?url=${encodeURIComponent("/images/equipment/pour-kettle-900-magenta.webp")}&w=640&q=75`,
      );
      await r.arrayBuffer();
      assert.notEqual(r.status, 200);
    });
  });

  describe("FR 2.2 / 2.3 homepage images", () => {
    it("FR 2.2 homepage references the new hero", async () => {
      const { status, text } = await get("/");
      assert.equal(status, 200);
      assert.ok(has(text, "/images/editorial/home-hero.webp"));
    });
    it("FR 2.3 homepage references the new equipment lane and the coffee lane", async () => {
      const { text } = await get("/");
      assert.ok(has(text, "/images/editorial/lane-equipment.webp"));
      assert.ok(has(text, "/images/editorial/lane-coffee.webp"));
    });
  });

  describe("FR 2.4 share previews", () => {
    const brand = "/images/og/meridian-og.webp";
    for (const path of ["/", "/about", "/coffee", "/legal/terms"]) {
      it(`${path} shows the brand card, title and summary_large_image`, async () => {
        const { status, text } = await get(path);
        assert.equal(status, 200);
        const og = meta(text, "og:image");
        assert.ok(
          og.length >= 1 && og.every((u) => u.endsWith(brand)),
          JSON.stringify(og),
        );
        assert.ok(meta(text, "og:title").length >= 1);
        assert.deepEqual(meta(text, "twitter:card"), ["summary_large_image"]);
      });
    }
    it("/ og:image is the brand card with size 1200x630", async () => {
      const { text } = await get("/");
      assert.ok(meta(text, "og:image")[0].endsWith(brand));
      assert.deepEqual(meta(text, "og:image:width"), ["1200"]);
      assert.deepEqual(meta(text, "og:image:height"), ["630"]);
      assert.ok(meta(text, "og:title")[0].startsWith("Meridian"));
    });
    it("coffee PDP shows the bag photo and the coffee name", async () => {
      const { text } = await get("/coffee/kirinyaga-ab");
      const og = meta(text, "og:image");
      assert.ok(
        og[0].endsWith("/images/coffee/kirinyaga-ab-bag.webp"),
        JSON.stringify(og),
      );
      assert.ok(og.every((u) => !u.endsWith(brand)));
      assert.ok(meta(text, "og:title")[0].includes("Kirinyaga AB"));
      assert.deepEqual(meta(text, "twitter:card"), ["summary_large_image"]);
    });
    it("equipment PDP shows the default-finish photo and the product name", async () => {
      const { text } = await get("/equipment/pour-kettle-900");
      const og = meta(text, "og:image");
      assert.ok(
        og[0].endsWith("/images/equipment/pour-kettle-900-bone.webp"),
        JSON.stringify(og),
      );
      assert.ok(og.every((u) => !u.endsWith(brand)));
      assert.ok(meta(text, "og:title")[0].includes("Pour Kettle 900"));
    });
  });

  describe("FR 2.5 Atlas E1 photo instead of 3D", () => {
    it("PDP has no canvas, no drag hint, and references the graphite poster", async () => {
      const { status, text } = await get("/equipment/atlas-e1-grinder");
      assert.equal(status, 200);
      assert.ok(!text.includes("<canvas"));
      assert.ok(!/Drag to rotate/i.test(text));
      assert.ok(has(text, "/images/equipment/atlas-e1-grinder-graphite.webp"));
    });
    it("homepage keeps the flagship showcase hidden", async () => {
      const { text } = await get("/");
      // marker: the HeroMachine eyebrow label
      assert.ok(!text.includes("Equipment · flagship"));
      assert.ok(!text.includes("<canvas"));
    });
  });

  describe("FR 2.6 raw sources are not published", () => {
    it("the original hero download returns 404", async () => {
      assert.equal((await get("/images/_downloads/hero.jfif")).status, 404);
    });
    it("a stock download returns 404", async () => {
      assert.equal(
        (await get("/images/_downloads/coffee-662737_1280.jpg")).status,
        404,
      );
    });
    it("the _generated hero path returns 404", async () => {
      assert.equal((await get("/images/_generated/hero.jfif")).status, 404);
    });
  });
});
