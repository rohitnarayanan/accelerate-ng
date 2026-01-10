// external imports
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  InputSignal,
  OnInit,
  Signal,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

// internal imports
import { GenericType } from '@rn-accelerate-ng/core';
import { ConfigOptions, ConfigurableComponent } from '../bootstrap.component';
import { ButtonComponent, ButtonOptions } from '../button/button.component';

// component definition
@Component({
  selector: 'ang-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent
  extends ConfigurableComponent<ModalOptions>
  implements OnInit
{
  private modalService = inject(NgbModal);

  /** Input properties **/
  body: InputSignal<TemplateRef<unknown>> = input.required();
  content: InputSignal<TemplateRef<unknown> | undefined> = input<
    TemplateRef<unknown> | undefined
  >();

  @ViewChild('defaultContent') private defaultContent!: TemplateRef<unknown>;

  protected cancelButtonOptions: Signal<Partial<ButtonOptions>> = computed(
    () => {
      return {
        type: 'button',
        class: 'secondary',
        label:
          typeof this.config.cancelBtn === 'string'
            ? (this.config.cancelBtn as string)
            : 'Cancel',
        ...(typeof this.config.cancelBtn === 'object'
          ? (this.config.cancelBtn as object)
          : {}),
      };
    },
  );

  /** ConfigurableComponent overrides **/
  override configKey = 'modal';

  override defaultOptions(): Partial<ModalOptions> {
    return {
      header: {
        text: '',
        icon: '',
        classes: '',
      },
      cancelBtn: true,
      centered: true,
      scrollable: true,
    };
  }

  /** Component methods **/
  get activeInstances(): EventEmitter<NgbModalRef[]> {
    return this.modalService.activeInstances;
  }

  open(): void {
    this.modalService.open(this.content() ?? this.defaultContent, this.config);
  }

  dismissAll(reason: unknown): void {
    this.modalService.dismissAll(reason);
  }

  hasOpenModals(): boolean {
    return this.modalService.hasOpenModals();
  }
}

export interface ModalOptions extends ConfigOptions, NgbModalOptions {
  header: {
    text: string;
    icon?: string;
    classes?: string;
  };
  contextParams?: GenericType;
  submitBtn?: ButtonOptions;
  cancelBtn?: boolean | string | ButtonOptions;
  // footerButtons?: ButtonConfig[];
}
