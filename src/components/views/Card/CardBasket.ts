import { ensureElement } from "../../../utils/utils";
import { Card, ICard } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";


export class CardBasket extends Card<ICard> {
  protected productIndex: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events?: IEvents) {
    super(container);

      this.productIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
      this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

      this.deleteButtonElement.addEventListener('click', () => {
        this.events?.emit('card:remove-product', { id: this.id});
        this.events?.emit('cart:open');
    });
  };

  set index(value: number) {
    this.productIndex.textContent = String(value);
  };

  render(data: IProduct) {
    this.id = data.id;
    return super.render(data);
  }
};