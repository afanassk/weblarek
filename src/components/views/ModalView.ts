import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface ModalContent {
  content: HTMLElement;
};

export class ModalView extends Component<ModalContent> {
  protected closeButtonElement: HTMLButtonElement;
  protected modalContainer: HTMLElement;
  protected contentElement: HTMLElement;
  isOpen: boolean = false;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.modalContainer = ensureElement<HTMLElement>('.modal__content', this.container);
    this.contentElement = ensureElement<HTMLElement>('.page__wrapper');

    this.closeButtonElement.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  };
  
  protected handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      this.close();
    }
  };

  set content(elem: HTMLElement) {
    this.modalContainer.replaceChildren(elem);
  }

  open(): void {
    this.contentElement.classList.add('page__wrapper_locked');
    this.container.classList.add('modal_active');
    this.isOpen = true;

    document.addEventListener('keydown', this.handleKeyDown);

    this.events.emit('modal:open');
  };

  close(): void {
    if (!this.isOpen) {
      return;
    }

    this.contentElement.classList.remove('page__wrapper_locked');
    this.container.classList.remove('modal_active');
    this.isOpen = false;

    document.removeEventListener('keydown', this.handleKeyDown);

    this.events.emit('modal:close');
  };
};