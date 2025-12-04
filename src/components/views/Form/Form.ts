import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IFormActions } from '../../../types/index';

export abstract class Form extends Component<{}> {
  protected errorElement: HTMLElement;
  protected submitButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IFormActions) {
    super(container);
        
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
    this.submitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

    if (actions?.onSubmit) {
      this.container.addEventListener('submit', (event) => {
        event.preventDefault();
        actions.onSubmit!(event);
      });
    }
  };

  set errors(value: string) {
    this.errorElement.textContent = String(value);
  };

  set submitButtonDisabled(value: boolean) {
    this.submitButtonElement.disabled = value;
  }

  removeErrors() {
    this.errorElement.textContent = '';
  }

  checkErrors(errors: {[key: string]: string}): void {
    const errorsList = Object.values(errors).filter(Boolean);
    if (errorsList.length > 0) {
      this.errors = errorsList.join(', ');
      this.submitButtonElement.disabled = true; 
    } else {
      this.removeErrors();
      this.submitButtonElement.disabled = false; 
    }
  }
};