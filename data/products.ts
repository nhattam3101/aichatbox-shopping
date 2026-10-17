import { fabricColors } from "@/data/fabric-colors";
import { CUSTOM_BASE_PRICE, CUSTOM_PRODUCT_ID } from "@/data/business";

export type ProductCategory =
  | "Tối giản"
  | "Chống sốc"
  | "Nhiều ngăn"
  | "Thời trang"
  | "Trượt nước"
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
  material?: string;
  waterproof?: boolean;
  hasPockets?: boolean;
  weight?: string;
  features?: string[];
  madeToMeasure?: boolean;
};

export const products: Product[] = [
  {
    "id": 1,
    "kind": "sleeve",
    "name": "Bao bảo vệ iPad / Tablet 11 inch",
    "price": 119000,
    "size": "11 inch",
    "maxWidth": 25,
    "maxHeight": 19,
    "maxThickness": 1,
    "supportsEmbroidery": true,
    "priceConfirmed": true,
    "colors": [],
    "description": "Bao bảo vệ iPad / Tablet 11 inch. Chọn màu vải và cúc/nút theo bảng màu CaseUp; kiểm tra đủ ba chiều của máy trước khi chọn size.",
    "suitableFor": [],
    "image": "/products/product_01.jpg",
    "gallery": [
      "/products/product_01.jpg",
      "/products/product_02.jpg",
      "/products/product_09.jpg"
    ],
    "badge": "Mới",
    "rating": 4.5,
    "sold": 120,
    "reviewsCount": 28,
    "category": "Tối giản"
  },
  {
    "id": 2,
    "kind": "sleeve",
    "name": "Bao bảo vệ Laptop 13–13.3 inch",
    "price": 119000,
    "size": "13 inch",
    "maxWidth": 32,
    "maxHeight": 22,
    "maxThickness": 2,
    "supportsEmbroidery": true,
    "priceConfirmed": true,
    "colors": [],
    "description": "Bao bảo vệ Laptop 13–13.3 inch. Chọn màu vải và cúc/nút theo bảng màu CaseUp; kiểm tra đủ ba chiều của máy trước khi chọn size.",
    "suitableFor": [],
    "image": "/products/product_02.jpg",
    "gallery": [
      "/products/product_02.jpg",
      "/products/product_06.jpg",
      "/products/product_05.jpg"
    ],
    "badge": "Bán chạy",
    "rating": 4.7,
    "sold": 280,
    "reviewsCount": 65,
    "category": "Tối giản"
  },
  {
    "id": 3,
    "kind": "sleeve",
    "name": "Bao bảo vệ Laptop 14 inch",
    "price": 129000,
    "size": "14 inch",
    "maxWidth": 34,
    "maxHeight": 23,
    "maxThickness": 2,
    "supportsEmbroidery": true,
    "priceConfirmed": true,
    "colors": [],
    "description": "Bao bảo vệ Laptop 14 inch. Chọn màu vải và cúc/nút theo bảng màu CaseUp; kiểm tra đủ ba chiều của máy trước khi chọn size.",
    "suitableFor": [],
    "image": "/products/product_06.jpg",
    "gallery": [
      "/products/product_06.jpg",
      "/products/product_07.jpg",
      "/products/product_08.jpg"
    ],
    "badge": "Hot",
    "rating": 4.8,
    "sold": 210,
    "reviewsCount": 42,
    "category": "Tối giản"
  },
  {
    "id": 4,
    "kind": "sleeve",
    "name": "Bao bảo vệ Laptop 15.6 inch",
    "price": 139000,
    "size": "15.6 inch",
    "maxWidth": 36,
    "maxHeight": 25,
    "maxThickness": 2,
    "supportsEmbroidery": true,
    "priceConfirmed": true,
    "colors": [],
    "description": "Bao bảo vệ Laptop 15.6 inch. Chọn màu vải và cúc/nút theo bảng màu CaseUp; kiểm tra đủ ba chiều của máy trước khi chọn size.",
    "suitableFor": [],
    "image": "/products/product_08.jpg",
    "gallery": [
      "/products/product_08.jpg",
      "/products/product_05.jpg",
      "/products/product_09.jpg"
    ],
    "rating": 4.9,
    "sold": 150,
    "reviewsCount": 35,
    "category": "Tối giản"
  },
  {
    "id": 5,
    "kind": "sleeve",
    "name": "Bao bảo vệ Laptop 15.6–16 inch",
    "price": 149000,
    "size": "16 inch",
    "maxWidth": 38,
    "maxHeight": 26,
    "maxThickness": 2.5,
    "supportsEmbroidery": true,
    "priceConfirmed": true,
    "colors": [],
    "description": "Bao bảo vệ Laptop 15.6–16 inch. Chọn màu vải và cúc/nút theo bảng màu CaseUp; kiểm tra đủ ba chiều của máy trước khi chọn size.",
    "suitableFor": [],
    "image": "/products/product_07.jpg",
    "gallery": [
      "/products/product_07.jpg",
      "/products/product_06.jpg",
      "/products/product_05.jpg"
    ],
    "badge": "Top 1",
    "rating": 4.95,
    "sold": 95,
    "reviewsCount": 22,
    "category": "Tối giản"
  },
  {
    "id": 6,
    "kind": "sleeve",
    "name": "Bao bảo vệ Laptop 17.3 inch",
    "price": 159000,
    "size": "17.3 inch",
    "maxWidth": 41,
    "maxHeight": 28,
    "maxThickness": 3,
    "supportsEmbroidery": true,
    "priceConfirmed": true,
    "colors": [],
    "description": "Bao bảo vệ Laptop 17.3 inch. Chọn màu vải và cúc/nút theo bảng màu CaseUp; kiểm tra đủ ba chiều của máy trước khi chọn size.",
    "suitableFor": [],
    "image": "/products/product_04.jpg",
    "gallery": [
      "/products/product_04.jpg",
      "/products/product_09.jpg",
      "/products/product_01.jpg"
    ],
    "badge": "Hot",
    "rating": 4.85,
    "sold": 75,
    "reviewsCount": 18,
    "category": "Chống sốc"
  },
  {
    "id": 9,
    "kind": "sleeve",
    "name": "Bao bảo vệ iPad / Tablet 11 inch · Pastel",
    "price": 119000,
    "size": "11 inch",
    "maxWidth": 25,
    "maxHeight": 19,
    "maxThickness": 1,
    "supportsEmbroidery": true,
    "priceConfirmed": true,
    "colors": [],
    "description": "Bao bảo vệ iPad / Tablet 11 inch · Pastel. Chọn màu vải và cúc/nút theo bảng màu CaseUp; kiểm tra đủ ba chiều của máy trước khi chọn size.",
    "suitableFor": [],
    "image": "/products/product_04.jpg",
    "gallery": [
      "/products/product_04.jpg",
      "/products/product_01.jpg",
      "/products/product_overview.jpg"
    ],
    "badge": "Mới",
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0,
    "category": "Thời trang"
  },
  {
    "id": 10,
    "kind": "sleeve",
    "name": "Bao bảo vệ Laptop 13–13.3 inch · Pastel",
    "price": 119000,
    "size": "13 inch",
    "maxWidth": 32,
    "maxHeight": 22,
    "maxThickness": 2,
    "supportsEmbroidery": true,
    "priceConfirmed": true,
    "colors": [],
    "description": "Bao bảo vệ Laptop 13–13.3 inch · Pastel. Chọn màu vải và cúc/nút theo bảng màu CaseUp; kiểm tra đủ ba chiều của máy trước khi chọn size.",
    "suitableFor": [],
    "image": "/products/product_09.jpg",
    "gallery": [
      "/products/product_09.jpg",
      "/products/product_01.jpg",
      "/products/product_overview.jpg"
    ],
    "badge": "Mới",
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0,
    "category": "Thời trang"
  },
  {
    "id": 11,
    "kind": "sleeve",
    "name": "Bao bảo vệ Laptop 14 inch · Pastel",
    "price": 129000,
    "size": "14 inch",
    "maxWidth": 34,
    "maxHeight": 23,
    "maxThickness": 2,
    "supportsEmbroidery": true,
    "priceConfirmed": true,
    "colors": [],
    "description": "Bao bảo vệ Laptop 14 inch · Pastel. Chọn màu vải và cúc/nút theo bảng màu CaseUp; kiểm tra đủ ba chiều của máy trước khi chọn size.",
    "suitableFor": [],
    "image": "/products/product_07.jpg",
    "gallery": [
      "/products/product_07.jpg",
      "/products/product_01.jpg",
      "/products/product_overview.jpg"
    ],
    "badge": "Mới",
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0,
    "category": "Thời trang"
  },
  {
    "id": 12,
    "kind": "sleeve",
    "name": "Bao bảo vệ Laptop 15.6 inch · Pastel",
    "price": 139000,
    "size": "15.6 inch",
    "maxWidth": 36,
    "maxHeight": 25,
    "maxThickness": 2,
    "supportsEmbroidery": true,
    "priceConfirmed": true,
    "colors": [],
    "description": "Bao bảo vệ Laptop 15.6 inch · Pastel. Chọn màu vải và cúc/nút theo bảng màu CaseUp; kiểm tra đủ ba chiều của máy trước khi chọn size.",
    "suitableFor": [],
    "image": "/products/product_05.jpg",
    "gallery": [
      "/products/product_05.jpg",
      "/products/product_01.jpg",
      "/products/product_overview.jpg"
    ],
    "badge": "Mới",
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0,
    "category": "Thời trang"
  },
  {
    "id": CUSTOM_PRODUCT_ID,
    "kind": "sleeve",
    "madeToMeasure": true,
    "name": "Bao laptop may theo kích thước yêu cầu",
    "price": CUSTOM_BASE_PRICE,
    "priceConfirmed": true,
    "size": "May theo số đo",
    "maxWidth": 0,
    "maxHeight": 0,
    "supportsEmbroidery": true,
    "colors": [],
    "description": "May theo chiều dài, chiều rộng và độ dày máy do bạn cung cấp. Giá cơ bản 149.000₫; phụ thu theo số đo chờ quy tắc được xác nhận.",
    "suitableFor": [],
    "image": "/products/product_overview.jpg",
    "gallery": [
      "/products/product_overview.jpg"
    ],
    "category": "Thời trang",
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0
  }
];

// All sleeve flows consume this one official fabric palette.
for (const product of products) product.colors = fabricColors;
export const customMadeProduct = products.find(product => product.id === CUSTOM_PRODUCT_ID)!;
export const services: Product[] = [
  {
    "id": 7,
    "kind": "service",
    "name": "Thêu tên trên bao",
    "price": 29000,
    "size": "Dịch vụ",
    "maxWidth": 0,
    "maxHeight": 0,
    "colors": [
      "Đen",
      "Trắng",
      "Vàng"
    ],
    "description": "Dịch vụ thêu tên cá nhân hóa trên bao laptop với nhiều màu threads và font khác nhau.",
    "suitableFor": [
      "Tất cả sản phẩm bao"
    ],
    "image": "/products/product_overview.jpg",
    "gallery": [
      "/products/product_overview.jpg"
    ],
    "badge": "Khuyên dùng",
    "rating": 5,
    "sold": 85,
    "reviewsCount": 20,
    "category": "Dịch vụ",
    "material": "Dịch vụ may thêu",
    "waterproof": false,
    "hasPockets": false,
    "weight": "0g",
    "features": [
      "Thêu tên cá nhân",
      "Nhiều màu sợi chỉ",
      "Font chữ đa dạng"
    ]
  }
];
export const ACCESSORY_PRICE = 29000;
export const accessories: Product[] = [
  {
    "id": 8,
    "name": "Móc khóa hoa hồng pastel",
    "image": "/products/mockhoa_01.jpg",
    "colors": [
      "Hồng pastel"
    ],
    "kind": "accessory",
    "category": "Móc khóa / Phụ kiện",
    "price": 29000,
    "priceConfirmed": true,
    "size": "Phụ kiện",
    "maxWidth": 0,
    "maxHeight": 0,
    "gallery": [
      "/products/mockhoa_01.jpg"
    ],
    "description": "Phụ kiện tag treo / charm trang trí cho túi hoặc bao bảo vệ. Giá phụ kiện tính riêng, không phải giá bao.",
    "suitableFor": [
      "Treo túi",
      "Tag treo",
      "Phụ kiện trang trí"
    ],
    "material": "Chưa có thông tin",
    "weight": "Chưa có thông tin",
    "waterproof": false,
    "hasPockets": false,
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0
  },
  {
    "id": 13,
    "name": "Móc khóa treo túi hình bánh vòng",
    "image": "/products/mockhoa_02.jpg",
    "colors": [
      "Hồng pastel"
    ],
    "kind": "accessory",
    "category": "Móc khóa / Phụ kiện",
    "price": 29000,
    "priceConfirmed": true,
    "size": "Phụ kiện",
    "maxWidth": 0,
    "maxHeight": 0,
    "gallery": [
      "/products/mockhoa_02.jpg"
    ],
    "description": "Phụ kiện tag treo / charm trang trí cho túi hoặc bao bảo vệ. Giá phụ kiện tính riêng, không phải giá bao.",
    "suitableFor": [
      "Treo túi",
      "Tag treo",
      "Phụ kiện trang trí"
    ],
    "material": "Chưa có thông tin",
    "weight": "Chưa có thông tin",
    "waterproof": false,
    "hasPockets": false,
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0
  },
  {
    "id": 14,
    "name": "Móc khóa ngôi sao hồng pastel",
    "image": "/products/mockhoa_03.jpg",
    "colors": [
      "Hồng pastel"
    ],
    "kind": "accessory",
    "category": "Móc khóa / Phụ kiện",
    "price": 29000,
    "priceConfirmed": true,
    "size": "Phụ kiện",
    "maxWidth": 0,
    "maxHeight": 0,
    "gallery": [
      "/products/mockhoa_03.jpg"
    ],
    "description": "Phụ kiện tag treo / charm trang trí cho túi hoặc bao bảo vệ. Giá phụ kiện tính riêng, không phải giá bao.",
    "suitableFor": [
      "Treo túi",
      "Tag treo",
      "Phụ kiện trang trí"
    ],
    "material": "Chưa có thông tin",
    "weight": "Chưa có thông tin",
    "waterproof": false,
    "hasPockets": false,
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0
  },
  {
    "id": 15,
    "name": "Móc khóa ngôi sao chấm bi",
    "image": "/products/mockhoa_04.jpg",
    "colors": [
      "Kem"
    ],
    "kind": "accessory",
    "category": "Móc khóa / Phụ kiện",
    "price": 29000,
    "priceConfirmed": true,
    "size": "Phụ kiện",
    "maxWidth": 0,
    "maxHeight": 0,
    "gallery": [
      "/products/mockhoa_04.jpg"
    ],
    "description": "Phụ kiện tag treo / charm trang trí cho túi hoặc bao bảo vệ. Giá phụ kiện tính riêng, không phải giá bao.",
    "suitableFor": [
      "Treo túi",
      "Tag treo",
      "Phụ kiện trang trí"
    ],
    "material": "Chưa có thông tin",
    "weight": "Chưa có thông tin",
    "waterproof": false,
    "hasPockets": false,
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0
  },
  {
    "id": 16,
    "name": "Móc khóa hoa hồng",
    "image": "/products/mockhoa_05.jpg",
    "colors": [
      "Trắng"
    ],
    "kind": "accessory",
    "category": "Móc khóa / Phụ kiện",
    "price": 29000,
    "priceConfirmed": true,
    "size": "Phụ kiện",
    "maxWidth": 0,
    "maxHeight": 0,
    "gallery": [
      "/products/mockhoa_05.jpg"
    ],
    "description": "Phụ kiện tag treo / charm trang trí cho túi hoặc bao bảo vệ. Giá phụ kiện tính riêng, không phải giá bao.",
    "suitableFor": [
      "Treo túi",
      "Tag treo",
      "Phụ kiện trang trí"
    ],
    "material": "Chưa có thông tin",
    "weight": "Chưa có thông tin",
    "waterproof": false,
    "hasPockets": false,
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0
  },
  {
    "id": 17,
    "name": "Móc khóa hoa xanh",
    "image": "/products/mockhoa_06.jpg",
    "colors": [
      "Xanh pastel"
    ],
    "kind": "accessory",
    "category": "Móc khóa / Phụ kiện",
    "price": 29000,
    "priceConfirmed": true,
    "size": "Phụ kiện",
    "maxWidth": 0,
    "maxHeight": 0,
    "gallery": [
      "/products/mockhoa_06.jpg"
    ],
    "description": "Phụ kiện tag treo / charm trang trí cho túi hoặc bao bảo vệ. Giá phụ kiện tính riêng, không phải giá bao.",
    "suitableFor": [
      "Treo túi",
      "Tag treo",
      "Phụ kiện trang trí"
    ],
    "material": "Chưa có thông tin",
    "weight": "Chưa có thông tin",
    "waterproof": false,
    "hasPockets": false,
    "rating": 0,
    "sold": 0,
    "reviewsCount": 0
  }
];
export const saleProducts = [...products, ...accessories];
export const allProducts = [...saleProducts, ...services];
