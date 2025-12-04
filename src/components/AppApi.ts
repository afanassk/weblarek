import { IProductsResult, IOrderRequest, IOrderResponse } from "../types";
import { Api } from "./base/Api";

export class AppApi extends Api{
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options);
  }

  getCatalog(): Promise<IProductsResult> {
    return this.get('/product/');
  }

  createOrder(order: IOrderRequest): Promise<IOrderResponse>{
    return this.post('/order', order).then((data => data as IOrderResponse));
  }
}