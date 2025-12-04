import { ensureElement } from '../../../utils/utils';
import { IFormActions, IContactsActions } from '../../../types/index';
import { Form } from './Form';

export interface IFormContactsActions extends IFormActions, IContactsActions {};

export interface IContacts {
  email: string;
  phone: string;
}

export class FormContacts extends Form {
  protected emailInputElement: HTMLInputElement;
  protected phoneInputElement: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IFormContactsActions) {
    super(container, actions);

    this.emailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailInputElement.addEventListener('input', () => {
      if (actions?.onEmailInput) {
        actions.onEmailInput(this.emailInputElement.value);
      };
    });

    this.phoneInputElement.addEventListener('input', () => {
      if (actions?.onPhoneInput) {
        actions.onPhoneInput(this.phoneInputElement.value);
      };
    });
  };

  set email(value: string) {
    this.emailInputElement.value = value;
  };

  get email(): string {
    return this.emailInputElement.value;
  }
    
  set phone(value: string) {
    this.phoneInputElement.value = value;
  };

  get phone(): string {
    return this.phoneInputElement.value;
  }

  isContactsValid(errors?: {[key: string]: string}): void {
    this.checkErrors(errors || {});
  }

  get contactsData(): IContacts {
    return {
      email: this.email,
      phone: this.phone,
    };
  };
};