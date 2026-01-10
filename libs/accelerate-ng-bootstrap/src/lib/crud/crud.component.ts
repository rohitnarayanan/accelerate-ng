// external imports
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  effect,
  Injectable,
  input,
  InputSignal,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { BootstrapAjaxParams } from 'bootstrap-table';
import { merge } from 'lodash-es';

// internal imports
import { GenericType } from '@rn-accelerate-ng/core';
import { DownloadResponse, HttpUtil } from '@rn-accelerate-ng/http';
import {
  BackendService,
  BulkDeleteResponse,
  ListResponse,
  ReadModel,
  UploadResponse,
  WriteModel,
} from '@rn-accelerate-ng/http/crud';
import { AbstractBaseComponent } from '../app.component';
import { ConfigOptions, ConfigurableComponent } from '../bootstrap.component';
import { ButtonComponent } from '../button/button.component';
import { FormComponent, FormOptions, InputFieldComponent } from '../form';
import { ModalComponent, ModalOptions } from '../modal/modal.component';
import {
  ColumnOptions,
  TableComponent,
  TableOptions,
  ToolbarHelper,
} from '../table/table.component';

// global variables
type COMPONENT_MODES = 'list' | 'addupdate' | 'upload' | 'download';

// types
export interface CRUDOptions extends ConfigOptions {
  list: Partial<TableOptions>;
  addUpdate: Partial<FormOptions>;
  delete: Partial<ModalOptions>;
  upload: Partial<FormOptions>;
  download: Partial<FormOptions>;
}

// component definition
@Component({
  selector: 'ang-crud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormComponent,
    InputFieldComponent,
    ModalComponent,
    TableComponent,
  ],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss',
})
export class CRUDComponent extends ConfigurableComponent<CRUDOptions> {
  manager: InputSignal<CRUDManagerComponent<WriteModel, ReadModel>> =
    input.required();
  addUpdateFormTemplate: InputSignal<TemplateRef<unknown>> = input.required();
  downloadFormTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<
    TemplateRef<unknown> | undefined
  >();
  componentMode: InputSignal<COMPONENT_MODES> = input<COMPONENT_MODES>('list');
  currentMode: WritableSignal<COMPONENT_MODES> = signal<COMPONENT_MODES>(
    this.componentMode(),
  );

  @ViewChild('listTable') readonly listTable!: TableComponent;
  @ViewChild('addUpdateForm') readonly addUpdateForm!: FormComponent;
  @ViewChild('deleteModal') readonly deleteModal!: ModalComponent;
  @ViewChild('uploadForm') readonly uploadForm!: FormComponent;
  @ViewChild('downloadForm') readonly downloadForm!: FormComponent;
}

@Injectable()
export abstract class CRUDManagerComponent<
  $Q extends WriteModel,
  $S extends ReadModel,
  $O extends CRUDOptions = CRUDOptions,
> extends AbstractBaseComponent<$O> {
  @ViewChild('crudComponent') protected crudComponent!: CRUDComponent;

  private _name: string;
  private _permissionKey: string;
  private _addUpdateMode: 'add' | 'update' = 'add';

  constructor(name: string, permissionKey: string) {
    super();
    this._name = name[0].toUpperCase() + name.slice(1);
    this._permissionKey = permissionKey;

    effect(() => {
      // this.updateOptions(this.crudComponent?._finalOptions());
    });
  }

  /** ConfigurableComponent overrides **/
  override defaultOptions(): Partial<$O> {
    return {
      list: {},
      addUpdate: {},
      delete: {},
      upload: {},
      download: {},
    } as Partial<$O>;
  }

  /** shortcut accessors for underlying C-R-U-D components **/
  get listTable(): TableComponent {
    return this.crudComponent?.listTable;
  }

  get addUpdateForm(): FormComponent {
    return this.crudComponent?.addUpdateForm;
  }

  get deleteModal(): ModalComponent {
    return this.crudComponent?.deleteModal;
  }

  get uploadForm(): FormComponent {
    return this.crudComponent?.uploadForm;
  }

  get downloadForm(): FormComponent {
    return this.crudComponent?.downloadForm;
  }

  /** Getter / Setters **/
  get name(): string {
    return this._name;
  }

  get pluralName(): string {
    return `${this.name}s`;
  }

  get permissionKey(): string {
    return this._permissionKey;
  }

  protected updatePermissionKey(permissionKey: string) {
    this._permissionKey = permissionKey;
  }

  get addUpdateMode(): 'add' | 'update' {
    return this._addUpdateMode;
  }

  protected updateComponentMode(mode: COMPONENT_MODES) {
    this.crudComponent.currentMode.set(mode);
    this.alert.hide();
  }

  // common methods
  abstract get domainService(): BackendService<$Q, $S>;

  protected checkPermission(suffix: string): boolean {
    const access = this.permissionKey
      ? this.authService.hasPermission(`${this.permissionKey}.${suffix}`)
      : true;
    console.debug(
      `Permission check: %s.%s = %s`,
      this.permissionKey,
      suffix,
      access,
    );
    return access;
  }

  protected formCancel() {
    this.alert.hide();
    this.updateComponentMode('list');
  }

  override handleErrorResponse(
    response: HttpErrorResponse,
    message?: string,
  ): void {
    this.alert.error(
      (message ?? response.error.message) + ` [${response.error.error}]`,
    );
  }

  /** Feature Toggle methods **/
  enableList(): boolean {
    return this.checkPermission('list');
  }
  enableAdd(): boolean {
    return this.checkPermission('create');
  }
  enableUpdate(): boolean {
    return this.checkPermission('update');
  }
  enableAddUpdate(): boolean {
    return this.enableAdd() || this.enableUpdate();
  }
  enableDelete(): boolean {
    return this.checkPermission('delete');
  }
  enableUpload(): boolean {
    return this.checkPermission('upload');
  }
  enableDownload(): boolean {
    return this.checkPermission('download');
  }

  /** LIST Operations **/
  abstract tableColumns(): ColumnOptions[];

  tableOptions(): Partial<TableOptions> {
    let rows: $S[] = [];
    return merge(
      {
        columns: this.tableColumns(),
        ajax: (params: BootstrapAjaxParams) => this.tableDataSource(params),
        showExport: false,
        mobileResponsive: false,
        // showToggle: false,
        pageSize: 10,
        paginationLoadMore: true,
        queryParams: (params: GenericType) => {
          params['limit'] = 2000;
          params['offset'] = rows.length;
          this.adjustTableQueryParams(params);
          return params;
        },
        responseHandler: (response: ListResponse<$S>) => {
          rows = this.handleListResponse(rows, response);
          return rows;
        },
        formatNoMatches: () => `No Records found`,
        toolbarButtons: [
          ...(this.enableAdd()
            ? [ToolbarHelper.addButton(() => this.startAdd())]
            : []),
          ...(this.enableUpdate()
            ? [ToolbarHelper.updateButton(() => this.startUpdate())]
            : []),
          ...(this.enableDelete()
            ? [ToolbarHelper.deleteButton(() => this.startDelete())]
            : []),
          ...(this.enableUpload()
            ? [ToolbarHelper.uploadButton(() => this.startUpload())]
            : []),
          ...(this.enableDownload()
            ? [ToolbarHelper.downloadButton(() => this.startDownload())]
            : []),
        ],
        filterControl: false,
        exportOptions: {
          fileName: this.pluralName,
        },
      },
      this.config.list,
    );
  }

  protected adjustTableQueryParams(_params: GenericType): void {
    // override to add custom query params
  }

  protected handleListResponse(rows: $S[], response: ListResponse<$S>): $S[] {
    return rows.concat(response.results);
  }

  protected tableDataSource(params: BootstrapAjaxParams) {
    this.domainService
      .list(params.data)
      .subscribe((response: ListResponse<$S>) => {
        if (response instanceof HttpErrorResponse) {
          params.error({ status: response.status } as JQueryXHR);
          this.listTable.table.find('tr td').text(response.error.message);
          return;
        }

        console.debug(
          'EntityCRUDManager.tableDataSource.data: %s',
          response.count,
        );
        params.success(response);
      });
  }

  /** ADD-UPDATE Operations **/
  protected abstract addUpdateformControls(): GenericType;
  protected abstract toAddUpdateFormValue(data: $S): $Q;

  addUpdateFormOptions(): Partial<FormOptions> {
    return merge(
      {
        controls: this.addUpdateformControls(),
        // contextParams: {
        //   manager: this,
        // }
      },
      this.config.addUpdate,
    );
  }

  protected startAdd() {
    this.alert.hide();

    this._addUpdateMode = 'add';
    this.addUpdateForm.updateOptions({ header: `Add ${this.name}` });
    this.addUpdateForm.reset();

    this.updateComponentMode('addupdate');
  }

  protected startUpdate() {
    this.alert.hide();

    const data = this.listTable.getSelectedRow<$S>();
    console.info('%s.update.start: ', this.name, JSON.stringify(data));

    this._addUpdateMode = 'update';
    this.addUpdateForm.updateOptions({ header: `Update ${this.name}` });
    this.addUpdateForm.update(this.toAddUpdateFormValue(data) as GenericType);

    this.updateComponentMode('addupdate');
  }

  submitAddUpdate() {
    console.info(
      '%s.%s.end: %O',
      this.name,
      this._addUpdateMode,
      this.addUpdateForm.rawValue,
    );

    if (!this.validateAddUpdate()) {
      this.addUpdateForm.enable();
      return;
    }

    const writeObject = this.fromAddUpdateFormValue();

    if (this._addUpdateMode === 'add') {
      this.alert.start(`Adding ${this.name} ...`);

      this.domainService.create(writeObject).subscribe((response: $S) => {
        this.handleAddUpdateResponse(response);
      });
    } else {
      this.alert.start(`Updating ${this.name} ...`);

      this.domainService
        .update(writeObject.id ?? -1, writeObject)
        .subscribe((response: $S) => {
          this.handleAddUpdateResponse(response);
        });
    }
  }

  protected validateAddUpdate(): boolean {
    return true;
  }

  protected fromAddUpdateFormValue(): $Q {
    return Object.entries(this.addUpdateForm.rawValue).reduce(
      (result: $Q, [key, value]) => {
        // nullify empty strings, convert childs objects to ids
        (result as GenericType)[key] = !value
          ? null
          : typeof value === 'object'
            ? (value as $Q).id
            : value;
        return result;
      },
      {} as $Q,
    );
  }

  protected handleAddUpdateResponse(response: $S) {
    if (response instanceof HttpErrorResponse) {
      this.handleErrorResponse(response);
      this.addUpdateForm.enable();
      return;
    }

    if (this._addUpdateMode === 'add') {
      this.alert.success(`Added ${this.name} successfully`);
      this.listTable.addRow(response as GenericType);
    } else {
      this.alert.success(`Updated ${this.name} successfully`);
      this.listTable.updateRow(response as GenericType);
    }

    this.updateComponentMode('list');
  }

  cancelAddUpdate(): void {
    this.formCancel();
  }

  /** DELETE Operations **/
  deleteModalOptions(): Partial<ModalOptions> {
    return merge(
      {
        keyboard: false,
        backdrop: 'static',
        header: {
          text: `Delete ${this.pluralName}`,
          icon: 'exclamation-triangle-fill',
          classes: 'text-bg-secondary',
        },
        submitBtn: {
          type: 'button',
          class: 'danger',
          label: 'Delete',
          callback: () => this.submitDelete(),
        },
      },
      this.config.delete,
    );
  }

  protected startDelete() {
    this.alert.hide();
    this.deleteModal.updateOptions({
      context: {
        name: this.name,
        count: this.listTable?.getSelectedRowsCount(),
      },
    });
    this.deleteModal.open();
  }

  submitDelete(): void {
    this.deleteModal.dismissAll('Submit');
    this.alert.start(`Deleting ${this.pluralName} ...`);

    const ids = this.listTable.getSelectedRows<$S>().map((row: $S) => row.id);

    this.domainService
      .bulkDelete(ids)
      .subscribe((response: BulkDeleteResponse) => {
        if (response instanceof HttpErrorResponse) {
          this.handleErrorResponse(response);
          return;
        }

        this.alert.success(response.message);
        this.listTable.deleteRows(ids);
      });
  }

  /** UPLOAD Operations **/
  downloadTemplate(includeData: boolean): void {
    this.domainService
      .uploadTemplate({ prefill: includeData })
      .subscribe((response: DownloadResponse) => {
        if (response instanceof HttpErrorResponse) {
          this.handleErrorResponse(response);
          return;
        }

        HttpUtil.downloadFile(response);
      });
  }

  uploadFormOptions(): Partial<FormOptions> {
    return merge(
      {
        controls: {
          uploadFile: ['', [Validators.required]],
        },
        header: `Upload ${this.pluralName}`,
        submitBtn: 'Upload',
      },
      this.config.upload,
    );
  }

  protected startUpload() {
    this.alert.hide();
    this.updateComponentMode('upload');
    this.uploadForm.reset();
  }

  submitUpload(): void {
    this.alert.start(`Uploading ${this.pluralName} ...`);
    this.updateComponentMode('list');

    this.domainService
      .upload('uploadFile')
      .subscribe((response: UploadResponse) => {
        if (response instanceof HttpErrorResponse) {
          this.handleErrorResponse(response);
          return;
        }

        console.debug('submitUpload.success:', response);
        if (response.errors > 0) {
          this.alert.error(
            `${this.pluralName} uploaded with errors [Added ${response.inserts} | Updated: ${response.updates} | Errored: ${response.errors}]`,
          );
        } else {
          this.alert.success(
            `${this.pluralName} uploaded successfully [Added ${response.inserts} | Updated: ${response.updates}]`,
          );
        }
        this.listTable.refresh();
      });
  }

  cancelUpload(): void {
    this.formCancel();
  }

  /** DOWNLOAD Operations **/
  protected downloadFormControls(): GenericType {
    return {};
  }

  downloadFormOptions(): Partial<FormOptions> {
    return merge(
      {
        controls: this.downloadFormControls(),
        header: `Download ${this.pluralName}`,
        // contextParams: {
        //   manager: this,
        // }
      },
      this.config.download,
    );
  }

  protected startDownload() {
    this.alert.hide();
    this.updateComponentMode('download');
    this.downloadForm.reset();
  }

  submitDownload(): void {
    const params = Object.entries(this.downloadForm.rawValue).reduce(
      (result: $Q, [key, value]) => {
        (result as GenericType)[key] = !value
          ? null
          : typeof value === 'object'
            ? (value as $Q).id
            : value;
        return result;
      },
      {} as $Q,
    );

    this.domainService
      .download(params)
      .subscribe((response: DownloadResponse) => {
        this.updateComponentMode('list');

        if (response instanceof HttpErrorResponse) {
          this.handleErrorResponse(response);
          return;
        }

        HttpUtil.downloadFile(response);
      });
  }

  cancelDownload(): void {
    this.formCancel();
  }
}
