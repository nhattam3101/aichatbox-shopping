import { GoogleGenAI, type Part } from "@google/genai";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { products, accessories } from "@/data/products";
import { validateMockup, mockupPrompt, mockupErrors } from "@/data/mockup";

export const maxDuration = 90;
const LIMIT = 4096;
const failure = mockupErrors.generation;

function errorResponse(status: number, error: string = failure) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

// Bound actual streamed bytes too; Content-Length is untrusted and may be absent.
async function readPayload(request: Request) {
  if (Number(request.headers.get("content-length")) > LIMIT) throw new Error("payload");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > LIMIT) { await reader.cancel(); throw new Error("payload"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return errorResponse(403);
  let configuration;
  try { configuration = validateMockup(await readPayload(request)); }
  catch (error) { return errorResponse(error instanceof Error && error.message === "payload" ? 413 : 400); }
  if (!configuration) return errorResponse(400);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return errorResponse(503);
  try {
    const product = products.find(p => p.id === configuration.productId)!;
    const accessory = accessories.find(a => a.id === configuration.selectedAccessoryId);
    const parts: Part[] = [{ text: mockupPrompt(configuration) }];
    for (const reference of [product, accessory]) {
      if (!reference) continue;
      // Paths are exclusively catalog-owned, never client URLs or filesystem paths.
      const bytes = await readFile(path.join(process.cwd(), "public", reference.image));
      parts.push({ inlineData: { mimeType: "image/jpeg", data: bytes.toString("base64") } });
    }
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: [{ role: "user", parts }],
      config: { candidateCount: 1, responseModalities: ["IMAGE"],
        imageConfig: { imageSize: "1K", aspectRatio: "1:1" },
        httpOptions: { timeout: 75000 }, abortSignal: AbortSignal.timeout(75000) },
    });
    const image = response.candidates?.[0]?.content?.parts?.find(p => !p.thought && p.inlineData?.data && ["image/png", "image/jpeg", "image/webp"].includes(p.inlineData.mimeType ?? ""))?.inlineData;
    if (!image?.data || image.data.length > 16_000_000) throw new Error("empty_image");
    return Response.json({ imageUrl: `data:${image.mimeType};base64,${image.data}` }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const upstreamStatus = typeof error === "object" && error !== null && "status" in error ? Number(error.status) : 0;
    const status = upstreamStatus === 404 || upstreamStatus === 429 ? upstreamStatus : 500;
    const message = status === 429 ? mockupErrors.quota : status === 404 ? mockupErrors.unavailable : failure;
    const kind = error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name)
      ? error.name : upstreamStatus ? "ApiError" : "GenerationError";
    // Never log SDK error bodies, request data, or credentials.
    console.error("AI mockup failed", { status: upstreamStatus || status, kind, message });
    return errorResponse(status, message);
  }
}
