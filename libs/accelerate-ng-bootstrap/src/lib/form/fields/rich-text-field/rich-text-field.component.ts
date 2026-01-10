// external imports
import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';

// internal imports
import { GenericType, HtmlAttributesDirective } from '@rn-accelerate-ng/core';
import {
  FormFieldComponent,
  ParentFieldComponent,
} from '../form-field/form-field.component';

// component definition
@Component({
  selector: 'ang-rich-text-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    QuillEditorComponent,
    HtmlAttributesDirective,
  ],
  templateUrl: './rich-text-field.component.html',
  styleUrl: './rich-text-field.component.scss',
})
export class RichTextFieldComponent extends ParentFieldComponent {
  styles: InputSignal<GenericType> = input<GenericType>({
    height: '100px',
  });

  @ViewChild('editor') editor!: QuillEditorComponent;
}
