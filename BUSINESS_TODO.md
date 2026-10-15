# Catalog sau khi mở rộng

- 10 bao: giữ ID 1–6, thêm ID 9–12 là biến thể pastel của size 11, 13–13.3, 14 và 15.6 máy mỏng. Giá và giới hạn số đo kế thừa đúng từng size; không sao chép doanh số/đánh giá sang mẫu mới.
- 6 móc khóa: giữ ID 8, thêm ID 13–17, mỗi mẫu dùng riêng mockhoa_01…06. Tất cả 29.000đ, category Móc khóa / Phụ kiện.
- Dịch vụ thêu ID 7 tách khỏi phụ kiện, vẫn +29.000đ. Không có dữ liệu cọc 50%.
- Theo yêu cầu cập nhật giá: ID 5 (15.6–16 inch) = 149.000đ; ID 6 (17.3 inch) = 159.000đ. Cả hai `priceConfirmed: true`, có thể mua như các sản phẩm khác.
- Móc khóa mới chưa có số đo, vật liệu, cân nặng hay đánh giá xác nhận; không tự suy đoán. Số đo 0 là giá trị nội bộ không áp dụng cho chọn size máy.

## Ảnh dùng chung có chủ đích

- ID 1 → product_01; ID 2 → product_02; ID 3 → product_06; ID 4 → product_08; ID 5 → product_07; ID 6 → product_04.
- ID 9–12 lần lượt → product_04, product_09, product_07, product_05.
- Gallery bao chỉ dùng product_01…09 / product_overview, thể hiện bộ sưu tập chung; ảnh không khẳng định số đo của chiếc bao trong ảnh.
- ID 8/13/14/15/16/17 lần lượt → mockhoa_01…06; gallery từng móc khóa chỉ ảnh chính của chính mẫu đó.
- ID 7 → product_overview minh họa dịch vụ trên bao. Không còn placeholder hoặc ảnh bảng hỗ trợ trong gallery bán hàng.

## Kiểm tra

`node scripts/verify-catalog.cjs`: catalog, ID duy nhất, giá, ảnh đúng nhóm và tồn tại, search, biên dài/rộng/dày và API chat chọn size/phụ kiện.
Kiểm tra code tích hợp UI và build/lint; chưa có browser QA hoặc gọi Gemini trực tiếp trong phiên này.

Size Guide có ba khối tham khảo: size_table.jpg (khung ảnh tập trung vào vùng bảng), bang_mau.jpg và bang_mau_nut.jpg, kèm link mở ảnh gốc. Palette UI dùng nền kem, hồng phấn, xanh baby, vàng kem và chữ xám ấm.
