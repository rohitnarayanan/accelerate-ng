// external imports
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Validators } from '@angular/forms';

// internal imports
import {
  AccelerateAuthConfig,
  ACCELERATE_AUTH_CONFIG_TOKEN,
  AuthBackendService,
  AuthFrontendConfig,
  LoginResponse,
} from '@rn-accelerate-ng/auth';
import { GenericType } from '@rn-accelerate-ng/core';
import { AlertComponent } from '../alert/alert.component';
import { AbstractBaseComponent } from '../app.component';
import { ConfigOptions } from '../bootstrap.component';
import { STYLE } from '../bootstrap.types';
import { DropdownFieldComponent, FormComponent, FormOptions } from '../form';

// config options
export interface AuthOptions extends ConfigOptions {
  errorStyle: STYLE;
  userType?: {
    label: string;
    value: string;
  };
  users: GenericType[];
  mock?: boolean;
}

// component defintion
@Component({
  selector: 'ang-auth',
  imports: [
    CommonModule,
    AlertComponent,
    FormComponent,
    DropdownFieldComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent extends AbstractBaseComponent<AuthOptions> {
  private authConfig?: AuthFrontendConfig = inject<AccelerateAuthConfig>(
    ACCELERATE_AUTH_CONFIG_TOKEN,
  ).frontend;
  private authBackendService: AuthBackendService = inject(AuthBackendService);

  private mode: 'login' | 'logout' = 'login';
  private returnUrl = '';

  protected authError: WritableSignal<string | undefined> = signal<
    string | undefined
  >(undefined);

  @ViewChild('loginForm') private loginForm!: FormComponent;

  override ngOnInit(): void {
    super.ngOnInit();

    this.mode = this.routeService.queryParams['mode'] ?? 'login';
    this.returnUrl = this.routeService.queryParams['returnUrl'] || '';
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (this.mode === 'logout') {
      this.logout();

      /** quickfix to collapse user menu as it stays open when logout is selected */
      $('#userMenu').removeClass('show').addClass('hide');
    } else if (this.isAuthenticated) {
      console.log('User is already logged in');
      this.routeService.navigateByUrl(this.returnUrl);
    }
  }

  login(): void {
    this.authBackendService
      .login(this.loginForm.rawValue['user'] as string)
      .subscribe((response: LoginResponse) => {
        if (response instanceof HttpErrorResponse) {
          this.loginError(
            'There was an error during login. Please try again or contact support.',
            response.error.message,
          );
          return;
        }

        this.loginSuccess(response.access_token);
      });
  }

  private loginSuccess(tokenStr: string): void {
    const jwtToken = this.authService.login(tokenStr);
    if (!jwtToken) {
      this.loginError(
        'There was an error during login. Please try again or contact support.',
        'Invalid Token',
      );
    } else if (
      this.authConfig?.audience &&
      jwtToken.audience !== this.authConfig.audience
    ) {
      this.loginError(
        'User does not have access to this application. Please contact support.',
        `Audience: ${this.authConfig.audience} | Profile: ${JSON.stringify(
          jwtToken,
        )}`,
      );
    } else if (
      this.authConfig?.permissions &&
      !this.authService.hasAnyPermission(...this.authConfig.permissions)
    ) {
      this.loginError(
        'User does not have access to this application. Please contact support.',
        `Permissions: ${
          this.authConfig.permissions
        } | Profile: ${JSON.stringify(jwtToken)}`,
      );
    } else {
      this.routeService.navigateByUrl(this.returnUrl);
    }
  }

  private loginError(alertMessage: string, errorMessage: string): void {
    this.alert.error(alertMessage);
    this.authError.set(errorMessage ?? 'Unknown Error');
    console.error(`Login Error: ${this.authError()}`);
    this.loginForm?.enable();

    this.authService.logout();
  }

  private logout(): void {
    this.authService.logout();
    this.authBackendService.logout().subscribe((response: unknown) => {
      if (response instanceof HttpErrorResponse) {
        super.handleErrorResponse(
          response,
          'Error during logout, try signing in again',
        );
        return;
      }

      this.alert.success('You have been logged out successfully');
    });
  }

  protected loginFormOptions: FormOptions = {
    header: 'Login',
    controls: {
      user: ['', [Validators.required]],
    },
    cancelBtn: false,
    submitBtn: 'Login',
  };

  /** ConfigurableComponent overrides **/
  override configKey = 'auth';

  override defaultOptions(): Partial<AuthOptions> {
    return {
      error: { class: 'warning' },
      userType: { label: 'name', value: 'email' },
      users: [],
      mock: false,
    };
  }
}
