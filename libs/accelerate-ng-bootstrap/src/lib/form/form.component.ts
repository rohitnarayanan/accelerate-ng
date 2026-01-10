// external imports
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  InputSignal,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  effect,
  inject,
  input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  FormUtil,
  GenericType,
  HtmlAttributesDirective,
  TemplateContext,
} from '@rn-accelerate-ng/core';
import { merge } from 'lodash-es';

// internal imports
import { ConfigOptions, ConfigurableComponent } from '../bootstrap.component';
import { ButtonComponent } from '../button/button.component';

// global variables
const _VERTICAL_FORM_CLASSES =
  'col-12 col-md-6 col-lg-8 col-xl-6 col-xxl-4 mx-auto';
const _INLINE_FORM_CLASSES =
  'row row-cols-1 row-cols-md-3 row-cols-lg-5 row-cols-xl-6 gap-3 justify-content-center align-items-center';

// component definition
@Component({
  selector: 'ang-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    HtmlAttributesDirective,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent
  extends ConfigurableComponent<FormOptions>
  implements OnInit
{
  private formBuilder: FormBuilder = inject(FormBuilder);

  /** Input properties **/
  template: InputSignal<TemplateRef<unknown> | undefined> = input<
    TemplateRef<unknown> | undefined
  >();

  /** Output events */
  @Output() private formSubmit = new EventEmitter();
  @Output() private formCancel = new EventEmitter();
  @Output() private formReset = new EventEmitter();

  @ViewChild('formContainerDiv')
  private _formContainerDiv!: ElementRef<HTMLElement>;
  @ViewChild('form') private _formElement!: ElementRef<HTMLElement>;

  private _formGroup!: FormGroup;
  private _context!: TemplateContext;
  private _updateFlag = false;

  /** Lifecycle methods **/
  constructor() {
    super();

    effect(() => {
      this._formGroup = this.formBuilder.group(this.config.controls);
      if (this.config.validators?.validateDateRange) {
        // apply date range validation if provided in configuration
        FormUtil.VALIDATORS.DATE_RANGE(
          this._formGroup,
          ...this.config.validators.validateDateRange,
        );
      }
      this._context = {
        $implicit: merge(
          { formGroup: this._formGroup },
          this.config.contextParams,
        ),
      };
    });
  }

  /* ConfigurableComponent overrides */
  override configKey = 'form';

  override configureOptions(currentOptions: Partial<FormOptions>): void {
    currentOptions.classes ??=
      currentOptions.layout === 'inline'
        ? _INLINE_FORM_CLASSES
        : _VERTICAL_FORM_CLASSES;
    // currentOptions.resetValue = currentOptions.resetValue ?? this._formGroup.getRawValue()
  }

  override defaultOptions(): Partial<FormOptions> {
    return {
      controls: {},
      layout: 'vertical',
      submitBtn: 'Submit',
      cancelBtn: 'Cancel',
      resetBtn: false,
      contextParams: {},
    };
  }

  /** Component methods **/
  get formGroup(): FormGroup {
    return this._formGroup;
  }

  get context(): TemplateContext {
    return this._context;
  }

  get formElement(): ElementRef<HTMLElement> {
    return this._formElement;
  }

  show(): void {
    this._formContainerDiv.nativeElement.style.display = 'block';
  }

  hide(): void {
    this._formContainerDiv.nativeElement.style.display = 'none';
  }

  reset(resetValue?: GenericType) {
    this._updateFlag = false;
    this.enable();
    this._formGroup.reset(resetValue);
  }

  update(formData: GenericType) {
    this._updateFlag = true;
    this.enable();
    this._formGroup.reset(formData);
  }

  enable() {
    this._formGroup.enable();
    this.config.disabledFields?.forEach((field) => {
      this._formGroup.get(field)?.disable();
    });
  }

  disable() {
    this._formGroup.disable();
  }

  get rawValue(): GenericType {
    return this._formGroup.getRawValue();
  }

  // pass-through methods and properties for FormGroup
  get controls() {
    return this._formGroup.controls;
  }

  get disabled(): boolean {
    return this._formGroup.disabled;
  }

  get enabled(): boolean {
    return this._formGroup.enabled;
  }

  get errors(): ValidationErrors | null {
    return this._formGroup.errors;
  }

  get status(): string {
    return this._formGroup.status;
  }

  get valid(): boolean {
    return this._formGroup.valid;
  }

  get value(): GenericType {
    return this._formGroup.value;
  }

  // internal methods
  protected isSubmitAllowed(): boolean {
    return this._updateFlag
      ? this._formGroup.valid && this._formGroup.dirty
      : this._formGroup.valid;
  }
  protected handleSubmit() {
    this.disable();
    this.formSubmit.emit(this.value);
    return false;
  }

  protected handleCancel() {
    this.enable();
    this.formCancel.emit();
    return false;
  }

  protected handleReset() {
    this.enable();
    this.reset();
    this.formReset.emit();
    return false;
  }

  // for debugging
  protected getStatus(): string {
    const html: string[] = [];

    const controlErrors = Object.keys(this.controls).map(
      (name: string) =>
        `${name}: ${JSON.stringify(this._formGroup.controls[name].errors)}`,
    );

    html.push('<ul>');
    html.push(
      `<li><b>Flags:</b>Valid: ${this._formGroup.valid} | Touched: ${this._formGroup.touched} | Dirty: ${this._formGroup.dirty} | Status: ${this._formGroup.status}</li>`,
    );
    html.push(`<li><b>Errors:</b> ${controlErrors.join(' | ')}</li>`);
    html.push(`<li><b>Value:</b> ${JSON.stringify(this.rawValue)}</li>`);
    html.push('</ul>');

    const status = html.join('');
    // console.debug('getFormStatus:', status);

    return status;
  }
}

// interface definition
export interface FormOptions extends ConfigOptions {
  controls: GenericType;
  contextParams?: GenericType;
  validators?: {
    validateDateRange?: string[];
  };
  disabledFields?: string[];
  layout?: 'vertical' | 'inline';
  header?: string;
  classes?: string;
  submitBtn?: string | false;
  cancelBtn?: string | false;
  resetBtn?: boolean;
}
