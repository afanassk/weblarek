import { IBuyer } from '../../types';

type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;
export class Buyer {
  private data: Partial<IBuyer> = {};

  // Сохранить данные покупателя
  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
  }

  // Получить все данные
  getData(): Partial<IBuyer> {
    return this.data;
  }

  // Очистить данные
  clear(): void {
    this.data = {};
  }

  // Валидация данных
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.data.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (!this.data.address) {
      errors.address = 'Укажите адрес доставки';
    }
    if (!this.data.email) {
      errors.email = 'Укажите email';
    }
    if (!this.data.phone) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }

  // Проверить, валидны ли данные
  isValid(): boolean {
    return Object.keys(this.validate()).length === 0;
  }
}
