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

export type TPayment = 'card' | 'cash';

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Интерфейс заказа
export interface IOrder extends IBuyer{
  total: number; 
  items: string[];      // массив id товаров
} 

// Тип ответа сервера при создании заказа
export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IProductsResult {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends IBuyer{
  total: number;
  items: string[];
}

export interface ISuccessActions {
  onOrdered?: () => void; 
}
  