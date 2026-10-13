import { GoogleGenAI } from "@google/genai";
import { products } from "@/data/products";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        {
          error: "Messages are required",
        },
        {
          status: 400,
        }
      );
    }

    const productData = products
      .map(
        (product) => `
ID: ${product.id}
Tên: ${product.name}
Giá: ${product.price.toLocaleString("vi-VN")}đ
Size: ${product.size}
Kích thước tối đa: ${product.maxWidth} x ${product.maxHeight} cm
Phân loại: ${product.category}
Chất liệu: ${product.material}
Kháng nước: ${product.waterproof ? "Có" : "Không"}
Ngăn phụ: ${product.hasPockets ? "Có" : "Không"}
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
2. Hỗ trợ khách tìm đúng size bao vừa khít cho laptop của họ. Hãy hỏi chiều dài, chiều rộng của máy nếu khách chưa cung cấp hoặc khách nói tên máy (như MacBook Air M2, ThinkPad X1, Dell XPS 15,...).
3. Đề xuất sản phẩm phù hợp theo phong cách (Tối giản, Chống sốc chuẩn quân đội, Da cao cấp doanh nhân, Pastel thời trang Hàn Quốc, hoặc Nhiều ngăn tiện lợi).
4. ĐẶC BIỆT: Khi bạn nhắc đến hoặc gợi ý một sản phẩm cụ thể từ danh sách bên dưới, hãy chèn thẻ mã định danh dạng [RECOMMEND:ID] (Ví dụ: [RECOMMEND:1], [RECOMMEND:7]) ở cuối đoạn văn để hệ thống hiển thị thẻ sản phẩm tương tác cho khách hàng. Mỗi câu trả lời có thể gợi ý 1 đến 3 sản phẩm phù hợp nhất.
5. Chỉ gợi ý sản phẩm có trong danh sách bên dưới. Tuyệt đối không tự bịa sản phẩm.
6. Luôn thân thiện, giải thích rõ lý do tại sao sản phẩm đó phù hợp (ví dụ: máy kích thước X thì bao này kích thước tối đa Y nên vừa thoải mái/khít đẹp).
7. Trả lời bằng tiếng Việt gãy gọn, có định dạng gạch đầu dòng dễ nhìn.

Danh sách 24 sản phẩm của CaseUp:
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

    return Response.json({
      reply: responseText,
    });
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
