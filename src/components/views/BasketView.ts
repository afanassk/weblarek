import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface BasketData {
  products: HTMLElement[];
  total: number;
}

export class BasketView extends Component<BasketData> {
  protected titleElement: HTMLElement;
  protected listElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement, protected events?: IEvents) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.modal__title', this.container);
    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

    this.basket = [];

    this.buttonElement.addEventListener('click', () => {
      this.events?.emit('cart:order');
    });
  };

  set buttonText(value: string) {
    this.buttonElement.textContent = String(value);
  };

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  };

  set basket(items: HTMLElement[]) {
    if (items.length > 0) {
      this.buttonDisabled = false;
      this.buttonText = 'Оформить';
      this.listElement.replaceChildren(...items);
    } else {
      const emptyCart = document.createElement('p');
      emptyCart.textContent = 'Корзина пуста';
      this.buttonDisabled = true;
      this.buttonText = 'Оформить';
      this.listElement.replaceChildren(emptyCart);
    }
  };

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  };
};