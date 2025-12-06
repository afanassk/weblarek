import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";

export interface IOrderData {
  payment: TPayment;
  address: string;
};

export class FormOrder extends Form {
  protected paymentCard: HTMLButtonElement;
  protected paymentCash: HTMLButtonElement;
  protected addressInputElement: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, 'order:submit');

    this.paymentCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.paymentCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.container.addEventListener('submit', (event: SubmitEvent) => {
      event.preventDefault();
      this.events.emit(this.submitEventName);
    });

    this.paymentCard.addEventListener('click', () => {
      this.payment = 'card';
      this.events.emit('buyer:change', { payment: 'card' });
    });

    this.paymentCash.addEventListener('click', () => {
      this.payment = 'cash';
      this.events.emit('buyer:change', { payment: 'cash' });
    });

    this.addressInputElement.addEventListener('input', () => {
      this.events.emit('buyer:change', { address: this.addressInputElement.value });
    });
  };

  selectPayment(payment: TPayment): void {
    this.paymentCard.classList.toggle('button_alt-active', payment === 'card');
    this.paymentCash.classList.toggle('button_alt-active', payment === 'cash');
  };

  set payment(value: TPayment) {
    this.selectPayment(value);
  };

  get payment(): TPayment {
    if (this.paymentCash.classList.contains('button_alt-active')) {
      return 'cash';
    } else {
      return 'card';
    }
  }

  set address(value: string) {
    this.addressInputElement.value = value;
  };

  isAddressValid(errors?: {[key: string]: string}): void {
    this.checkErrors(errors || {});
  }
};