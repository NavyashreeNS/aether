# Aether

**An endless feed that tells you what it is costing you.** The timeline runs forward on the Z axis instead of down the Y axis, the void never ends, and every 5 km it hands you a receipt.

[![Live](https://img.shields.io/badge/live-navyashreens.github.io%2Faether-5EE7FF?style=flat-square)](https://navyashreens.github.io/aether/)
[![Build](https://img.shields.io/badge/build_step-none-8B7CFF?style=flat-square)](#how-to-run)
[![Files](https://img.shields.io/badge/source_files-1-FFB454?style=flat-square)](index.html)
[![Mobile](https://img.shields.io/badge/works_on-phones-4FFFC4?style=flat-square)](#on-a-phone)
[![License](https://img.shields.io/badge/license-MIT-66667A?style=flat-square)](LICENSE)

**→ [navyashreens.github.io/aether](https://navyashreens.github.io/aether/)**

---

## The problem is the axis, not the length

The infinite vertical scroll is not a feature that got out of hand. It is a mechanism with one job: never let you arrive. And because continuing costs nothing, engaging costs nothing either — the double-tap is so cheap that it means nothing, and a thought scrolls past having been "liked" by someone who never read it.

Aether keeps the infinity and removes both of those.

You are a camera in a black void, facing forward. Thoughts — *echoes* — hang at fixed depths ahead of you, generated on the fly, forever. Your wheel (or your thumb) is a throttle, not a scrollbar: it adds velocity, friction takes it away, and you coast. Echoes rush toward the lens, come into focus, and fall away behind you.

Two things change the deal:

**Depth is the timeline.** An echo's z position *is* its age. 1 km down is eight minutes ago; 10 km is five hours; 50 km is three days; 200 km is most of a month. Flying forward is flying backwards through time, which is what a feed actually is once you scroll past the first screen.

**Every 5 km the void issues a depth marker.** Not an ending — a statement of account:

> **25.0 km** — 41 thoughts have passed you. Name one.
> `AIRBORNE 3:12 · 41 PASSED`

That is the argument, and it is sharper than a wall. The feed is infinite; it just refuses to be quiet about it. No real feed will ever tell you how long you have been in it or how much went past unread. This one does, in monospace, five times over every 25 km.

**And you cannot like an echo.** To engage with one you press and **hold** it for 320 ms. A ring fills under your finger; when it closes the echo is *caught* — forward momentum drops to zero, the void dims and blurs around it, a spotlight blooms behind it, and a timer starts counting how long you have held it still. Attention costs something again.

---

## How it works

### An infinite feed with no array in it

Nothing is stored in a list. Echo `n` is *computed* from `n`, so the tunnel is endless, deterministic, and identical on every device — echo 8 412 has the same text, colour, position and resonance for everyone, forever, with no state and no fetch.

```js
const h = n => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

z    = 1000 + n × 540 + (h(n) × 2 − 1) × 96      // depth, with jitter so the spacing is not a metronome
lap  = floor(n / 40)                              // 40 written echoes in the corpus
text = CORPUS[(n × 17 + lap × 7) mod 40]          // 17 is coprime with 40 → each lap is a new permutation
x, y = ±262 m, ±148 m off the flight axis         // from independent hashes
age  = (z / 1000) ^ 1.6 × 8 minutes               // depth is the timeline
```

Verified over the first 400 km:

| Property | Measured |
|:---|:---|
| Depths strictly increasing | yes, over 200 000 echoes |
| Minimum gap between consecutive echoes | 348.7 m — never a depth collision |
| Echoes mounted in the DOM at once | mean **5**, peak **7** |
| Echoes missed by the mount window | 0 |
| Each 40-echo lap is a full permutation of the corpus | 500 / 500 laps |
| Nearest repeat of any given text | **26.6 km** downrange |
| Echo / depth-marker collisions | 0 (each marker owns 760 m of clear tunnel) |

So the feed is unbounded, but only five or six cards exist at any moment. The camera can only travel backwards to −300 m, behind the title. Forward, there is no clamp.

### The Z-axis engine

One state value drives everything: `scrollPosition`, the camera's depth in metres. Every object has a fixed `zDepth`, and each frame computes:

```js
const distance = card.zDepth - scrollPosition;
```

`distance` is then the only input to position, size, sharpness and opacity.

```
        camera                sweet spot                              far cull
          │                  0 ─── 500 m                              3 000 m
          ▼                       │                                      │
    ──────┼───────────────────────┼──────────────────────────────────────┼────────►  z
       −200 m                     │                                      │
      behind cull            sharp, full size                 faded out, 14 px blur

    scale   = 1200 / (1200 + distance)        ← CSS perspective does this for free
    blur    = min(14, (distance − 500) / 1500 × 10)     px, when distance > 500
    opacity = clamp01((3000 − distance) / 900) × clamp01((distance + 200) / 200)
```

| distance | scale | blur | state |
|---------:|------:|-----:|:------|
| −200 m | 1.20 | 8.0 px | culled, `pointer-events: none` |
| 0 m | 1.00 | 0 px | sharp, dead centre |
| 500 m | 0.71 | 0 px | sharp, far edge of the focal band |
| 1 500 m | 0.44 | 6.7 px | legible shape, unreadable text |
| 2 600 m | 0.32 | 14.0 px | blur ceiling |
| 3 000 m | 0.29 | 14.0 px | culled |

The transform is one line — the browser's `perspective: 1200px` does the projection, so there is no matrix maths in the app at all:

```jsx
transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${-distance}px)`
```

Two details that took the longest to get right:

- **`filter` flattens 3D.** Applying `filter: blur()` to an element inside a `preserve-3d` context forces it to a flat plane and its depth sorting breaks. So each echo is two nested layers: an outer `.slot` that owns the `translate3d`, and an inner `.lens` that owns `filter` and `opacity`. Nothing is ever transformed and filtered on the same node.
- **Transitions fight a render loop.** A CSS transition on `transform` smears every frame of the flight loop. Transitions are therefore switched on for exactly 860 ms around a catch or release — the `.settling` class — and are off the rest of the time, when `requestAnimationFrame` is already producing 60 fps of motion.

### Flight physics

The wheel does not move the camera. It pushes on it.

```js
velocity += deltaY × 0.6          // wheel is a throttle, clamped to ±135 m/frame
velocity *= 0.928                 // friction, applied every frame
position += velocity              // clamped at −300 m behind; unbounded ahead
```

One flick coasts for about two seconds and decays smoothly — the difference between flying and being dragged. Wheel deltas are normalised across `deltaMode` 0/1/2 so a trackpad, a notched wheel and a Linux line-scroll all feel the same.

Speed then feeds back into the optics, which is what makes it read as flight rather than a slideshow:

| At speed | What changes |
|:---|:---|
| Perspective | 1200 px → 984 px, so the field of view compresses as you accelerate |
| Dust | motes stop being dots and smear into radial streaks along their own vectors |
| Roll | the stage rotates up to ±1.6° in the direction of travel |
| Drone | the audio low-pass opens from 300 Hz to 1 800 Hz |

`km/s` on the HUD is honest: z units are metres and the loop runs at 60 fps, so `m/frame × 60 / 1000` gives km/s. It peaks near 8.10.

### The void

One `<canvas>` draws the whole background every frame, projected through the same `FOCAL / distance` maths the DOM layer uses, so the two agree:

- **A hexagonal wireframe tunnel** — a ring of radius 1 150 m every 560 m of depth, plus six longitudinal spokes converging on the vanishing point. This is what your eye actually reads as forward motion; the cards alone are ambiguous about direction.
- **Dust** — a field that wraps every 9 000 m, so the dust is endless in the same way the feed is.

Over that: three slow radial gradients on a 78-second drift cycle, an SVG `feTurbulence` grain plate at 5.5 % opacity (desktop only), and a vignette that closes in when something is caught.

### The catch mechanic

```
pointerdown ──► arm a 320 ms timer, draw a filling ring
     │
     ├── released early, or the pointer travels > 12 px ──► cancelled, treated as a drag
     │
     └── timer completes ──► caught
                              ├── velocity = 0                  (the feed stops)
                              ├── distance forced to 300 m       (readable focus)
                              ├── every other echo × 0.09 opacity, +9 px blur
                              ├── spotlight blooms in the echo's own colour
                              ├── waveform animates, resonance meter fills
                              ├── 14 ms haptic tap, where supported
                              └── held timer starts
```

The 12 px slop threshold is what makes this work on a phone: a swipe that begins on top of a card flies the void instead of catching it, so the gesture is never ambiguous.

Release with `Esc`, by tapping the void, or by pressing the echo again. Keyboard users get the same on `Enter` / `Space` — no hold required, since holding a key is not a gesture keyboards do well.

The distinction the mechanic encodes: a like is a verdict you issue in 40 ms and forget. A catch is a length of time you spent, and the interface shows you the number.

### Controls

| Input | Action |
|:---|:---|
| Wheel / trackpad | throttle forward and back |
| Swipe up / down | throttle, with a fling that coasts |
| Press and hold an echo | catch it |
| `Esc` or tap the void | release |
| `↑` `↓` `←` `→` | throttle ±46 m/frame |
| `Space` / `PageDown` | throttle +150 m/frame |
| `PageUp` | throttle −150 m/frame |
| `Home` | jump back to 0 m |
| `Tab` + `Enter` | focus and catch, for keyboard-only use |
| Pointer move | parallax, ±5° yaw and ±4° pitch (pointer devices only) |

---

## On a phone

Not a shrunken desktop layout — the phone build makes different decisions, all of them from one `readViewport()` function so there is a single place to reason about.

**Gestures.** `touch-action: none` on the void, so the page owns every gesture and there is no pull-to-refresh or rubber-band fighting the tunnel. Swipe up to fly, and the flick carries: each `touchmove` adds `Δy × 1.35` to velocity and friction does the rest. A drag that starts on a card cancels its catch after 12 px of travel.

**Viewport.** `100dvh` instead of `100vh`, so the address bar appearing does not clip the void. `viewport-fit=cover` plus `env(safe-area-inset-*)` on every HUD anchor, so nothing hides under a notch or a home indicator.

**Layout.** The off-axis scatter is scaled by `clamp(width / 900, 0.34, 1)` — at full desktop spread, a card 262 m off the flight axis is simply off-screen on a 390 px phone. Cards are `min(width − 34, 400)` px, type steps 27 → 21 → 19 px, and there is a separate breakpoint for landscape phones (`max-height: 460px`), which have almost no vertical room and lose the radar.

**Performance.** `backdrop-filter` is the expensive property, so mobile gets less of it in two ways at once — a 16 px radius instead of 36, and only for cards inside 900 m instead of 1 600 m.

| | Desktop | Phone |
|:---|---:|---:|
| Dust motes | 300 | 110 |
| Tunnel rings drawn to | 9 200 m | 6 200 m |
| Canvas DPR cap | 2.0 | 1.5 |
| Backdrop blur radius | 36 px | 16 px |
| Cards granted a backdrop blur | < 1 600 m | < 900 m |
| Full-screen `feTurbulence` grain | yes | off |

**Audio** stays behind the button, because iOS only resumes an `AudioContext` inside a user gesture — and because nobody should be ambushed by a drone.

## Tech stack

Deliberately, aggressively small. **One file, no build step, no `node_modules`, no framework CLI.**

| | |
|:---|:---|
| React | 18.3.1, UMD from cdnjs, pinned |
| JSX | compiled in the browser by Babel Standalone 7.26.4 |
| Styling | Tailwind Play CDN for layout utilities + one hand-written `<style>` block for the 3D system, glass and HUD |
| 3D | CSS `perspective` and `translate3d`. No Three.js, no WebGL, no shaders |
| Background | one 2D `<canvas>`, hand-projected |
| Feed | a hash function. No backend, no database, no fetch |
| Audio | WebAudio oscillators — two detuned voices through a low-pass. No audio files |
| Type | Familjen Grotesk (display), Manrope (UI), JetBrains Mono (telemetry) |
| Total dependencies installed | **0** |

## How to run

**Double click `index.html`.**

That is the whole procedure. It works from `file://` — no server, no `npm install`, no build.

Or open the hosted copy: **[navyashreens.github.io/aether](https://navyashreens.github.io/aether/)**

<sub>Needs a modern browser for `backdrop-filter` and `preserve-3d` — Chrome 76+, Safari 15.4+, Firefox 103+. Best on a trackpad, a free-spinning wheel, or a thumb.</sub>

## Repository layout

```
aether/
├── index.html     the entire application
│   ├── <head>     CDN pins, Google Fonts, ~520 lines of CSS incl. 3 mobile breakpoints
│   └── <script type="text/babel">
│       ├── CORPUS[40]      the written echoes: text, author, place
│       ├── hash() echoAt()  the infinite feed — echo n computed from n, cached
│       ├── ageAt()          depth → age, because z is the timeline
│       ├── optics()         distance → { opacity, blur }, shared by every object
│       ├── readViewport()   the single source of every phone/desktop decision
│       ├── <Field/>         canvas: wireframe tunnel + projected dust
│       ├── <Sigil/>         generated SVG mark, stable per echo
│       ├── <Echo/>          glass card, depth optics, catch mechanic
│       ├── <Masthead/>      the title plate, parked at 0 m inside the tunnel
│       ├── <Marker/>        the 5 km receipt
│       ├── useAudio()       velocity-tracking drone and catch chime
│       └── <App/>           flight loop, gestures, HUD, radar
├── README.md
├── LICENSE
├── .nojekyll      tells GitHub Pages to serve the file as-is
└── .gitignore
```

## Design notes

The masthead is not a hero section — it is an object at 0 m. The title flies away from you on your first scroll and can be flown back to, which means the page has no chrome sitting outside the world.

The strip on the right edge is not a scrollbar, because an infinite feed cannot have one. It is a **proximity radar** showing the next 3 km: blips slide down as echoes approach the lens line at the bottom, in each echo's own colour, with wider white blips for depth markers. It answers "what is coming" rather than the meaningless "how far through am I".

| Role | Value | Where it is used |
|:---|:---|:---|
| Void | `#030305` | ground, everywhere |
| Ink | `#EDEEF4` | echo text, readout values |
| Muted | `#66667A` | a violet-biased grey, so it belongs to the accents |
| Glass | `rgba(255,255,255,0.03)` | card fill, over a 36 px backdrop blur |
| Cyan | `#5EE7FF` | per-echo glow |
| Rose | `#FF4D9D` | per-echo glow |
| Amber | `#FFB454` | per-echo glow |
| Iris | `#8B7CFF` | per-echo glow |
| Mint | `#4FFFC4` | per-echo glow |

Each echo owns one hue and spends it in exactly four places: the sigil, the waveform, the caught glow, and its blip on the radar. Nothing else is coloured, which is why the glow reads as an object having a temperature rather than as decoration.

## Performance

- Five to seven cards are mounted at any moment regardless of how far you fly. Everything outside `[−200, 3000]` returns `null`.
- The flight loop writes `stage.style.transform` and `stage.style.perspective` through refs, so parallax, roll and warp cost no React renders.
- Depth updates are gated at 0.05 m, so an idle camera renders nothing at all.
- The generated-echo cache is capped at 4 000 entries — about 2 160 km of tunnel — and cleared past that, so a long session cannot grow without bound.

## Known limits

- No backend, no auth, no persistence — a caught echo is forgotten on reload. This is a frontend build.
- The corpus is 40 written echoes dealt in a fresh permutation each lap. The feed is infinite; the *writing* is not, and a determined pilot will see a text again 26.6 km down. Adding entries to `CORPUS` is the only change needed to push that further.
- `prefers-reduced-motion` stops the nebula drift, halo breathing, waveform pulse, chevron and settle transitions, and freezes the dust loop. Camera motion stays, because it is the user's own input.

## License

MIT — see [LICENSE](LICENSE).
