import { GoogleGenAI } from "@google/genai";
import { allProducts as products, accessories } from "@/data/products";
import { recommendSizes } from "@/data/size-rules";



type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50 || messages.some((m: ChatMessage) => !m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string" || m.content.length > 8000)) {
      return Response.json(
        {
          error: "Messages are required",
        },
        {
          status: 400,
        }
      );
    }

    const latestUser = [...messages].reverse().find((m: ChatMessage) => m.role === "user")?.content ?? "";
    const dimensionsPattern = /(\d+(?:[.,]\d+)?)\s*(?:cm)?\s*[x×*]\s*(\d+(?:[.,]\d+)?)\s*(?:cm)?(?:\s*[x×*]\s*(\d+(?:[.,]\d+)?))?/i;
    const dimensionMessage = [...messages].reverse().find((m: ChatMessage) => m.role === "user" && dimensionsPattern.test(m.content));
    const measurements = dimensionMessage?.content.match(dimensionsPattern);
    const thicknessFollowup = latestUser.match(/(?:độ\s*)?dày\s*(?:là\s*|:)?\s*(\d+(?:[.,]\d+)?)\s*(?:cm)?/i);
    const thickness = measurements?.[3] ? Number(measurements[3].replace(",", ".")) : undefined;
    const effectiveThickness = thicknessFollowup ? Number(thicknessFollowup[1].replace(",", ".")) : thickness;
    if (measurements && effectiveThickness === undefined && (dimensionsPattern.test(latestUser) || thicknessFollowup)) return Response.json({ reply: "Vui lòng cung cấp độ dày máy (cm). Cần đủ chiều dài, chiều rộng và độ dày hợp lệ trước khi gợi ý size.", recommendedProductIds: [] });
    const fitting = measurements ? recommendSizes(Number(measurements[1].replace(",", ".")), Number(measurements[2].replace(",", ".")), effectiveThickness) : null;
    if (dimensionsPattern.test(latestUser) || (thicknessFollowup && measurements)) {
      const best = fitting?.[0];
      const warning = "";
      const reply = best ? `Theo số đo bạn cung cấp, size nhỏ nhất vừa máy là ${best.name}: ${best.maxWidth} × ${best.maxHeight} × ${best.maxThickness} cm. ${best.priceConfirmed === false ? "Giá size này đang chờ xác nhận." : `Giá ${best.price.toLocaleString("vi-VN")}₫.`}${warning} [RECOMMEND:${best.id}]` : "Catalog hiện chưa có size vừa đủ cả các số đo bạn cung cấp. Bạn vui lòng kiểm tra lại số đo; mình không thể cam kết mẫu nhỏ hơn sẽ vừa.";
      return Response.json({ reply, recommendedProductIds: best ? [best.id] : [] });
    }
    if (/thêu\s*(tên)?/i.test(latestUser)) {
      const service = products.find(p => p.id === 7)!;
      return Response.json({ reply: `Có, dịch vụ ${service.name.toLowerCase()} cộng thêm ${service.price.toLocaleString("vi-VN")}₫ mỗi bao. Catalog chưa có quy định tiền cọc, bạn vui lòng xác nhận với cửa hàng. [RECOMMEND:${service.id}]`, recommendedProductIds: [service.id] });
    }
    if (/phụ kiện|mua kèm|móc|tag/i.test(latestUser) && !/ngân sách|dưới|màu/i.test(latestUser)) {
      const accessory = accessories[0];
      return Response.json({ reply: `Bạn có thể mua kèm ${accessory.name}, giá ${accessory.price.toLocaleString("vi-VN")}₫. [RECOMMEND:${accessory.id}]`, recommendedProductIds: [accessory.id] });
    }
    const productData = products
      .map(
        (product) => `
ID: ${product.id}
Tên: ${product.name}
Giá: ${product.priceConfirmed === false ? "Chưa xác nhận, không báo giá và không nhận đặt mua" : product.price.toLocaleString("vi-VN") + "đ"}
Size: ${product.size}
Kích thước tối đa: ${!product.madeToMeasure && product.kind === "sleeve" ? `${product.maxWidth} x ${product.maxHeight} x ${product.maxThickness} cm` : "Không áp dụng: đây không phải bao cho thiết bị"}
Nhóm: ${product.kind === "accessory" ? "Móc khóa / phụ kiện, giá tính riêng" : product.kind === "service" ? "Dịch vụ cộng thêm" : "Bao bảo vệ laptop / iPad"}
Phân loại: ${product.category}
Chất liệu: ${product.material ?? "Chưa có thông tin xác nhận"}
Trượt nước: ${product.waterproof === undefined ? "Chưa có thông tin xác nhận" : product.waterproof ? "Có" : "Không"}
Ngăn phụ: ${product.hasPockets === undefined ? "Chưa có thông tin xác nhận" : product.hasPockets ? "Có" : "Không"}
Màu: ${product.colors.join(", ")}
Mô tả: ${product.description}
Phù hợp: ${product.suitableFor.join(", ")}
`,
      )
      .join("\n");

    const conversation = (messages as ChatMessage[])
      .map((item) => {
        const role = item.role === "user" ? "Khách hàng" : "CaseUp Assistant";
        return `${role}: ${item.content}`;
      })
      .join("\n");

    const prompt = `
Bạn là CaseUp Assistant, chuyên gia AI tư vấn phong cách & chọn bao laptop của CaseUp.

Nhiệm vụ của bạn:
1. Luôn xưng là "CaseUp Assistant" hoặc "mình" và gọi khách là "bạn" hoặc "quý khách".
2. Hỗ trợ khách tìm đúng size bao vừa khít cho laptop của họ. Hãy hỏi chiều dài, chiều rộng và độ dày của máy nếu khách chưa cung cấp hoặc khách nói tên máy (như MacBook Air M2, ThinkPad X1, Dell XPS 15,...).
3. Đề xuất sản phẩm phù hợp theo phong cách (Tối giản, Chống sốc, Pastel thời trang Hàn Quốc, hoặc Nhiều ngăn tiện lợi).
4. ĐẶC BIỆT: Khi bạn nhắc đến hoặc gợi ý một sản phẩm cụ thể từ danh sách bên dưới, hãy chèn thẻ mã định danh dạng [RECOMMEND:ID] (Ví dụ: [RECOMMEND:1], [RECOMMEND:7]) ở cuối đoạn văn để hệ thống hiển thị thẻ sản phẩm tương tác cho khách hàng. Mỗi câu trả lời có thể gợi ý 1 đến 3 sản phẩm phù hợp nhất.
5. Chỉ gợi ý sản phẩm có trong danh sách bên dưới. Tuyệt đối không tự bịa sản phẩm.
6. Luôn thân thiện, giải thích rõ lý do tại sao sản phẩm đó phù hợp (ví dụ: máy kích thước X thì bao này kích thước tối đa Y nên vừa thoải mái/khít đẹp).
7. Trả lời bằng tiếng Việt gãy gọn, có định dạng gạch đầu dòng dễ nhìn.

Quy tắc bắt buộc: không thêm bất kỳ tính năng, chính sách, giá, giảm giá hoặc thông số nào ngoài catalog.
Kiểm tra cả chiều dài, rộng và dày; ưu tiên size nhỏ nhất vừa máy, không bao giờ chọn size nhỏ hơn máy. Có thể xoay chiều dài/rộng.
Size 25 x 36 x 2 chỉ cho máy thân mỏng <= 2 cm. Nếu thiếu độ dày, hỏi độ dày và không gợi ý size trước khi có đủ ba số đo hợp lệ.
Máy 34 x 23 x 1.8 cm vừa ${products.find(p => p.id === 3)!.name}. Máy 36 x 25 x 2.4 cm cần size 38 x 26 x 2.5, tuyệt đối không chọn Ultrabook 36 x 25 x 2.
Thêu tên là dịch vụ cộng thêm theo catalog, không phải giá bao bảo vệ laptop. Tag/móc thuộc nhóm accessory, giá tính riêng theo catalog. Không dùng giá accessory để báo giá bao. Không khẳng định cọc 50% vì catalog chưa có quy tắc cọc.
Danh sách sản phẩm của CaseUp:
${productData}

Lịch sử hội thoại:
${conversation}

Hãy đưa ra câu trả lời tư vấn xuất sắc cho khách hàng dựa trên toàn bộ ngữ cảnh hội thoại:
`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error: "Chưa cấu hình GEMINI_API_KEY trong file .env.local",
        },
        {
          status: 500,
        }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const CANDIDATE_MODELS = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3.8-flash",
    ];

    let responseText: string | null = null;
    let lastError: unknown = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        console.log(`Sending request to Gemini API with model: ${model}...`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        if (response?.text) {
          responseText = response.text;
          break;
        }
      } catch (err) {
        console.warn(`Model ${model} error, trying fallback...`, err);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("Không thể tạo nội dung từ AI");
    }

    const recommendedProductIds: number[] = [];
    responseText = responseText.replace(/\[RECOMMEND:(\d+)\]/g, (tag, rawId) => {
      const id = Number(rawId);
      const p = products.find(p => p.id === id);
      if (!p || (p.supportsEmbroidery && fitting && !fitting.some(f => f.id === id)) || recommendedProductIds.length >= 3) return "";
      if (!recommendedProductIds.includes(id)) recommendedProductIds.push(id);
      return tag;
    });
    return Response.json({ reply: responseText, recommendedProductIds });
  } catch (error) {
    console.error("Gemini error:", error);

    if (error instanceof Error) {
      const msg = error.message;
      if (msg.includes("API key") || msg.includes("API_KEY_INVALID")) {
        return Response.json(
          { error: "Lỗi cấu hình API key. Vui lòng kiểm tra lại GEMINI_API_KEY." },
          { status: 500 }
        );
      }
      if (msg.includes("quota") || msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        return Response.json(
          { error: "Hệ thống đang bận hoặc quá hạn mức yêu cầu. Vui lòng thử lại sau giây lát." },
          { status: 429 }
        );
      }
    }

    return Response.json(
      { error: "Không thể kết nối với AI lúc này. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
