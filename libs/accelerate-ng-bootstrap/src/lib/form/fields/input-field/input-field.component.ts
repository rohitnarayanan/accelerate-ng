// external imports
import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// internal imports
import { DateUtil, HtmlAttributesDirective } from '@rn-accelerate-ng/core';
import {
  FormFieldComponent,
  ParentFieldComponent,
} from '../form-field/form-field.component';

// global variables
type InputType = 'text' | 'textarea' | 'number' | 'date' | 'file';

// component definition
@Component({
  selector: 'ang-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HtmlAttributesDirective,
    FormFieldComponent,
  ],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
})
export class InputFieldComponent
  extends ParentFieldComponent
  implements OnInit
{
  type: InputSignal<InputType> = input<InputType>('text');
  icon: InputSignal<string> = input('');

  override ngOnInit(): void {
    super.ngOnInit();

    if (this.type() === 'number') {
      this.htmlAttributes()['min'] = this.htmlAttributes()['min'] ?? '0.01';
      this.htmlAttributes()['step'] = this.htmlAttributes()['step'] ?? '0.01';
    } else if (this.type() === 'date') {
      if (
        this.htmlAttributes()['min'] &&
        !this.htmlAttributes()['min'].match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        this.htmlAttributes()['min'] = DateUtil.diffDate(
          this.htmlAttributes()['min'],
        );
      }
      if (
        this.htmlAttributes()['max'] &&
        !this.htmlAttributes()['max'].match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        this.htmlAttributes()['max'] = DateUtil.diffDate(
          this.htmlAttributes()['max'],
        );
      }
    } else if (this.type() === 'file') {
      this.htmlAttributes()['accept'] =
        this.htmlAttributes()['accept'] ?? '*/*';
    }
  }
}
