// external imports
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { authComponentMixin } from '@rn-accelerate-ng/auth';

// internal imports
import { AlertComponent } from './alert/alert.component';
import { ConfigOptions, ConfigurableComponent } from './bootstrap.component';

/**
 * #######################################
 * #######################################
 *
 * These claseses are defined separately here to avoid circular dependencies when injecting AlertComponent for BootstrapAppComponent
 *
 * #######################################
 * #######################################
 */

@Component({
  template: '',
})
export abstract class AbstractBaseComponent<
  $O extends ConfigOptions = ConfigOptions,
> extends authComponentMixin(ConfigurableComponent)<$O> {
  @ViewChild(AlertComponent) alert!: AlertComponent;

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.DEBUG) {
      this.alert.warning(JSON.stringify(this.config));
    }
  }

  /**
   * Overrides the `handleErrorResponse` method to display error messages in the alert component.
   * Combines a custom message (if provided) with the error message from the HTTP response.
   *
   * @param {HttpErrorResponse} response - The HTTP error response object.
   * @param {string} [message] - An optional custom error message.
   */
  override handleErrorResponse(
    response: HttpErrorResponse,
    message?: string,
  ): void {
    this.alert.error(
      (message ?? response.error.message) + ` [${response.error.error}]`,
    );
  }
}

// export const BootstrapAppComponent = AngbParentComponent;
