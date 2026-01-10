// external imports
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

// internal imports
import { AlertComponent } from '../alert/alert.component';
import { AbstractBaseComponent } from '../app.component';
import { ConfigOptions } from '../bootstrap.component';
import { ButtonComponent } from '../button/button.component';
import {
  UserProfileComponent,
  UserProfileOptions,
} from './profile/profile.component';
import { UserSettingsComponent, UserSettingsOptions } from './settings';

// types
export interface UserOptions extends ConfigOptions {
  profile: Partial<UserProfileOptions>;
  settings: Partial<UserSettingsOptions>;
}

// component definition
@Component({
  selector: 'ang-user',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    ButtonComponent,
    UserProfileComponent,
    UserSettingsComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent
  extends AbstractBaseComponent<UserOptions>
  implements OnInit
{
  subpath = '';

  /** Lifecycle methods **/
  override ngOnInit(): void {
    super.ngOnInit();
    this.subpath =
      this.routeService.currentPath.split('?')[0].split('/').at(-1) ?? '';
  }

  /** ConfigurableComponent methods **/
  override configKey = 'user';

  override defaultOptions(): Partial<UserOptions> {
    return {
      profile: {
        enabled: true,
      },
      settings: {
        enabled: true,
      },
    };
  }
}
