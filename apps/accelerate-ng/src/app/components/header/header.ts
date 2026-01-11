import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'lodash-es';

// internal imports
import {
  AlertComponent,
  ButtonComponent,
  ButtonOptions,
  DropdownFieldComponent,
  FormComponent,
  FormOptions,
  InputFieldComponent,
  ModalComponent,
  ModalOptions,
  RichTextFieldComponent,
  TableComponent,
  TableOptions,
  ToolbarHelper,
  TypeaheadFieldComponent,
} from '@rn-accelerate-ng/bootstrap';
import { FormUtil, GenericType } from '@rn-accelerate-ng/core';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    ButtonComponent,
    ModalComponent,
    TableComponent,
    FormComponent,
    InputFieldComponent,
    DropdownFieldComponent,
    RichTextFieldComponent,
    TypeaheadFieldComponent,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @ViewChild('myButton') button!: ButtonComponent;
  @ViewChild('myAlert') alert!: AlertComponent;
  @ViewChild('myModal') modal!: ModalComponent;
  @ViewChild('myTable') table!: TableComponent;
  @ViewChild('myForm') form!: FormComponent;

  // button
  buttonOptions: ButtonOptions = {
    class: 'primary',
    label: 'Click Me',
  };

  // alert
  showAlert(type: string): void {
    switch (type) {
      case 'primary':
        this.alert.show('primary', 'Primary Alert', undefined);
        break;
      case 'secondary':
        this.alert.show('secondary', 'Secondary Alert', undefined);
        break;
      case 'info':
        this.alert.info('Info Alert');
        break;
      case 'success':
        this.alert.success('Success Alert');
        break;
      case 'warning':
        this.alert.warning('Warning Alert');
        break;
      case 'error':
        this.alert.error('Error Alert');
        break;
    }
  }

  // modal
  showModal(): void {
    this.modal.open();
  }

  modalOptions: ModalOptions = {
    header: {
      text: 'Modal Header',
      icon: 'exclamation-triangle-fill',
      classes: 'bg-warning',
    },
    submitBtn: {
      type: 'button',
      class: 'danger',
      label: 'Delete',
      callback: () => this.submitDelete(),
    },
    // backdropClass: 'bg-primary',
    // backdrop: 'static',
    // keyboard: false,
    // cancelBtn: false
  };

  submitDelete(): void {
    this.modal.dismissAll('Delete');
    alert('Delete Clicked');
  }

  // table
  showTable(): void {
    this.table.render();
  }

  destroyTable(): void {
    this.table.destroy();
  }

  tableOptions: TableOptions = {
    autoRender: false,
    columns: [
      {
        title: 'State',
        field: 'state',
        checkbox: true,
      },
      {
        title: 'Name',
        field: 'name',
        sortable: true,
        filterControl: 'input',
      },
      {
        title: 'Type',
        field: 'type',
        sortable: true,
        filterControl: 'input',
      },
      {
        title: 'Status',
        field: 'status.name',
        sortable: true,
        filterControl: 'select',
      },
    ],
    data: [
      {
        id: 1,
        name: 'A Name',
        type: 'AAA',
        status: {
          code: 'A',
          name: 'Active',
        },
      },
      {
        id: 2,
        name: 'B Name',
        type: 'BBB',
        status: {
          code: 'A',
          name: 'Active',
        },
      },
      {
        id: 3,
        name: 'C Name',
        type: 'CCC',
        status: {
          code: 'I',
          name: 'Inactive',
        },
      },
      {
        id: 4,
        name: 'D Name',
        type: 'DDD',
        status: {
          code: 'A',
          name: 'Active',
        },
      },
      {
        id: 5,
        name: 'E Name',
        type: 'EEE',
        status: {
          code: 'I',
          name: 'Inactive',
        },
      },
      {
        id: 6,
        name: 'F Name',
        type: 'FFF',
        status: {
          code: 'A',
          name: 'Active',
        },
      },
    ],
    toolbarButtons: [
      ToolbarHelper.addButton(() => {
        this.table.addRow({
          name: 'NEW',
          type: 'NNN',
          status: { code: 'A', name: 'Active' },
        });
        console.log(this.table.bootstrapTable('getOptions'));
      }),
      ToolbarHelper.updateButton(() => {
        const row = this.table.getSelectedRow();
        this.table.updateRow(
          merge(row, {
            name: 'UPDATED',
            status: { code: 'C', name: 'Changed' },
          }),
        );
      }),
      ToolbarHelper.deleteButton(() => {
        this.alert.error('Deleted Rows: ' + this.table.deleteSelectedRows());
      }),
      ToolbarHelper.uploadButton(() => alert('Upload')),
    ],
    filterControl: true,
    pageSize: 4,
    idField: 'type',
  };

  // form
  getFormValue(): void {
    alert(JSON.stringify(this.form.value));
  }

  supervisors: GenericType[] = [
    { id: 1, name: 'Supervisor 1' },
    { id: 2, name: 'Supervisor 2' },
    { id: 3, name: 'Supervisor 3' },
    { id: 4, name: 'Supervisor 4' },
    { id: 5, name: 'Supervisor 5' },
  ];

  formOptions: FormOptions = {
    controls: {
      name: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      startDate: ['', [FormUtil.VALIDATORS.DATE({ allowPast: false })]],
      profile: ['', []],
      comments: ['', []],
      status: ['I', []],
      content: ['', [Validators.required]],
      supervisor: ['', []],
    },
    layout: 'vertical',
    submitBtn: 'Submit',
    cancelBtn: 'Cancel',
    resetBtn: true,
    // resetValue: { firstName: 'Reset First Name', lastName: 'Reset Last Name' },
    contextParams: {
      statusOptions: [
        { code: 'A', name: 'Active' },
        { code: 'I', name: 'Inactive' },
      ],
    },
  };
}
