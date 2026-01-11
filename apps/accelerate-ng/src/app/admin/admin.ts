//external imports
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// internal imports
import {
  AbstractBaseComponent,
  AlertComponent,
} from '@rn-accelerate-ng/bootstrap';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule, AlertComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin extends AbstractBaseComponent {
  submenuIconType = 'caret'; // 'caret' | 'chevron' | 'chevron-double'

  openSubmenu(submenuName: string, toggle = false) {
    const submenuId = 'admin-' + submenuName + '-submenu';
    const container = $('#' + submenuId);
    const icon = $('#' + submenuId + '-icon');
    const expanded = container.hasClass('show');

    if (toggle && expanded) {
      // collapse submenu
      container.collapse('hide');
      icon
        .removeClass(`bi-${this.submenuIconType}-down`)
        .addClass(`bi-${this.submenuIconType}-right`);
      return;
    }

    container.collapse('show');
    icon
      .removeClass(`bi-${this.submenuIconType}-right`)
      .addClass(`bi-${this.submenuIconType}-down`);
  }
}
