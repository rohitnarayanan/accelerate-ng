// external imports
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Signal,
  TemplateRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';

// internal imports
import { AuthService } from '@rn-accelerate-ng/auth';
import {
  GenericType,
  HtmlAttributesDirective,
  TemplateContext,
} from '@rn-accelerate-ng/core';
import { ConfigOptions, ConfigurableComponent } from '../bootstrap.component';
import { BREAKPOINT } from '../bootstrap.types';
import { ColorMode } from '../color-mode/color-mode';
import { Offcanvas, OffcanvasOptions } from '../offcanvas/offcanvas';
import {
  DIVIDER,
  NAV_ITEM_TYPE,
  NAV_LINK_TYPE,
  NavItem,
  NavLink,
  SubMenuItem,
} from './navbar.types';

@Component({
  selector: 'ang-navbar',
  imports: [
    CommonModule,
    RouterLink,
    HtmlAttributesDirective,
    Offcanvas,
    ColorMode,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar extends ConfigurableComponent<NavbarOptions> {
  readonly template: InputSignal<TemplateRef<unknown> | undefined> = input<
    TemplateRef<unknown> | undefined
  >();
  readonly contextParams: InputSignal<GenericType> = input<GenericType>({});

  private authService: AuthService = inject(AuthService);

  protected readonly offcanvasTarget: Signal<string | undefined> = computed(
    () =>
      this.config.offcanvas?.id ? `#${this.config.offcanvas.id}` : undefined,
  );
  protected readonly templateContext: Signal<TemplateContext> = computed(() => {
    return {
      $implicit: {
        config: this.config,
        offcanvasTarget: this.offcanvasTarget(),
        ...this.contextParams(),
      },
    };
  });

  override configureOptions(currentOptions: Partial<NavbarOptions>): void {
    if (currentOptions.offcanvas) {
      currentOptions.offcanvas.id ??= `${currentOptions.id}-offcanvas`;
    }

    if (currentOptions.items && currentOptions.useDivider) {
      currentOptions.items = currentOptions.items
        .flatMap((item) => [item, DIVIDER])
        .slice(0, -1);
    }
  }

  /**
   * Checks if the user has a specific permission.
   * @param {string} permission - The permission to check.
   * @returns {boolean} True if the user has the permission, false otherwise.
   */
  isNavEnabled(nav: NavItem | SubMenuItem, itemType: NAV_ITEM_TYPE): boolean {
    if (nav.type !== itemType) {
      return false;
    }

    // if (!linkType || (nav.linkType ?? 'link') !== linkType) {
    //   return false;
    // }

    if (!nav.permission) {
      return true;
    }

    return this.authService.hasPermission(nav.permission);
  }

  getLinkContext(item: NavItem, submenuItem?: SubMenuItem): TemplateContext {
    // let linkClass: string[] = [];
    // if (submenuItem) {
    //   linkClass = [
    //     'dropdown-item',
    //     item.submenu!.linkClass ?? '',
    //     submenuItem.class ?? '',
    //   ]
    // }
    // else {
    //   linkClass = [
    //     'nav-link',
    //     this.config.linkClass ?? '',
    //     item.class ?? '',
    //   ]
    // }

    return {
      $implicit: {
        item: submenuItem ?? item,
        offcanvasTarget: this.offcanvasTarget(),
        // class: linkClass.join(' ').trim(),
        class: [
          submenuItem ? 'dropdown-item' : 'nav-link',
          (submenuItem ? item.submenu?.linkClass : this.config.linkClass) ?? '',
          (submenuItem ? submenuItem.class : item.class) ?? '',
        ]
          .join(' ')
          .trim(),
      },
    };
  }

  static customDivider(options: Partial<NavItem>): NavItem {
    return { ...DIVIDER, ...options };
  }
}

export interface NavbarOptions extends ConfigOptions {
  id?: string;
  type: 'header' | 'footer' | 'sidebar';
  breakpoint?: BREAKPOINT;
  offcanvas?: OffcanvasOptions;
  navClass?: string; // class for <nav> tag
  menuClass?: string; // class for <ul> tag
  itemClass?: string; // class for each <li> tag; shortcut to avoid repetition in each item
  linkClass?: string; // class for each <a> tag; shortcut to avoid repetition in each item
  items?: NavItem[];
  useDivider?: boolean;
}

export {
  DIVIDER,
  type NAV_ITEM_TYPE,
  type NAV_LINK_TYPE,
  type NavItem,
  type NavLink,
  type SubMenuItem,
};
