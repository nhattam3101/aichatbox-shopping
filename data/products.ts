export type Product = {
  id: number;
  name: string;
  price: number;
  size: string;
  maxWidth: number;
  maxHeight: number;
  colors: string[];
  description: string;
  suitableFor: string[];
  image: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Minimal Sleeve 13",
    price: 189000,
    size: "13 inch",
    maxWidth: 31,
    maxHeight: 22,
    colors: ["Đen", "Beige", "Xám"],
    description: "Bao laptop mỏng nhẹ, phong cách tối giản.",
    suitableFor: ["Sinh viên", "Văn phòng"],
    image: "/products/bao1.jpg",
  },
  {
    id: 2,
    name: "Daily Sleeve 14",
    price: 219000,
    size: "14 inch",
    maxWidth: 33,
    maxHeight: 23,
    colors: ["Đen", "Nâu", "Beige"],
    description: "Bao laptop dùng hằng ngày, có lớp chống sốc nhẹ.",
    suitableFor: ["Sinh viên", "Văn phòng"],
    image: "/products/bao2.jpg",
  },
  {
    id: 3,
    name: "Classic Sleeve 15.6",
    price: 249000,
    size: "15.6 inch",
    maxWidth: 37,
    maxHeight: 26,
    colors: ["Đen", "Xám", "Navy"],
    description: "Phù hợp laptop phổ thông 15 đến 15.6 inch.",
    suitableFor: ["Văn phòng", "Đi học"],
    image: "/products/bao3.jpg",
  },
  {
    id: 4,
    name: "Premium Sleeve 16",
    price: 299000,
    size: "16 inch",
    maxWidth: 39,
    maxHeight: 27,
    colors: ["Đen", "Nâu"],
    description: "Thiết kế dày hơn, chống sốc tốt hơn.",
    suitableFor: ["Laptop lớn", "MacBook", "Ultrabook"],
    image: "/products/bao4.jpg",
  },
];
