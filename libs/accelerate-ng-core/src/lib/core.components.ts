// external imports
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';

// internal imports
import { ActivatedRoute } from '@angular/router';
import { RouteService } from './core.services';

/**
 * Abstract base component class to provide common functionality
 */
@Component({
  template: '',
})
export abstract class BaseComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  protected readonly routeService: RouteService = inject(RouteService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  private _NAME: string = this.constructor.name;
  private __DEBUG: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.__DEBUG.set(params['__DEBUG'] !== undefined);
    });
  }

  get DEBUG(): boolean {
    return this.__DEBUG();
  }

  /**
   * Lifecycle hooks
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.DEBUG) {
      console.debug(`${this._NAME}.ngOnChanges:`, changes);
    }
  }

  ngOnInit(): void {
    if (this.DEBUG) {
      console.debug(`${this._NAME}.ngOnInit`);
    }
  }

  ngDoCheck(): void {
    if (this.DEBUG) {
      console.debug(`${this._NAME}.ngDoCheck`);
    }
  }

  ngAfterContentInit(): void {
    if (this.DEBUG) {
      console.debug(`${this._NAME}.ngAfterContentInit`);
    }
  }

  ngAfterContentChecked(): void {
    if (this.DEBUG) {
      console.debug(`${this._NAME}.ngAfterContentChecked`);
    }
  }

  ngAfterViewInit(): void {
    if (this.DEBUG) {
      console.debug(`${this._NAME}.ngAfterViewInit`);
    }

    window.setTimeout(() => {
      this.delayedAfterViewInit();
    }, 10);
  }

  delayedAfterViewInit(): void {
    if (this.DEBUG) {
      console.debug(`${this._NAME}.delayedAfterViewInit`);
    }
  }

  ngAfterViewChecked(): void {
    if (this.DEBUG) {
      console.debug(`${this._NAME}.ngAfterViewChecked`);
    }
  }

  ngOnDestroy(): void {
    if (this.DEBUG) {
      console.debug(`${this._NAME}.ngOnDestroy`);
    }
  }

  /**
   * Helper methods
   */
  handleErrorResponse(response: HttpErrorResponse, message?: string): void {
    console.error(
      (message ?? response.error.message) + ` [${response.error.error}]`,
    );
  }
}
