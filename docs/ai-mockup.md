# CaseUp AI mockups

The optional generator lives on `/custom`. The existing preview, selected options,
pricing and add-to-cart flow remain authoritative and independent of AI state.

## Server

`POST /api/generate-mockup` accepts `MockupConfiguration` from `data/mockup.ts`.
It validates sleeve, fabric, button, embroidery (15 characters), accessory and
custom dimensions against the existing catalog and dimension rules. Payloads
are limited to 4096 streamed bytes. Client-supplied names, images and prompts
are never used. Sleeve and accessory reference bytes come from their catalog
image mappings under `public`.

Set `GEMINI_API_KEY` in the server environment. No public environment variable
is needed. Installed `@google/genai` 2.27.0 calls `gemini-3.1-flash-image`,
requesting one candidate, image output, square aspect ratio and 1K resolution.
The SDK request is aborted after 75 seconds; the client stops waiting after
85 seconds. Deployment infrastructure must permit the route's 90-second
maximum duration. Responses use `Cache-Control: no-store`.

The server builds instructions from validated structured fields, preserving the
source sleeve construction and allowing only requested embroidery lettering.
Custom measurements are context, not a promise of exact geometry. Errors return
friendly Vietnamese messages, with separate rate-limit handling. Logs contain
only a status and error class, never SDK bodies or credentials.

## Client

`components/AiMockupGenerator.tsx` owns ephemeral loading, error and image state.
It never writes to cart or localStorage. A synchronous lock blocks duplicate
submits. Fingerprints hide stale images/errors immediately and discard responses
for changed configurations. The inline result reserves a square image area and
includes its configuration snapshot, disclaimer, regenerate and close actions.
The layout stacks below controls on mobile; no modal is used.

## Verification

Run `npm run build`, `npm run lint`, `node scripts/verify-catalog.cjs`,
`node scripts/verify-all.cjs`, `node scripts/verify-mockup.cjs`, and
`node scripts/verify-mockup-ui.cjs`.

The mockup scripts use a mocked Gemini SDK/fetch and incur no generation cost.
They cover configuration variants, invalid/oversized payloads, missing key,
rate limits, unsupported model, timeout, empty images, loading, duplicate clicks,
stale results and changes while generation is pending.

Manual follow-up: at 375, 768, 1024 and 1440 pixels, generate a real image,
check keyboard focus, loading/result/error layout, change an option, regenerate,
close, and add to cart after both success and failure. Confirm selected options
and total remain identical. Check exact lettering and accessory fidelity only as
visual references. No browser was available for this implementation session.
The current catalog has no pink sleeve fabric; test supported colors rather than
adding an otherwise unsupported option for AI.
