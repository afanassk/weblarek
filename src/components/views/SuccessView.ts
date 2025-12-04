import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ISuccessActions } from '../../types';

export interface ISpent {
    total: number;
}

export class SuccessView extends Component<ISpent>{
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.buttonElement =  ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.onOrdered) {
            this.buttonElement.addEventListener('click', actions.onOrdered);
        }
    };

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    };
};