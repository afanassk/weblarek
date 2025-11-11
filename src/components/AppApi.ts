import { IApi, IProduct, IOrder } from '../types';

export class AppApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получаем список товаров
  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<{ items: IProduct[] }>('/product');
      return response.items;
    } catch (error) {
      console.error('Ошибка при получении списка товаров:', error);
      throw error;
    }
  }

  // Отправляем заказ
  async createOrder(order: IOrder): Promise<IOrder> {
    try {
      return await this.api.post<IOrder>('/order', order);
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      throw error;
    }
  }
}
