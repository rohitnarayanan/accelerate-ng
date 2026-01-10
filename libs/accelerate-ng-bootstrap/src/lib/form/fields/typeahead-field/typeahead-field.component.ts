// external imports
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  EventEmitter,
  input,
  InputSignal,
  Output,
  Signal,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbTypeahead,
  NgbTypeaheadModule,
  NgbTypeaheadSelectItemEvent,
} from '@ng-bootstrap/ng-bootstrap';
import jQuery from 'jquery';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  OperatorFunction,
  Subject,
} from 'rxjs';

// internal imports
import { HtmlAttributesDirective } from '@rn-accelerate-ng/core';
import {
  FormFieldComponent,
  ParentFieldComponent,
} from '../form-field/form-field.component';

// global variables

// global methods
const DEFAULT_FILTER = (
  input: string,
  component: TypeaheadFieldComponent,
): unknown[] => {
  if (input === '') {
    return component.values();
  }

  return component
    .values()
    .filter(
      (value) =>
        component
          .formatterFn()(value, component)
          .toLowerCase()
          .indexOf(input.toLowerCase()) > -1,
    );
};

const DEFAULT_FORMATTER = (
  value: unknown,
  component: TypeaheadFieldComponent,
): string => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  const attr_list = component.formatFields()[component.valueType()] ?? ['name'];
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return attr_list
    .map((attr) => attr.split('.').reduce((o, i) => o[i], value as any))
    .join(' - ');
};

// component definition
@Component({
  selector: 'ang-typeahead-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    NgbTypeaheadModule,
    HtmlAttributesDirective,
  ],
  templateUrl: './typeahead-field.component.html',
  styleUrl: './typeahead-field.component.scss',
})
export class TypeaheadFieldComponent
  extends ParentFieldComponent
  implements AfterViewInit
{
  values: InputSignal<unknown[]> = input.required();
  type: InputSignal<string | undefined> = input<string | undefined>();
  itemFilter: InputSignal<
    | ((input: string, component: TypeaheadFieldComponent) => unknown[])
    | undefined
  > = input<
    | ((input: string, component: TypeaheadFieldComponent) => unknown[])
    | undefined
  >();
  itemFormatter: InputSignal<
    ((input: unknown, component: TypeaheadFieldComponent) => string) | undefined
  > = input<
    ((input: unknown, component: TypeaheadFieldComponent) => string) | undefined
  >();
  formatFields: InputSignal<Record<string, string[]>> = input<
    Record<string, string[]>
  >({});

  @Output() selectItem = new EventEmitter();

  @ViewChild(NgbTypeahead) instance!: NgbTypeahead;

  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  valueType: Signal<string> = computed<string>(
    () => this.type() ?? this.name(),
  );
  filterFn: Signal<
    (input: string, component: TypeaheadFieldComponent) => unknown[]
  > = computed(() => this.itemFilter() ?? DEFAULT_FILTER);
  formatterFn: Signal<
    (input: unknown, component: TypeaheadFieldComponent) => string
  > = computed(() => this.itemFormatter() ?? DEFAULT_FORMATTER);

  override ngAfterViewInit(): void {
    /** register focusout listener to clear out partial input **/
    jQuery(`#${this.id()}`).on('focusout', (_event: JQuery.Event) => {
      // handle partial or no input
      const inputValue = this.formGroup()?.value[this.name()];
      let clearFlag = !inputValue;

      if (!clearFlag) {
        if (this.valueType() !== 'string') {
          // if valueType is not a string, a string value means partial input
          clearFlag = typeof inputValue === 'string';
        } else {
          clearFlag =
            this.values().filter((value) => value === inputValue).length === 0;
        }
      }

      if (clearFlag) {
        console.debug(
          `TypeaheadDropdownComponent[${this.name()}]: no_or_partial_input: '${inputValue}'`,
        );
        this.formGroup()?.patchValue({ [this.fieldFormControlName]: null });
      }
    });
  }

  typeaheadListener: OperatorFunction<string, readonly unknown[]> = (
    text$: Observable<string>,
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
    ); // type event
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen()),
    ); // click while closed event
    const inputFocus$ = this.focus$; // focus event

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((input: string) => this.filterFn()(input, this)),
    );
  };

  formatter(input: unknown): string {
    return this.formatterFn()(input, this);
  }

  onItemSelect(entity: NgbTypeaheadSelectItemEvent<unknown>) {
    if (!entity) {
      return;
    }

    this.formGroup()?.patchValue({ [this.fieldFormControlName]: entity.item });
    this.selectItem.emit(entity.item);
  }
}
