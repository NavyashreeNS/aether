# Aether

**A social feed with a horizon.** The timeline runs forward on the Z axis instead of down the Y axis, and it ends after twenty thoughts.

[![Live](https://img.shields.io/badge/live-navyashreens.github.io%2Faether-5EE7FF?style=flat-square)](https://navyashreens.github.io/aether/)
[![Build](https://img.shields.io/badge/build_step-none-8B7CFF?style=flat-square)](#how-to-run)
[![Files](https://img.shields.io/badge/source_files-1-FFB454?style=flat-square)](index.html)
[![License](https://img.shields.io/badge/license-MIT-66667A?style=flat-square)](LICENSE)

**→ [navyashreens.github.io/aether](https://navyashreens.github.io/aether/)**

---

## The problem is the axis

The infinite vertical scroll is not a feature that got out of hand. It is a mechanism with one job: never let you arrive. There is no bottom of the page, so there is no moment where you are finished — the only exit is a decision you have to make against a machine designed to postpone it. And because it costs nothing to keep going, it costs nothing to engage: the double-tap is so cheap that it means nothing, and a thought scrolls past having been "liked" by someone who never read it.

Aether changes the axis and both problems go with it.

You are a camera in a black void, facing forward. Twenty thoughts — *echoes* — hang at fixed depths ahead of you, from 1 000 m out to 11 120 m. Your wheel is a throttle, not a scrollbar: it adds velocity, friction takes it away, and you coast. Echoes rush toward the lens, come into focus, and fall away behind you.

At 11 960 m you hit the horizon, which says:

> Twenty echoes. That was all of them. There is nothing further ahead. No refresh, no next page. Turn around, or close the tab and go outside.

That plate is the argument. The feed is finite, and it tells you so.

And you cannot like an echo. To engage with one you press and **hold** it for 320 ms. A ring fills under your cursor; when it closes the echo is *caught* — forward momentum drops to zero, the whole void dims and blurs around it, a spotlight blooms behind it, and a timer starts counting how long you have been holding it still. Attention costs something again. That is the point.

---

## How it works

### The Z-axis engine

One state value drives everything: `scrollPosition`, the camera's depth in metres. Every object in the tunnel has a fixed `zDepth`, and every frame each one computes how far away it is:

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

The transform is one line — the browser's `perspective: 1200px` handles the projection, so there is no matrix maths in the app at all:

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
position += velocity              // clamped to −300 … 11 500 m
```

Because the wheel adds to velocity rather than setting position, one flick coasts for about two seconds and decays smoothly — the difference between flying and being dragged. Deltas are normalised across `deltaMode` 0/1/2 so a trackpad, a notched wheel and a Linux line-scroll all feel the same.

Speed then feeds back into the optics, which is what makes it read as flight rather than a slideshow:

| At speed | What changes |
|:---|:---|
| Perspective | 1200 px → 984 px, so the field of view compresses as you accelerate |
| Dust | 300 motes stop being dots and smear into radial streaks along their own vectors |
| Roll | the stage rotates up to ±1.6° in the direction of travel |
| Drone | the audio low-pass opens from 300 Hz to 1 800 Hz |

`VELOCITY` on the HUD is honest: z units are metres and the loop runs at 60 fps, so `m/frame × 60 / 1000` gives km/s. It peaks near 8.10 km/s.

### The void

One `<canvas>` draws the whole background every frame, projected through the same `FOCAL / distance` maths the DOM layer uses so the two agree:

- **A hexagonal wireframe tunnel** — a ring of radius 1 150 m every 560 m of depth, out to 9 200 m, plus six longitudinal spokes converging on the vanishing point. This is what your eye actually reads as forward motion; the cards alone are ambiguous.
- **Dust** — 300 motes (160 on narrow screens) in a field that wraps every 9 000 m, so the tunnel is endless even though the feed is not.

Over that: three slow radial gradients on a 78-second drift cycle, an SVG `feTurbulence` grain plate at 5.5 % opacity, and a vignette that closes in when something is caught.

### The catch mechanic

```
pointerdown ──► arm a 320 ms timer, draw a filling ring
     │
     ├── pointerup / pointerleave before 320 ms ──► cancelled, nothing happens
     │
     └── timer completes ──► caught
                              ├── velocity = 0                  (the feed stops)
                              ├── distance forced to 300 m       (readable focus)
                              ├── every other echo × 0.09 opacity, +9 px blur
                              ├── spotlight blooms in the echo's own colour
                              ├── waveform animates, resonance meter fills
                              └── held timer starts
```

Release with `Esc`, by clicking the void, or by pressing the echo again. Keyboard users get the same thing on `Enter` / `Space` — no hold required, since holding a key is not a gesture keyboards do well.

The distinction the mechanic encodes: a like is a verdict you issue in 40 ms and forget. A catch is a length of time you spent, and the interface shows you the number.

### Controls

| Input | Action |
|:---|:---|
| Wheel / trackpad | throttle forward and back |
| Drag (touch) | throttle |
| Press and hold an echo | catch it |
| `Esc` | release |
| `↑` `↓` `←` `→` | throttle ±46 m/frame |
| `Space` / `PageDown` | throttle +150 m/frame |
| `PageUp` | throttle −150 m/frame |
| `Home` | jump back to 0 m |
| `Tab` + `Enter` | focus and catch, for keyboard-only use |
| Pointer move | parallax, ±5° yaw and ±4° pitch |

---

## Tech stack

Deliberately, aggressively small. **One file, no build step, no `node_modules`, no framework CLI.**

| | |
|:---|:---|
| React | 18.3.1, UMD from cdnjs, pinned |
| JSX | compiled in the browser by Babel Standalone 7.26.4 |
| Styling | Tailwind Play CDN for layout utilities + one hand-written `<style>` block for the 3D system, glass and HUD |
| 3D | CSS `perspective` and `translate3d`. No Three.js, no WebGL, no shaders |
| Background | one 2D `<canvas>`, hand-projected |
| Audio | WebAudio oscillators — two detuned voices through a low-pass. No audio files |
| Type | Familjen Grotesk (display), Manrope (UI), JetBrains Mono (telemetry) |
| Total dependencies installed | **0** |

The whole app is `index.html`. There is no bundler because there is nothing to bundle, and it will still open in a browser in ten years.

## How to run

**Double click `index.html`.**

That is the whole procedure. It works from `file://` — no server, no `npm install`, no build.

Or open the hosted copy: **[navyashreens.github.io/aether](https://navyashreens.github.io/aether/)**

<sub>Requires a modern browser for `backdrop-filter` and `preserve-3d` — Chrome 76+, Safari 15+, Firefox 103+. Best on a trackpad or a free-spinning wheel. The drone is off until you press the button, because nobody should be ambushed by audio.</sub>

## Repository layout

```
aether/
├── index.html     the entire application — 1 265 lines
│   ├── <head>     CDN pins, Google Fonts, ~430 lines of CSS
│   └── <script type="text/babel">
│       ├── ECHOES[]     20 records: text, author, place, colour, x, y, zDepth, resonance
│       ├── optics()     distance → { opacity, blur }, shared by every object
│       ├── waveform()   deterministic bar heights, seeded from the echo id
│       ├── <Field/>     canvas: wireframe tunnel + projected dust
│       ├── <Sigil/>     generated SVG mark, stable per author
│       ├── <Echo/>      glass card, depth optics, catch mechanic
│       ├── <Masthead/>  the title plate, parked at 0 m inside the tunnel
│       ├── <Horizon/>   the end of the feed, at 11 960 m
│       ├── useAudio()   velocity-tracking drone and catch chime
│       └── <App/>       flight loop, HUD, depth rail
├── README.md
├── LICENSE
├── .nojekyll      tells GitHub Pages to serve the file as-is
└── .gitignore
```

## Design notes

The masthead is not a hero section — it is an object at 0 m. The title flies away from you on your first scroll and can be flown back to, which means the page has no chrome that sits outside the world.

The depth rail on the right edge is not a scrollbar. Its twenty ticks are drawn at each echo's true `zDepth / 11 960`, in that echo's own colour, and they go grey once you pass them. The rail is a map of the feed, and its length is the point: it is short, and it has an end.

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

Each echo owns one hue and spends it in exactly four places: the sigil, the waveform, the caught glow, and its tick on the rail. Nothing else is coloured, which is why the glow reads as an object having a temperature rather than as decoration.

## Performance

Twenty cards, 300 canvas motes and sixteen tunnel rings, at 60 fps:

- `backdrop-filter` is the expensive property, so it is applied only inside 1 600 m — the `.near` class. Distant cards are plain translucent fills, and at 0.3 scale nobody can tell.
- Objects outside `[−200, 3000]` return `null`. Typically four to six echoes are mounted at a time, not twenty.
- The flight loop writes `stage.style.transform` and `stage.style.perspective` through refs, so parallax, roll and warp cost no React renders.
- Depth updates are gated at 0.05 m, so an idle camera renders nothing at all.

## Known limits

- Mock data only. There is no backend, no auth and no persistence — a caught echo is forgotten on reload. This is a frontend build.
- Under 700 px the tunnel still works but loses the peripheral cards to `max-width`, and the sensation is weaker on a phone than on a trackpad.
- `prefers-reduced-motion` stops the nebula drift, halo breathing, waveform pulse and settle transitions, and freezes the dust loop. Camera motion stays, because it is the user's own input.

## License

MIT — see [LICENSE](LICENSE).
