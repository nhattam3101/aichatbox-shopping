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
Tên: ${product.name}
Giá: ${product.price.toLocaleString("vi-VN")}đ
Size: ${product.size}
Kích thước tối đa: ${product.maxWidth} x ${product.maxHeight} cm
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
Bạn là CaseUp Assistant, nhân viên AI tư vấn của cửa hàng bao laptop CaseUp.

Nhiệm vụ:
- Khi xưng hô hoặc giới thiệu bản thân, hãy tự xưng là CaseUp Assistant hoặc nhân viên tư vấn của CaseUp (tuyệt đối không tự nhận là SleeveAI).
- Tư vấn size bao laptop.
- Tư vấn sản phẩm theo kích thước laptop.
- Tư vấn theo màu sắc và ngân sách.
- Ghi nhớ ngữ cảnh của cuộc hội thoại.
- Nếu khách nói "mẫu đó", "màu đó", "cái vừa nói" hoặc câu tương tự, hãy dựa vào lịch sử hội thoại.
- Chỉ được gợi ý sản phẩm có trong danh sách sản phẩm bên dưới.
- Không tự bịa sản phẩm.
- Nếu chưa đủ thông tin để tư vấn chính xác, hãy hỏi thêm.
- Trả lời ngắn gọn, dễ hiểu và bằng tiếng Việt.
- Ưu tiên tư vấn như một nhân viên bán hàng thân thiện của CaseUp.

Danh sách sản phẩm:

${productData}

Lịch sử hội thoại:

${conversation}

Hãy trả lời câu cuối cùng của khách hàng dựa trên toàn bộ ngữ cảnh hội thoại.
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
          console.log(`Received response from Gemini (${model}):`, response.text.substring(0, 100));
          break;
        }
      } catch (err) {
        console.warn(`Model ${model} error, trying fallback model...`, err);
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
    
    // More specific error handling
    if (error instanceof Error) {
      const msg = error.message;
      if (msg.includes("API key") || msg.includes("API_KEY_INVALID")) {
        return Response.json(
          {
            error: "Lỗi cấu hình API key. Vui lòng kiểm tra lại GEMINI_API_KEY.",
          },
          {
            status: 500,
          }
        );
      }
      if (msg.includes("quota") || msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        return Response.json(
          {
            error: "Hệ thống đang bận hoặc quá hạn mức yêu cầu. Vui lòng thử lại sau giây lát.",
          },
          {
            status: 429,
          }
        );
      }
      if (msg.includes("503") || msg.includes("UNAVAILABLE")) {
        return Response.json(
          {
            error: "Máy chủ AI hiện đang chịu tải cao. Vui lòng thử lại sau vài giây.",
          },
          {
            status: 503,
          }
        );
      }
    }

    return Response.json(
      {
        error: "Không thể kết nối với AI lúc này. Vui lòng thử lại sau.",
      },
      {
        status: 500,
      }
    );
  }
}
