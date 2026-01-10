// external imports
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { isEmpty } from 'lodash-es';

// internal imports
import { HtmlAttributesDirective } from '@rn-accelerate-ng/core';
import { ConfigOptions, ConfigurableComponent } from '../bootstrap.component';
import { STYLE } from '../bootstrap.types';

// global variables
type ButtonType = 'button' | 'submit' | 'reset' | 'close';

export const CLOSE_BUTTON: ButtonOptions = {};

// component definition
@Component({
  selector: 'ang-button',
  standalone: true,
  imports: [CommonModule, HtmlAttributesDirective],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent
  extends ConfigurableComponent<ButtonOptions>
  implements OnInit
{
  /** Input properties - direct setters as aleternative to `options` **/
  type: InputSignal<ButtonType | undefined> = input<ButtonType>();
  class: InputSignal<STYLE | undefined> = input<STYLE>();
  outline: InputSignal<boolean | undefined> = input<boolean | undefined>(false);
  icon: InputSignal<string | undefined> = input<string | undefined>(undefined);
  label: InputSignal<string | undefined> = input<string | undefined>(undefined);
  additionalClasses: InputSignal<string | undefined> = input<string>();
  disabled: InputSignal<boolean> = input<boolean>(false);

  /** Output events **/
  @Output() onclick = new EventEmitter(); // named differently to avoid conflict with actual click event

  constructor() {
    super();
    effect(() => {
      if (isEmpty(this.options())) {
        console.debug(
          'ButtonComponent: input options not provided, using input signals instead',
        );
        this.updateOptions({
          type: this.type(),
          class: this.class(),
          label: this.label(),
          icon: this.icon(),
          outline: this.outline(),
          additionalClasses: this.additionalClasses(),
          disabled: () => this.disabled(),
        });
      }
    });
  }

  /** ConfigurableComponent overrides **/
  override configKey = 'button';

  override defaultOptions(): Partial<ButtonOptions> {
    return {
      type: 'button',
      outline: false,
      disabled: () => false,
    };
  }

  /** Component methods **/
  protected getButtonClass(): string {
    return [
      'btn',
      this.config.type === 'close' ? 'btn-close' : '',
      this.config.class
        ? `btn-${this.config.outline ? 'outline-' : ''}${this.config.class}`
        : '',
      this.config.additionalClasses ?? '',
    ]
      .join(' ')
      .trim();
  }

  protected isDisabled(): boolean {
    if (this.config.disabled === undefined) {
      return false;
    }

    if (typeof this.config.disabled === 'function') {
      return (this.config.disabled as () => boolean)();
    }

    return !!this.config.disabled;
  }

  protected handleClick(): boolean {
    if (this.config.callback) {
      this.config.callback();
      return false;
    }

    this.onclick.emit();
    return false;
  }
}

// Config interface
export interface ButtonOptions extends ConfigOptions {
  id?: string;
  type?: ButtonType;
  class?: STYLE;
  outline?: boolean;

  icon?: string;
  label?: string;

  additionalClasses?: string;
  disabled?: boolean | (() => boolean);

  callback?: () => void;
}
