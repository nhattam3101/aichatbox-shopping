import { GoogleGenAI } from "@google/genai";
import { products } from "@/data/products";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message?.trim()) {
      return Response.json({ error: "Message is required" }, { status: 400 });
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

    const prompt = `
Bạn là SleeveAI, nhân viên tư vấn của cửa hàng bao laptop.

Nhiệm vụ:
- Tư vấn size bao laptop.
- Tư vấn sản phẩm theo kích thước laptop.
- Tư vấn theo màu sắc và ngân sách.
- Chỉ được gợi ý sản phẩm có trong danh sách.
- Không tự bịa sản phẩm.
- Nếu khách chưa cung cấp đủ thông tin thì hỏi lại.
- Trả lời ngắn gọn, dễ hiểu, bằng tiếng Việt.

Danh sách sản phẩm:
${productData}

Khách hàng hỏi:
${message}
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
      { error: "Không thể kết nối với AI." },
      { status: 500 },
    );
  }
}
