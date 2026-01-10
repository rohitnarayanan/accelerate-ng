// external imports
import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, Signal } from '@angular/core';

// internal imports
import { AbstractBaseComponent } from '../app.component';
import { ConfigOptions } from '../bootstrap.component';

// config options
export interface ErrorOptions extends ConfigOptions {
  code: number;
  message: string;
  support?: {
    label: string;
    url: string;
  };
  home?: {
    label: string;
    url: string;
  };
}

// component definition
@Component({
  selector: 'ang-error',
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent
  extends AbstractBaseComponent<ErrorOptions>
  implements OnInit
{
  protected message: Signal<string> = computed(() => {
    return this.getMessage(this.config);
  });

  /** ConfigurableComponent overrides **/
  private getMessage(_config: Partial<ErrorOptions>): string {
    // this.routeService.snapshot.data as ErrorOptions;
    switch (_config.code) {
      case 404:
        return (_config.message ??= 'Page not found');
      case 403:
        return (_config.message ??= 'Access denied');
      case 500:
        return (_config.message ??= 'Internal server error');
      case 401:
        return (_config.message ??= 'Unauthorized');
      default:
        return (_config.message ??= 'An unknown error occurred');
    }
  }

  override defaultOptions(): Partial<ErrorOptions> {
    return {
      code: 404,
      support: {
        label: 'Contact Support',
        url: 'javascript:void(0);',
      },
      home: {
        label: 'Home',
        url: '/',
      },
    };
  }
}
