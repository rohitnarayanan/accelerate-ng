// external imports
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { BootstrapTableColumn, BootstrapTableOptions } from 'bootstrap-table';

// internal imports
import { GenericType, HtmlAttributesDirective } from '@rn-accelerate-ng/core';
import { ConfigOptions, ConfigurableComponent } from '../bootstrap.component';
import { ButtonComponent, ButtonOptions } from '../button/button.component';

// component definition
@Component({
  selector: 'ang-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, HtmlAttributesDirective],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent
  extends ConfigurableComponent<TableOptions>
  implements AfterViewInit
{
  @ViewChild('table') private tableElement!: ElementRef<HTMLElement>;

  private _rendered: WritableSignal<boolean> = signal(false);
  private _table!: JQuery<HTMLElement>;
  private idField = 'id';

  /** Lifecycle methods **/
  override delayedAfterViewInit(): void {
    this._table = jQuery(this.tableElement.nativeElement);
    if (this.config.autoRender !== false) {
      this.render();
    }
  }

  /** ConfigurableComponent overrides **/
  override configKey = 'table';

  override configureOptions(currentOptions: Partial<TableOptions>): void {
    this.idField = currentOptions.idField ?? this.idField;
    currentOptions.uniqueId = currentOptions.idField;
    currentOptions.toolbar = '#table-toolbar';

    // if (currentOptions.columns) {
    //   let columnList = currentOptions.columns;
    //   // table has a multi-row header
    //   if (Array.isArray(currentOptions.columns[0])) {
    //     (currentOptions.columns as ColumnOptions[][]).filter((columns, index, list) => index < list.length - 1).forEach((columns: ColumnOptions[]) => {
    //       columns.forEach((column: ColumnOptions) => { this.__setColumnStyle(column, column.alignStyle ?? 'center'); })
    //     });
    //     columnList = currentOptions.columns.at(-1) as ColumnOptions[];
    //   }

    //   for (const innercolumn of columnList) {
    //     if (innercolumn.alignStyle) {
    //       this.__setColumnStyle(innercolumn, innercolumn.alignStyle);
    //     }
    //   }
    // }

    // change icon for filter control switch
    // if (currentOptions.filterControl && currentOptions.icons) {
    //   (currentOptions.icons as GenericType)['filterControlSwitchHide'] ??= 'bi bi-funnel-fill';
    //   (currentOptions.icons as GenericType)['filterControlSwitchShow'] ??= 'bi bi-funnel';
    // }

    // configure toolbar buttons to disable based on row selection
    // for (const toolbar of currentOptions.toolbars ?? []) {
    for (const button of currentOptions.toolbarButtons ?? []) {
      if (button.linkToRow || button.linkToRows) {
        button.disabled = () => {
          return this.isButtonDisabled(button);
        };
      }
    }
    // }
  }

  override defaultOptions(): Partial<TableOptions> {
    return {
      autoRender: true,
      columns: [],
      toolbarButtons: [],

      idField: 'id',
      classes: 'table table-bordered table-hover table-striped',
      clickToSelect: true,
      search: true,

      // export
      // exportDataType: 'all',
      // exportTypes: ['xlsx'],

      // filter control
      filterControl: false,
      filterControlVisible: false,
      icons: {},
      showFilterControlSwitch: true,

      // mobile
      mobileResponsive: false,
      minWidth: 576,
      minHeight: undefined,
      heightThreshold: 100,
      checkOnInit: true,
      columnsHidden: [],

      // pagination
      pageSize: 5,
      pageList: [5, 10, 20, 100],
      pagination: true,
      paginationLoop: false,
      showPaginationSwitch: true,

      // toolbar
      showColumns: true,
      showColumnsToggleAll: true,
      // showExport: true,
      showFullscreen: true,
      showRefresh: true,
      showToggle: true,
      stickyHeader: true,
    };
  }

  /** Component methods **/
  get rendered(): boolean {
    return this._rendered();
  }

  get bootstrapOptions(): TableOptions {
    return this.bootstrapTable('getOptions') as TableOptions;
  }

  get table(): JQuery<HTMLElement> {
    return this._table;
  }

  bootstrapTable(method: string, param?: unknown) {
    return this.table?.bootstrapTable(method, param);
  }

  render(updatedOptions?: Partial<TableOptions>) {
    this.updateOptions(updatedOptions);

    this.bootstrapTable('destroy').bootstrapTable(this.config);
    this._rendered.set(true);
    // $('button[name="filterControlSwitch"]').on('click', () => {
    //   this.bootstrapTable('resetSearch');
    // });
  }

  destroy() {
    this.bootstrapTable('destroy');
    this._rendered.set(false);
  }

  load(data: GenericType[]) {
    this.bootstrapTable('hideLoading')
      .bootstrapTable('resetView')
      .bootstrapTable('load', data);
  }

  refresh() {
    this.bootstrapTable('refresh');
  }

  getData<T extends GenericType>(): T[] {
    return this.bootstrapTable('getData') ?? [];
  }

  getSelectedRows<T extends GenericType>(): T[] {
    return this.bootstrapTable('getSelections') ?? [];
  }

  getSelectedRow<T extends GenericType>(): T {
    return this.getSelectedRows<T>()[0];
  }

  getSelectedRowsCount(): number {
    return this.getSelectedRows().length;
  }

  unselectAllRows() {
    this.bootstrapTable('uncheckAll');
  }

  addRow(row: GenericType) {
    this.bootstrapTable('append', row);
    this.bootstrapTable('selectPage', this.bootstrapOptions.totalPages);

    this.unselectAllRows();
    this.highlightRow(row[this.idField]);
  }

  updateRow(row: GenericType) {
    this.bootstrapTable('updateByUniqueId', {
      id: row[this.idField],
      row: row,
    });

    this.unselectAllRows();
    this.highlightRow(row[this.idField]);
  }

  deleteSelectedRows(): (string | number)[] {
    const ids = this.getSelectedRows<GenericType>().map(
      (row: GenericType) => row[this.idField],
    );
    this.deleteRows(ids);
    return ids as (string | number)[];
  }

  // deleteRow(row: GenericType) {
  //   this.highlightRow(row[this.idField], true);
  //   this.unselectAllRows();

  //   this.bootstrapTable('removeByUniqueId', row[this.idField]);
  // }

  deleteRows(ids: unknown[]) {
    ids.forEach((id: unknown) => {
      this.highlightRow(id, true);
    });
    console.log('deleting table rows for:', ids);
    this.bootstrapTable('remove', {
      field: this.idField,
      values: ids,
    });
  }

  highlightRow(id: unknown, error = false) {
    $(`tr[data-uniqueid=${id}]`).addClass(
      error ? 'highlight-error' : 'highlight-update',
    );
    window.setTimeout(() => {
      $(`tr[data-uniqueid=${id}]`).removeClass(
        'highlight-update highlight-error',
      );
    }, 5000);
  }

  private isButtonDisabled(button: ToolbarButton): boolean {
    if (button.linkToRow) {
      return this.getSelectedRowsCount() !== 1;
    }

    if (button.linkToRows) {
      return this.getSelectedRowsCount() < 1;
    }

    return false;
  }

  private __setColumnStyle(column: ColumnOptions, style: string) {
    const styles = style.split('-');
    column.halign ??= styles[0];
    column.align ??= styles.at(-1);
    column.valign ??= 'middle';
  }
}

export interface TableOptions extends ConfigOptions, BootstrapTableOptions {
  // custom options
  autoRender?: boolean;
  toolbarButtons?: ToolbarButton[];

  // missing options
  escapeTitle?: boolean;
  regexSearch?: boolean;
  searchable?: boolean;
  paginationLoadMore?: boolean;
  totalPages?: number;
  onTogglePagination?: (state: boolean) => void;
  onVirtualScroll?: (startIndex: number, endIndex: number) => void;

  /** overrides **/
  columns?: ColumnOptions[];
  // icons?: {} extends BootstrapTableIcons;

  /** locale **/
  formatNoMatches?: () => string;

  /** extensions **/
  stickyHeader?: boolean;

  // filterControl
  filterControl?: boolean;
  filterControlVisible?: boolean;
  filterControlMultipleSearch?: boolean;
  filterControlMultipleSearchDelimiter?: string;
  showFilterControlSwitch?: boolean;

  // mobile
  mobileResponsive?: boolean;
  minWidth?: number;
  minHeight?: number;
  heightThreshold?: number;
  checkOnInit?: boolean;
  columnsHidden?: string[];

  // export
  showExport?: boolean;
  exportDataType?: 'basic' | 'all' | 'selected';
  exportOptions?: {
    fileName: string;
  };
  exportTypes?: string[];

  // tree grid
  treeEnable?: boolean;
  treeShowField?: string;
  parentIdField?: string;
  rootParentId?: string;
}

export interface ColumnOptions extends BootstrapTableColumn {
  alignStyle?: string;
  filterControl?: 'input' | 'select' | 'datepicker';
}

export interface ToolbarButton extends ButtonOptions {
  linkToRow?: boolean;
  linkToRows?: boolean;
}

export class ToolbarHelper {
  static addButton(callback: () => void): ToolbarButton {
    return {
      type: 'button',
      class: 'primary',
      label: 'Add',
      icon: 'plus-lg',
      callback: callback,
    };
  }

  static updateButton(callback: () => void): ToolbarButton {
    return {
      type: 'button',
      class: 'secondary',
      label: 'Update',
      icon: 'arrow-clockwise',
      callback: callback,
      linkToRow: true,
    };
  }

  static deleteButton(callback: () => void): ToolbarButton {
    return {
      type: 'button',
      class: 'danger',
      label: 'Delete',
      icon: 'trash3',
      callback: callback,
      linkToRows: true,
    };
  }

  static uploadButton(callback: () => void): ToolbarButton {
    return {
      type: 'button',
      class: 'warning',
      label: 'Upload',
      icon: 'upload',
      callback: callback,
    };
  }

  static downloadButton(callback: () => void): ToolbarButton {
    return {
      type: 'button',
      class: 'success',
      label: 'Download',
      icon: 'download',
      callback: callback,
    };
  }
}
