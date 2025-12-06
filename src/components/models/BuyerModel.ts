import { IBuyer } from '../../types';
import { IEvents } from "../base/Events";

export class Buyer {
  buyerData: IBuyer | null = null;

  constructor(protected events: IEvents) {}

  setBuyerData(detail: Partial<IBuyer>): void {
    if (!this.buyerData) {
      this.buyerData = {
        payment: 'card',
        email: '',
        phone: '',
        address: ''
      };
    }
    Object.assign(this.buyerData, detail);
    this.events.emit('buyer:changed');
  }

  getBuyerData(): IBuyer | null {
    return this.buyerData;
  }

  clearBuyerData(): void {
    this.buyerData = null;
    this.events.emit('buyer:changed');
  }

  sumAddressErrors(): {[key: string]: string} {
    const error: {[key: string]: string} = {};

    if (!this.buyerData?.address || this.buyerData?.address.trim() === '') {
      error.address = 'Необходимо указать адрес';
    }
        
    return error;
  }

  sumContactsErrors(): {[key: string]: string} {
    const error: {[key: string]: string} = {};

    if (!this.buyerData?.email || !this.buyerData?.email.includes('@')) {
      error.email = 'Введите корректный email';
    }
          
    if (!this.buyerData?.phone || this.buyerData?.phone.trim() === '') {
      error.phone = 'Введите телефон';
    }

    return error;
  }
}