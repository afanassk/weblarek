import { ensureElement } from '../../../utils/utils';
import { Form } from './Form';
import { IEvents } from '../../base/Events';

export class FormContacts extends Form {
  protected emailInputElement: HTMLInputElement;
  protected phoneInputElement: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, 'contacts:submit');

    this.emailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailInputElement.addEventListener('input', () => {
      this.events.emit('buyer:change', { email: this.emailInputElement.value });
    });

    this.phoneInputElement.addEventListener('input', () => {
      this.events.emit('buyer:change', { phone: this.phoneInputElement.value });
    });
  };

  set email(value: string) {
    this.emailInputElement.value = value;
  }

  set phone(value: string) {
    this.phoneInputElement.value = value;
  }

  isContactsValid(errors?: { [key: string]: string }): void {
    this.checkErrors(errors || {});
  }
};