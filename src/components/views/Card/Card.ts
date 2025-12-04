import { IProduct } from "../../../types";
import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

// Базовый интерфейс данных для карточек
// Наследуется от IProduct, но все поля делаем опциональными (Partial)
// плюс добавляем опциональный index для нумерации в корзине.
export interface ICard extends Partial<IProduct> {
  index?: number;
};

export abstract class Card<T extends ICard> extends Component <T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected id?: string;

  constructor(container: HTMLElement) {
    super(container);

    // Находим и сохраняем элементы разметки, за которые отвечает базовая карточка
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  };

  set title(value: string) {
    this.titleElement.textContent = String(value);
  };

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = 'Бесценно';
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }
}
