export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface PurchaseHistory {
  id: string;
  date: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  qrCode: string;
}
