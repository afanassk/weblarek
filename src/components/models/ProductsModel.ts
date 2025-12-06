import { IProduct } from '../../types';
import { IEvents } from "../base/Events";

export class Products {
  productsList: IProduct[] = [];
  selectedProduct: IProduct | null = null;
  
  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.productsList = products;
    this.events.emit('catalog:changed');
  };

  getProducts(): IProduct[] {
    return this.productsList;
  };

  getProductById(id: string): IProduct | undefined {
    return this.productsList.find(product => product.id === id);
  }
  
  setSelectedProduct(id: string): void {
    const product = this.getProductById(id);
    this.selectedProduct = product ?? null;
    this.events.emit('product:changed', { id });
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}