# KAIGO Hero Motion Direction

Date: 2026-06-06

## Context

The current deployed prototype proves the main technical idea: scroll position can drive a frame sequence smoothly. The next problem is not the frame playback. The problem is the first impression and the transition into that playback.

Current issue:

- The first screen exposes the whole hero immediately: portrait, nav, large headline, CTA, meta, scroll cue.
- The hero behaves like a static poster until the user reaches the scroll-sequence section.
- The transition into the frame sequence is visually noticeable because the first screen and sequence are separate experiences.
- One video currently carries six narrative text blocks. The future structure should be more dynamic: one scroll-video should communicate one focused idea, because there will later be three frame-sequence videos.

## References Reviewed

Local reference screenshots are stored in:

`D:\papka for all\work\kaigo\verification\reference-screenshots`

Reviewed pages:

- `https://21st.dev/community/components/s/hero`
- `https://21st.dev/community/components/ravikatiyar/minimalist-hero/default`
- `https://21st.dev/community/components/aceternity/container-scroll-animation/default`
- `https://21st.dev/community/components/YoucefBnm/hero-gallery-scroll-animation/default`
- `https://21st.dev/community/components/arunachalam0606/scroll-expansion-hero`

Useful takeaways:

- Minimalist Hero: strong personal portrait, restrained nav, one dominant statement. Useful for focus, but the yellow-circle/monochrome style should not be copied.
- Container Scroll Animation: good model for making the first viewport transform into the next surface instead of simply jumping to another section.
- Hero Gallery Scroll Animation: useful staggered media choreography, but too gallery-like for KAIGO's first impression.
- Scroll Media Expansion Hero: closest structural idea for KAIGO: a media layer starts compact/controlled and expands into the immersive scene during scroll.
- 21st hero list: useful as a pattern library, but many components are generic SaaS or overdecorated. KAIGO should keep the cinematic personal-AI world.

## Recommended Direction

Use a two-stage opening:

1. **Arrival State**
   - Full-screen cinematic background from the same visual/video source as the scroll sequence.
   - Very little interface at first: small KAIGO mark, 2-3 minimal menu labels, one short centered phrase.
   - The portrait/person is present but not presented as a finished static poster. It should feel partially hidden by light, depth, blur, or scale.
   - Header, text, and micro-elements appear with staggered motion after the loader.

2. **First Scroll Reveal**
   - The first scroll does not jump to a new section.
   - The current background slowly becomes the first frame-sequence canvas.
   - Typography splits, fades, or slides away.
   - Menu/progress elements compress into a smaller floating navigation system.
   - Subtle orbital/technical UI elements can appear around the visual: thin lines, coordinates, small rotating menu marker, progress rail.

3. **Scroll-Sequence Statement**
   - First video sequence should carry one focused text idea, not six separate content blocks.
   - Text should appear quickly, move with the scene, and exit before the next planned video section.
   - The sequence should feel dynamic and short, roughly `160-240vh`, instead of a long six-step explainer.

## Motion Model

### Load-In Timeline

- Loader fades out.
- Background sharpens and brightens over `700-900ms`.
- KAIGO mark and minimal nav reveal with staggered `translateY + opacity`.
- Center phrase appears with a mask/clip reveal.
- Small technical marks appear last: coordinates, scroll rail, tiny orbit indicator.

### Scroll Timeline

Map the first `0-25%` of scroll progress to the hero-to-sequence transition:

- Background/canvas scale: `1.08 -> 1.00`.
- Left light wash fades down.
- Center phrase moves upward and loses opacity.
- Header compresses from wide cinematic nav into compact floating nav.
- Frame canvas becomes the dominant layer without changing source image abruptly.

Map the next `25-100%` to frame playback:

- Draw frames by scroll progress as already implemented.
- Show one narrative overlay for this video.
- Keep text short and moving, not static card-like.
- Exit into the next block/video cleanly.

## Layout Proposal

Initial viewport:

- Top left: `KAIGO`.
- Center top or top right: only 2-3 nav links, for example `Обо мне`, `Работы`, `Контакт`.
- Center: short phrase, not a full sales headline.
- Bottom: subtle scroll indicator.
- No full CTA buttons at the first instant.

After first scroll:

- Main headline can unfold into a stronger statement.
- CTA can appear after movement begins, not immediately on page load.
- Progress/menu can become a vertical or orbital control near the side.

## Copy Direction

Short arrival copy options:

- `Цифровые миры, которые двигаются.`
- `AI, сайты, системы. В одном авторском мире.`
- `Сначала ощущение. Потом продукт.`

The current long headline can return later in the reveal:

`Я создаю сайты и AI-системы, которые запоминаются.`

## Technical Direction

Recommended stack for next implementation:

- Keep the current canvas frame sequence technique for video scrubbing.
- Move the prototype toward React/Vite when we start building the real site structure.
- Use Motion/Framer Motion-style scroll values for UI elements, reveals, and nav transformations.
- Keep canvas rendering isolated and driven by `requestAnimationFrame`, because the frame sequence itself is already working.
- Avoid mixing multiple motion engines in the same layer. If GSAP is introduced later, use it only for a dedicated scrolltelling layer, not for the same UI controls already handled by Motion.

## Candidate Approaches

### A. Minimal Reveal

Simple staggered intro, current hero becomes slightly more alive. Fastest, but it will still feel like a static page with nicer entrance animation.

### B. Cinematic Reveal Into Shared Canvas

The hero and scroll sequence share the same visual source. First screen starts mysterious and minimal, then scroll transforms it into the frame sequence. This is the recommended direction.

Trade-off: more implementation effort, but it fixes the main problem: no hard seam between first impression and scroll animation.

### C. Menu/Orbit-Driven Intro

Adds a rotating micro-menu, floating labels, and more sci-fi interface motion immediately. Memorable, but easier to overdo. Best used as an accent inside approach B, not as the main idea.

## Proposed Next Implementation Scope

For the next prototype iteration:

1. Rework only the first viewport and the transition into the first scroll sequence.
2. Keep the existing 73-frame sequence.
3. Replace six narrative cards with one focused overlay for the first video.
4. Add staged load-in motion for nav, phrase, background, and technical marks.
5. Add scroll-linked transformation from arrival state to canvas playback.
6. Verify desktop and mobile screenshots again before deploy.

## Decision Needed

Recommended direction: **B with a small amount of C**.

That means: cinematic minimal first screen, shared canvas transition, one focused text overlay, plus a restrained rotating/progress UI element.
