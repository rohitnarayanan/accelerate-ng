import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';

// internal imports
import {
  ACCELERATE_APP_CONFIG_TOKEN,
  AccelerateCoreConfig,
  GenericType,
} from '@rn-accelerate-ng/core';
import { ConfigOptions, ConfigurableComponent } from '../bootstrap.component';
import { Navbar, NavbarOptions } from '../navbar/navbar';
import { UserSettingsService } from '../user';
import { Brand, BrandOptions } from './brand/brand';
import { Watermark, WatermarkOptions } from './watermark/watermark';

/**
 * Header component
 */
@Component({
  selector: 'ang-header',
  standalone: true,
  imports: [CommonModule, Brand, Watermark, Navbar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent
  extends ConfigurableComponent<HeaderOptions>
  implements OnInit
{
  /** Input properties **/
  readonly template: InputSignal<TemplateRef<unknown> | undefined> = input<
    TemplateRef<unknown> | undefined
  >();
  readonly contextParams: InputSignal<GenericType> = input<GenericType>({});

  private appConfig: AccelerateCoreConfig = inject(ACCELERATE_APP_CONFIG_TOKEN);
  private userSettingsService: UserSettingsService =
    inject(UserSettingsService);
  protected navbarColor: WritableSignal<string> = signal('default');

  constructor() {
    super();

    effect(() => {
      this.navbarColor.set(this.config.navbarColor ?? 'default');

      this.userSettingsService.registerChangeListener(
        'navbarColor',
        (navbarColor: string) => {
          console.info('HeaderComponent.navbarColor.changed: ' + navbarColor);
          this.navbarColor.set(navbarColor);
        },
      );
    });
  }

  /** ConfigurableComponent overrides **/
  override configKey = 'header';

  override defaultOptions(): Partial<HeaderOptions> {
    return {
      id: 'headerMenu',
      navbarColor: 'default',
      position: {
        brand: 'left',
        menu: 'right',
      },
    };
  }

  override configureOptions(currentOptions: Partial<HeaderOptions>): void {
    currentOptions.id = currentOptions.id ?? `${this.appConfig.name}-header`;

    if (currentOptions.watermark) {
      currentOptions.watermark.breakpoint ??= currentOptions.navbar?.breakpoint;
    }

    if (currentOptions.navbar) {
      currentOptions.navbar.id ??= `${currentOptions.id}-navbar`;
    }
  }

  getBrandPosition(): string {
    const position = this.config.position?.brand ?? 'left';
    const classes = {
      left: 'start-0 ms-2',
      center: 'start-50 translate-middle-x',
      right: 'end-0 me-2',
    };
    return `position-absolute top-50 translate-middle-y ${classes[position]}`;
  }

  getMenuPosition(): string {
    const position = this.config.position?.menu ?? 'right';
    const togglerPosition = this.config.position?.toggler ?? position;
    const marginClass = togglerPosition === 'left' ? 'e' : 's';

    return position === 'left'
      ? 'me-auto'
      : position === 'right'
        ? 'ms-auto'
        : togglerPosition === 'center'
          ? 'mx-auto'
          : `m${marginClass}-auto mx-${this.config.navbar.breakpoint}-auto`;
  }
}

export interface HeaderOptions extends ConfigOptions {
  id?: string;
  navbarColor?: string;
  headerClass?: string;
  containerClass?: string;
  watermark?: WatermarkOptions;
  brand?: BrandOptions;
  navbar: NavbarOptions;
  position?: {
    brand?: 'left' | 'right' | 'center';
    menu?: 'left' | 'right' | 'center';
    toggler?: 'left' | 'right' | 'center';
  };
}
