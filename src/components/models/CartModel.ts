import { IProduct } from "../../types"
import { IEvents } from "../base/Events"

export class Cart {
  protected products: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getCartProducts(): IProduct[] {
    return this.products;
  }

  addProductToCart(product: IProduct): void {
    this.products.push(product);
    this.events.emit('basket:change');
  }

  removeProductFromCart(product: IProduct): void {
    this.products = this.products.filter(p => p.id !== product.id);
    this.events.emit('basket:change');
  }

  clearCart(): void {
    this.products = [];
    this.events.emit('basket:change');
  }

  getTotalCartPrice(): number {
    return this.products.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  getTotalCartProducts(): number {
    return this.products.length;
  }

  isProductInCart(id: string): boolean {
    return this.products.some(p => p.id === id);
  }
}