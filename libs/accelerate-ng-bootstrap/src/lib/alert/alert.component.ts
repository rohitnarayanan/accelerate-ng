// external imports
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { HtmlAttributesDirective } from '@rn-accelerate-ng/core';

// internal imports
import { ConfigOptions, ConfigurableComponent } from '../bootstrap.component';
import { STYLE } from '../bootstrap.types';

/**
 * The `AlertComponent` is a configurable alert component that extends the `ConfigurableHtmlComponent`
 * and implements the `AfterViewInit` lifecycle hook. It provides functionality to display alerts
 * with various styles, icons, and messages, as well as simulate success and failure scenarios.
 *
 * @template AlertOptions - The type of options used to configure the alert component.
 */
@Component({
  selector: 'ang-alert',
  standalone: true,
  imports: [CommonModule, NgbAlert, HtmlAttributesDirective],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent
  extends ConfigurableComponent<AlertOptions>
  implements AfterViewInit
{
  @ViewChild('ngbAlert') private ngbAlert!: NgbAlert;

  /**
   * The type of the alert (e.g., success, warning, danger).
   */
  protected type: WritableSignal<STYLE> = signal('primary');

  /**
   * Icon to display in the alert.
   */
  protected icon: WritableSignal<string | undefined> = signal(undefined);

  /**
   * Message to display in the alert.
   */
  protected message: WritableSignal<string | undefined> = signal(undefined);

  /**
   * Message to display while the alert is in a loading state.
   */
  protected loadingMessage: WritableSignal<string | undefined> =
    signal(undefined);

  // Signals to control the alert state
  protected hidden: WritableSignal<boolean> = signal(true);
  protected loading: WritableSignal<boolean> = signal(false);
  protected progress: WritableSignal<number> = signal(0);
  protected interval?: ReturnType<typeof setInterval>;
  protected showProgress = computed(() => this.progress() > 0);
  protected isVisible = computed(() => !this.hidden());

  // constructor() {
  //   super();

  //   // Effect for auto-hiding logic
  //   effect(() => {
  //     if (this.progress() >= 100) {
  //       this.hidden.set(true);
  //     }
  //   });
  // }

  /** Lifecycle methods **/
  override ngAfterViewInit(): void {
    this.ngbAlert.closed.subscribe(() => {
      this.hide();
    });
  }

  show(type: STYLE, message: string, icon?: string) {
    this.type.set(type);
    this.message.set(message);
    this.icon.set(icon ?? this.config.icons[type]);

    this.loading.set(false);
    this.hidden.set(false);
    this.progress.set(0);
    clearInterval(this.interval);

    // to show ngbAlert after it has been dismissed
    $(this.ngbAlert['_elementRef'].nativeElement).addClass('show');
  }

  hide() {
    this.loading.set(false);
    this.hidden.set(true);
    clearInterval(this.interval);
  }

  start(message: string, type: STYLE = 'secondary') {
    this.show(type, message, 'exclamation-circle');

    this.progress.set(this.config.progress.init);
    this.interval = setInterval(() => {
      this.progress.set(this.progress() + this.config.progress.increment);
    }, this.config.progress.interval);
  }

  // shortcuts
  success(message: string, icon?: string) {
    this.show('success', message, icon ?? this.config.icons?.success);
  }

  info(message: string, icon?: string) {
    this.show('info', message, icon ?? this.config.icons?.info);
  }

  warning(message: string, icon?: string) {
    this.show('warning', message, icon ?? this.config.icons?.warning);
  }

  error(message: string, icon?: string) {
    this.show('danger', message, icon ?? this.config.icons?.danger);
  }

  simulateSuccess(
    loadingMessage: string,
    message: string,
    callback?: () => void,
  ) {
    this.start(loadingMessage);
    return setTimeout(() => {
      this.success(message);
      if (callback) {
        callback();
      }
    }, 5000);
  }

  simulateFailure(
    loadingMessage: string,
    message: string,
    callback?: () => void,
  ) {
    this.start(loadingMessage);
    return setTimeout(() => {
      this.error(message);
      if (callback) {
        callback();
      }
    }, 5000);
  }

  /**
   * ConfigurableComponent overrides
   */
  override configKey = 'alert';

  override defaultOptions(): Partial<AlertOptions> {
    return {
      animation: true,
      dismissible: true,
      type: '',
      style: 'primary',
      icon: '',
      icons: {
        success: 'check-circle',
        info: 'info-circle',
        warning: 'exclamation-circle',
        danger: 'exclamation-triangle',
      },
      message: '',
      loadingMessage: '',
      progress: {
        init: 40,
        increment: 1,
        interval: 500,
      },
    };
  }
}

/**
 * Interface representing the configuration options for the `AlertComponent`.
 */
export interface AlertOptions extends ConfigOptions {
  /* ######## NgbAlert Options ######## */
  /**
   * Whether the alert should have animation.
   */
  animation: boolean;

  /**
   * Whether the alert is dismissable by the user.
   */
  dismissible: boolean;

  /**
   * Other icons for different alert types.
   */
  icons: Partial<{ [key in STYLE]: string }>;

  /**
   * Configuration for the progress bar in the alert.
   */
  progress: {
    /**
     * Initial value of the progress bar.
     */
    init: number;

    /**
     * Increment value for the progress bar.
     */
    increment: number;

    /**
     * Interval (in milliseconds) for updating the progress bar.
     */
    interval: number;
  };
}
