export type ProductCategory =
  | "Tối giản"
  | "Chống sốc"
  | "Da cao cấp"
  | "Nhiều ngăn"
  | "Thời trang"
  | "Chống nước"
  | "Móc khóa / Phụ kiện"
  | "Dịch vụ";

export type Product = {
  id: number;
  kind: "sleeve" | "accessory" | "service";
  name: string;
  price: number;
  originalPrice?: number;
  size: string;
  maxThickness?: number;
  priceConfirmed?: boolean;
  supportsEmbroidery?: boolean;
  maxWidth: number;
  maxHeight: number;
  colors: string[];
  description: string;
  suitableFor: string[];
  image: string;
  gallery?: string[];
  badge?: "Bán chạy" | "Hot" | "Mới" | "Giảm giá" | "Premium" | "Top 1" | "Khuyên dùng";
  rating: number;
  sold: number;
  reviewsCount?: number;
  category: ProductCategory;
  material: string;
  waterproof: boolean;
  hasPockets: boolean;
  weight: string;
  features?: string[];
};

export const products: Product[] = [
  {
    id: 1,
    kind: "sleeve",
    name: "Bao bảo vệ iPad / Tablet 11 inch",
    price: 119000,
    size: "11 inch",
    maxWidth: 25,
    maxHeight: 19,
    maxThickness: 1,
    supportsEmbroidery: true,
    priceConfirmed: true,
    colors: ["Đen", "Xám", "Beige"],
    description: "Bao tablet 11 inch mỏng nhẹ, thiết kế đơn giản nhưng vẫn đảm bảo bảo vệ tốt cho thiết bị của bạn.",
    suitableFor: ["iPad 11\"", "Samsung Galaxy Tab", "Tablet Android 11\""],
    image: "/products/product_01.jpg",
    gallery: ["/products/product_01.jpg", "/products/product_02.jpg", "/products/product_09.jpg"],
    badge: "Mới",
    rating: 4.5,
    sold: 120,
    reviewsCount: 28,
    category: "Tối giản",
    material: "Vải Canvas dệt mịn + lót nỉ nhung",
    waterproof: false,
    hasPockets: false,
    weight: "120g",
    features: ["Form ôm sát thiết bị", "Lớp nỉ chống trầy xước", "Khóa kéo kim loại trơn tru"]
  },
  {
    id: 2,
    kind: "sleeve",
    name: "Bao bảo vệ Laptop 13–13.3 inch",
    price: 119000,
    size: "13 inch",
    maxWidth: 32,
    maxHeight: 22,
    maxThickness: 2,
    supportsEmbroidery: true,
    priceConfirmed: true,
    colors: ["Đen", "Nâu", "Beige"],
    description: "Bao laptop chuẩn cho dimensi 13-13.3 inch, thiết kế gọn gàng, dễ dàng đưa vào balo hoặc tote bag.",
    suitableFor: ["MacBook Air 13\"", "MacBook Pro 13\"", "Dell XPS 13", "Lenovo ThinkPad 13"],
    image: "/products/product_02.jpg",
    gallery: ["/products/product_02.jpg", "/products/product_06.jpg", "/products/product_05.jpg"],
    badge: "Bán chạy",
    rating: 4.7,
    sold: 280,
    reviewsCount: 65,
    category: "Tối giản",
    material: "Vải Polyester Poly-weave kháng bụi",
    waterproof: true,
    hasPockets: false,
    weight: "165g",
    features: ["Kháng nước nhẹ", "Đệm mút êm ái", "Viền may gia cố chắc chắn"]
  },
  {
    id: 3,
    kind: "sleeve",
    name: "Bao bảo vệ Laptop 14 inch",
    price: 129000,
    size: "14 inch",
    maxWidth: 34,
    maxHeight: 23,
    maxThickness: 2,
    supportsEmbroidery: true,
    priceConfirmed: true,
    colors: ["Đen", "Xám", "Navy"],
    description: "Bao laptop 14 inch với thiết kế hiện đại, lớp bảo vệ đa lớp để massima sự bảo vệ cho laptop của bạn.",
    suitableFor: ["MacBook Pro 14\"", "Dell Inspiron 14\"", "Asus Vivobook 14\"", "Lenovo ThinkPad 14\""],
    image: "/products/product_06.jpg",
    gallery: ["/products/product_06.jpg", "/products/product_07.jpg", "/products/product_08.jpg"],
    badge: "Hot",
    rating: 4.8,
    sold: 210,
    reviewsCount: 42,
    category: "Tối giản",
    material: "Vải Canvas chống sờn rách",
    waterproof: false,
    hasPockets: false,
    weight: "190g",
    features: ["Dung lượng rộng rãi", "Khóa đôi tiện lợi", "Bảo vệ các góc máy"]
  },
  {
    id: 4,
    kind: "sleeve",
    name: "Bao bảo vệ Laptop 15.6 inch cho máy mỏng",
    price: 139000,
    size: "15.6 inch",
    maxWidth: 36,
    maxHeight: 25,
    maxThickness: 2,
    supportsEmbroidery: true,
    priceConfirmed: true,
    colors: ["Đen da bò", "Xanh Midnight", "Nâu"],
    description: "Chỉ dành cho máy thân mỏng, độ dày tối đa 2 cm. Bao laptop premium cho Ultrabook 15.6 inch vớida PU Saffiano cao cấp và lớp lót nhung tơ tằm.",
    suitableFor: ["MacBook Pro 15.6\"", "Dell XPS 15\"", "Lenovo Yoga 15\""],
    image: "/products/product_08.jpg",
    gallery: ["/products/product_08.jpg", "/products/product_05.jpg", "/products/product_09.jpg"],
    badge: "Premium",
    rating: 4.9,
    sold: 150,
    reviewsCount: 35,
    category: "Da cao cấp",
    material: "Da nhân tạo Saffiano cao cấp + Nhung tơ tằm",
    waterproof: true,
    hasPockets: false,
    weight: "225g",
    features: ["Bề mặt chống trầy vân Saffiano", "Khóa nam châm siêu êm", "Chống sốc góc vát"]
  },
  {
    id: 5,
    kind: "sleeve",
    name: "Bao bảo vệ Laptop 15.6–16 inch",
    price: 149000,
    size: "16 inch",
    maxWidth: 38,
    maxHeight: 26,
    maxThickness: 2.5,
    supportsEmbroidery: true,
    priceConfirmed: true,
    colors: ["Đen huyền bí", "Nâu đất Cognac", "Xám Graphite"],
    description: "Bao laptop cao cấp cho dimensi 15.6-16 inch, thiết kế sang trọng với nắp mở khóa từ tính ẩn thông minh.",
    suitableFor: ["MacBook Pro 16\"", "Dell XPS 16\"", "Asus ROG Strix 16\""],
    image: "/products/product_07.jpg",
    gallery: ["/products/product_07.jpg", "/products/product_06.jpg", "/products/product_05.jpg"],
    badge: "Top 1",
    rating: 4.95,
    sold: 95,
    reviewsCount: 22,
    category: "Da cao cấp",
    material: "Da PU Nappa cao cấp mịn như da thật + Nhung nỉ",
    waterproof: true,
    hasPockets: false,
    weight: "250g",
    features: ["Khóa từ tính không làm xước vỏ máy", "Kiêm pad chuột tiện dụng", "Độ mỏng ấn tượng"]
  },
  {
    id: 6,
    kind: "sleeve",
    name: "Bao bảo vệ Laptop 17.3 inch",
    price: 159000,
    size: "17.3 inch",
    maxWidth: 41,
    maxHeight: 28,
    maxThickness: 3,
    supportsEmbroidery: true,
    priceConfirmed: true,
    colors: ["Đen quân đội", "Xám Titan"],
    description: "Bao laptop gaming cường lực cho dimensi 17.3 inch, thiết kế chống sốc tối đa cho laptop gaming nặng.",
    suitableFor: ["Laptop Gaming 17.3\"", "Alienware 17\"", "Asus ROG 17.3\"", "MSI GT Titan 17.3\""],
    image: "/products/product_04.jpg",
    gallery: ["/products/product_04.jpg", "/products/product_09.jpg", "/products/product_01.jpg"],
    badge: "Hot",
    rating: 4.85,
    sold: 75,
    reviewsCount: 18,
    category: "Chống sốc",
    material: "Đệm EVA dày 12mm + Vải Cordura siêu kháng xé",
    waterproof: true,
    hasPockets: true,
    weight: "310g",
    features: ["Chịu lực ép lên tới 15kg", "Khóa kéo kháng nước chuẩn YKK", "Ngăn phụ cho adapter nặng"]
  }
];

// Dịch vụ phụ trợ
export const services: Product[] = [
  {
    id: 7,
    kind: "service",
    name: "Thêu tên trên bao",
    price: 29000,
    size: "Dịch vụ",
    maxWidth: 0,
    maxHeight: 0,
    colors: ["Đen", "Trắng", "Vàng"],
    description: "Dịch vụ thêu tên cá nhân hóa trên bao laptop với nhiều màu threads và font khác nhau.",
    suitableFor: ["Tất cả sản phẩm bao"],
    image: "/products/product_overview.jpg",
    gallery: ["/products/product_overview.jpg"],
    badge: "Khuyên dùng",
    rating: 5.0,
    sold: 85,
    reviewsCount: 20,
    category: "Dịch vụ",
    material: "Dịch vụ may thêu",
    waterproof: false,
    hasPockets: false,
    weight: "0g",
    features: ["Thêu tên cá nhân", "Nhiều màu sợi chỉ", "Font chữ đa dạng"]
  }
];

// Các biến thể cùng cấu trúc và size, dùng lại ảnh cùng bộ sưu tập có chủ đích.
const pastelVariants: Product[] = [1, 2, 3, 4].map((baseId, index) => {
  const base = products.find(p => p.id === baseId)!;
  const image = `/products/product_${[4, 9, 7, 5][index].toString().padStart(2, "0")}.jpg`;
  return {
    ...base, id: 9 + index, name: `${base.name} · Pastel`,
    category: "Thời trang", colors: ["Xanh pastel", "Kem"],
    image, gallery: [image, "/products/product_01.jpg", "/products/product_overview.jpg"],
    description: `${base.description} Biến thể pastel dùng chung thiết kế bao; chọn size theo số đo thực tế.`,
    rating: 0, sold: 0, reviewsCount: 0, badge: "Mới",
  };
});
products.push(...pastelVariants);

export const ACCESSORY_PRICE = 29000;
// Mỗi mẫu dùng đúng ảnh móc khóa của chính mẫu đó, không dùng ảnh bao làm fallback.
export const accessories: Product[] = [
  { id: 8, name: "Móc khóa hoa hồng pastel", image: "mockhoa_01.jpg", colors: ["Hồng pastel"] },
  { id: 13, name: "Móc khóa treo túi hình bánh vòng", image: "mockhoa_02.jpg", colors: ["Hồng pastel"] },
  { id: 14, name: "Móc khóa ngôi sao hồng pastel", image: "mockhoa_03.jpg", colors: ["Hồng pastel"] },
  { id: 15, name: "Móc khóa ngôi sao chấm bi", image: "mockhoa_04.jpg", colors: ["Kem"] },
  { id: 16, name: "Móc khóa hoa hồng", image: "mockhoa_05.jpg", colors: ["Trắng"] },
  { id: 17, name: "Móc khóa hoa xanh", image: "mockhoa_06.jpg", colors: ["Xanh pastel"] },
].map(item => ({
  ...item, kind: "accessory", category: "Móc khóa / Phụ kiện",
  price: ACCESSORY_PRICE, priceConfirmed: true, size: "Phụ kiện",
  maxWidth: 0, maxHeight: 0,
  image: `/products/${item.image}`, gallery: [`/products/${item.image}`],
  description: "Phụ kiện tag treo / charm trang trí cho túi hoặc bao bảo vệ. Giá phụ kiện tính riêng, không phải giá bao.",
  suitableFor: ["Treo túi", "Tag treo", "Phụ kiện trang trí"],
  material: "Chưa có thông tin", weight: "Chưa có thông tin",
  waterproof: false, hasPockets: false, rating: 0, sold: 0, reviewsCount: 0,
}));

export const saleProducts = [...products, ...accessories];
export const allProducts = [...saleProducts, ...services];
