export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;       // null => товар недоступен к покупке
}

// Интерфейс покупателя
export type TPayment = 'card' | 'cash';

 export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Интерфейс заказа
// Минимальная структура заказа для отправки на сервер
export interface IOrder {
  payment: TPayment;       
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];         // массив id товаров
}
