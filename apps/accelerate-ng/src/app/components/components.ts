import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// internal imports
import { RouterOutlet } from '@angular/router';
import {
  AbstractBaseComponent,
  AlertComponent,
  DIVIDER,
  Navbar,
  NavbarOptions,
} from '@rn-accelerate-ng/bootstrap';
import { ComponentRoutes } from './components.routes';

@Component({
  selector: 'app-components',
  imports: [CommonModule, RouterOutlet, AlertComponent, Navbar],
  templateUrl: './components.html',
  styleUrl: './components.scss',
})
export class Components extends AbstractBaseComponent {
  override ngAfterViewChecked(): void {
    if (window.location.pathname === '/components') {
      // route user to first components page they have permission for
      const firstRoute = ComponentRoutes.find((route) =>
        this.userHasPermission((route.data ?? {})['permission']),
      )?.path;
      console.warn(
        'Auto route to subpage:',
        window.location.pathname,
        firstRoute,
      );
      this.routeService.navigateByUrl(
        firstRoute ? `components/${firstRoute}` : '',
      );
    }
  }

  protected navbarOptions: NavbarOptions = {
    id: 'sidebarMenu',
    type: 'sidebar',
    navClass: 'py-0',
    breakpoint: 'lg',
    menuClass: 'flex-column mb-auto mx-2 mx-lg-0',
    offcanvas: {
      direction: 'start',
      toggler: {
        icon: 'grid-3x3-gap-fill',
        class: 'text-success',
      },
      header: {
        class: 'p-2 mt-2',
        title: 'Components Menu',
        // titleClass: 'text-warning',
        // closeBtn: {
        //   class: 'me-2'
        // },
      },
      body: {
        class: 'px-0 py-2',
      },
    },
    // itemClass: 'text-warning nav-pills',
    items: [
      { type: 'link', label: 'Alert', href: 'alert' },
      { type: 'link', label: 'Button', href: 'button' },
      { type: 'link', label: 'Error', href: 'error' },
      { type: 'link', label: 'Footer', href: 'footer' },
      { type: 'link', label: 'Form', href: 'form' },
      { type: 'link', label: 'Header', href: 'header' },
      { type: 'link', label: 'Modal', href: 'modal' },
      { type: 'link', label: 'Table', href: 'table' },
      DIVIDER,
      { type: 'link', label: 'Color Mode', href: 'color-mode' },
      { type: 'link', label: 'CRUD', href: 'crud' },
      DIVIDER,
      { type: 'link', label: 'User', href: 'user' },
    ],
  };
}
