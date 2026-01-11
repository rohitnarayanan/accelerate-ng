// external imports
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

// internal imports
import {
  DIVIDER,
  FooterComponent,
  FooterOptions,
  HeaderComponent,
  HeaderOptions,
  ModalComponent,
  ModalOptions,
  StyleHelper,
  UserSettingsService,
} from '@rn-accelerate-ng/bootstrap';

//
// component definition
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ModalComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  styleHelper: StyleHelper = inject(StyleHelper);
  userSettingService: UserSettingsService = inject(UserSettingsService);

  title = 'accelerate-ng';

  @ViewChild('faqModal') private faqModal!: ModalComponent;

  // header
  protected headerOptions: HeaderOptions = {
    id: 'header',
    bgColor: 'primary',
    // headerClass: 'pb-0',
    // containerClass: 'pt-0',
    watermark: {
      text: 'Demo',
      // class: 'text-bg-danger',
      breakpoint: 'xxl',
    },
    brand: {
      logo: { src: 'https://vite.dev/logo.svg', height: 30, width: 30 },
      text: 'Accelerate',
      class: 'text-danger', // position-absolute top-50 start-50 translate-middle'
    },
    // title: {
    //   text: 'Accelerate', class: ''
    // },
    navbar: {
      type: 'header',
      breakpoint: 'xl',
      class: 'gap-2',
      offcanvas: {
        direction: 'end',
        // toggler: {
        //   icon: 'person-slash'
        // },
        // header: {
        //   title: 'Main Menu',
        // }
      },
      // itemClass: 'text-warning nav-pills',
      items: [
        { type: 'link', label: 'Home', href: '/home', class: 'active' },
        { type: 'link', label: 'Getting Started', href: '/getting-started' },
        { type: 'link', label: 'Guides', href: '/guides' },
        { type: 'link', label: 'Components', href: '/components' },
        DIVIDER,
        {
          type: 'color-mode',
          submenu: { type: 'dropdown', class: 'dropdown-menu-end' },
        },
        DIVIDER,
        {
          type: 'submenu',
          label: 'User',
          submenu: {
            type: 'dropdown',
            class: 'dropdown-menu-end',
            items: [
              { type: 'link', label: 'Profile', href: 'user/profile' },
              { type: 'link', label: 'Settings', href: 'user/settings' },
            ],
          },
        },
      ],
    },
    position: {
      brand: 'left',
      menu: 'right',
      toggler: 'right',
    },
  };

  // footer
  protected footerOptions: FooterOptions = {
    id: 'footer',
    // bgColor: 'success',
    // footerClass: 'pt-0',
    // containerClass: 'pt-0',
    breakpoint: 'md',
    brand: {
      logo: { src: 'accelerate-ng.webp', height: 30, width: 30 },
    },
    copyright: '© 2024 Company, Inc',
    // brand: { text: 'Accelerate', class: 'text-primary' },
    navbar: {
      type: 'footer',
      // menuClass: 'border border-primary',
      // itemClass: 'lead',
      // linkClass: 'text-success',
      items: [
        {
          type: 'url',
          label: 'Google',
          href: 'https://www.google.com/',
          target: '_blank',
        },
        {
          type: 'callback',
          label: 'Features',
          href: '#',
          callback: () => alert('Features Clicked'),
        },
        {
          type: 'submenu',
          label: 'Menu',
          submenu: {
            type: 'dropup',
            items: [
              {
                type: 'url',
                class: 'text-primary',
                label: 'Item 1',
                href: '#',
              },
              { type: 'url', label: 'Item 2', href: '#' },
            ],
          },
        },
        {
          type: 'callback',
          label: 'FAQs',
          callback: () => this.faqModal.open(),
        },
        {
          type: 'color-mode',
          class: 'color-mode',
          submenu: { type: 'dropup', class: 'dropdown-menu-end' },
        },
      ],
      useDivider: true,
    },
    // menuPosition: 'right'
  };

  // modal
  protected faqModalOptions: ModalOptions = {
    backdrop: 'static',
    header: {
      text: 'Help',
      icon: 'shield-exclamation',
      classes: 'text-bg-primary',
    },
    cancelBtn: { class: 'primary', label: 'Close' },
  };
}
