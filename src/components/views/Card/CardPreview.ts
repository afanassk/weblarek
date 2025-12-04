import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<ICard> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected inBasket: boolean = false;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      if (!this.id) return;

      this.inBasket = !this.inBasket;
      this.buttonElement.textContent = this.inBasket ? 'Удалить из корзины' : 'Купить';
            
      const eventInBasket = this.inBasket ? 'card:add-product' : 'card:remove-product';
      this.events.emit(eventInBasket, {id: this.id});
    });
  }

  render(data: IProduct, inCart = false): HTMLElement {
    this.id = data.id;
    this.inBasket = inCart;
    this.title = data.title;
    this.price = data.price;
    this.category = data.category;
    this.image = data.image;
    this.description = data.description;

    if (data.price === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = 'Недоступно';
    } else {
      this.buttonElement.disabled = false;
      this.buttonElement.textContent = this.inBasket ? 'Удалить из корзины' : 'Купить';
    }

    return super.render(data);
  }

  set category(value: string) {
    this.categoryElement.textContent = String(value);

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey], 
        key === value
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  set description(value: string) {
    this.descriptionElement.textContent = String(value);
  }
};