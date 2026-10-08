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
        },
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
        const role = item.role === "user" ? "Khách hàng" : "SleeveAI";

        return `${role}: ${item.content}`;
      })
      .join("\n");

    const prompt = `
Bạn là SleeveAI, nhân viên tư vấn của cửa hàng bao laptop.

Nhiệm vụ:
- Tư vấn size bao laptop.
- Tư vấn sản phẩm theo kích thước laptop.
- Tư vấn theo màu sắc và ngân sách.
- Ghi nhớ ngữ cảnh của cuộc hội thoại.
- Nếu khách nói "mẫu đó", "màu đó", "cái vừa nói" hoặc câu tương tự, hãy dựa vào lịch sử hội thoại.
- Chỉ được gợi ý sản phẩm có trong danh sách sản phẩm bên dưới.
- Không tự bịa sản phẩm.
- Nếu chưa đủ thông tin để tư vấn chính xác, hãy hỏi thêm.
- Trả lời ngắn gọn, dễ hiểu và bằng tiếng Việt.
- Ưu tiên tư vấn như một nhân viên bán hàng thân thiện.

Danh sách sản phẩm:

${productData}

Lịch sử hội thoại:

${conversation}

Hãy trả lời câu cuối cùng của khách hàng dựa trên toàn bộ ngữ cảnh hội thoại.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return Response.json({
      reply:
        response.text ?? "Xin lỗi, mình chưa thể đưa ra câu trả lời lúc này.",
    });
  } catch (error) {
    console.error("Gemini error:", error);

    return Response.json(
      {
        error: "Không thể kết nối với AI.",
      },
      {
        status: 500,
      },
    );
  }
}
